

function comparator(a, b) {
    if (a > b) return 1;
    else if (a < b) return -1;
    else return 0;
};

// Calculate active cases for all window-sizes of "active": 10-day days
class ActiveCalc {
    constructor () {
        this.active = new Array(11);  // tracking 10-20 days = 11 elts
        this.active.fill(0);
    }
    advance(data, i) {
        data[i].active = new Array(11);
        for (let j = 0; j < 11; ++j) {
            this.active[j] += data[i].newc;
            if (i >= j+10) {
                this.active[j] -= data[i-(j+10)].newc;
            }
            data[i].active[j] = this.active[j];
        }
    }
    static add(data) {
        let last7 = 0;
        let prev = 0;
        let a = new ActiveCalc();
        for (let i = 0; i < data.length; ++i) {
            let cases = Number(data[i].cases);
            let newc = cases - prev;
            data[i].newc = newc;
            prev = cases;

            a.advance(data, i);

            last7 += newc;
            if (i >= 7)  {
                last7 -= data[i - 7].newc;
            }
            data[i].last7 = last7;
        }
    }
}

function ajdl(url, cb) {
    $.ajax({
        url: url,
        dataType: 'json',
        success: (res) => { cb(res); },
        error: (jqxhr, tStatus, tError) => {
            console.log(jqxhr, tStatus, tError);
            alert("Ajax error: " + tError);
        }
    });
}

function casesChart(data) {
    let ctx = $('#cases-per-day').get(0).getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(i => i.date),
            datasets: [{
                label: '20-day Active Positive Tests',
                borderWidth: 2,
                borderColor: 'rgb(255, 99, 132)',
                pointRadius: 0,
                data: data.map(i => i.active[10])
            }]
        },
        options: {
            legend: false,
            tooltips: {
                intersect: false,
                mode: 'index',
                axis: 'x',
            },
            scales: {
                xAxes: [{
                    ticks: {
                        maxTicksLimit: 10
                    }
                }]
            }
        }
    });
}

function deathsChart(data) {
    let ctx = $('#deaths-per-day').get(0).getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(i => i.date),
            datasets: [{
                label: 'Deaths',
                borderWidth: 2,
                borderColor: 'rgb(99, 99, 99)',
                pointRadius: 0,
                data: data.map(i => i.deaths)
            }]
        },
        options: {
            legend: false,
            tooltips: {
                intersect: false,
                mode: 'index',
                axis: 'x',
            },
            scales: {
                xAxes: [{
                    ticks: {
                        maxTicksLimit: 10
                    }
                }]
            }
        }
    });
}

const g_underreportingFactor = 3.2;

function showCountyData() {
    ActiveCalc.add(g_data);
    let pop = Number(g_pop[1]);
    let latest = g_data[g_data.length - 1];
    let avg7 = latest.last7 / 7;
    let avg7Per100K = avg7 / (pop / 100000);
    let estActive = latest.active[10] * g_underreportingFactor;
    let estActivePer100K = estActive / (pop / 100000);
    let estActivePct = estActivePer100K / 1000;
    let groupSize = ko.observable();
    let groupRisk = ko.observable();
    groupSize.subscribe((val) => {
        let r = 1 - Math.pow(1-estActivePct/100, Number(groupSize()));
        groupRisk((r * 100).toFixed(2));
    });
    groupSize(25);
    let viewModel = {
        name: g_pop[0],
        pop: pop,
        latest: latest,
        avg7: avg7.toFixed(2),
        avg7Per100K: avg7Per100K.toFixed(2),
        estActive: estActive.toFixed(2),
        estActivePer100K: estActivePer100K.toFixed(2),
        estActivePct: estActivePct.toFixed(2),
        groupSize: groupSize,
        groupRisk: groupRisk
    };
    ko.applyBindings(viewModel, $('#data-app').get(0));
    $('#data-app').show();
    $('#groupsize-range').on('input change', (e) => {
        groupSize($('#groupsize-range').val());
    });
    casesChart(g_data);
    deathsChart(g_data);
}

function selectState() {
    let states = [];
    for (let f of Object.keys(g_states)) {
        g_states[f].fips = f;
        g_states[f].avg7 = g_states[f].last7 / 7;
        g_states[f].avg7Per100K =
            g_states[f].avg7 / (g_states[f].pop / 100000);
        if (g_states[f].abbrev) {
            states.push(g_states[f]);
        }
    }
    states.sort((a,b) => comparator(a.abbrev, b.abbrev));

    let viewModel = {
        states: states
    };
    ko.applyBindings(viewModel, $('#select-state').get(0));

    $('.state-btn').click((e) => {
        let fips = $(e.currentTarget).attr('data-fips');
        e.stopPropagation();
        window.location.href = '/county/' + fips;
    });

    $('#select-state').show();
}

function selectCounty(stateAbbrev) {
    g_counties.sort((a,b) => comparator(a[0], b[0]));
    let viewModel = {
        counties: g_counties,
    };
    ko.applyBindings(viewModel, $('#select-county').get(0));

    $('#id-county-buttons').click((e) => {
        if ($(e.target).is('button')) {
            let state = e.target.innerText;
            let fips = $(e.target).attr('data-fips');
            e.stopPropagation();
            window.location.href = '/data/' + fips;
        };
    });

    $('#select-county').show();
}

$( document ).ready( () => {
    let ostate = $('#select-state');
    let ocounty = $('#select-county');
    let dataapp = $('#data-app');

    if (ostate.length > 0) {
        selectState();
    }
    else if (ocounty.length > 0) {
        selectCounty();
    }
    else if (dataapp.length > 0) {
        showCountyData();
    }
});
