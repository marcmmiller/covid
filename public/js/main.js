
const g_states = [["Alabama","AL","01"],["Alaska","AK","02"],["Arizona","AZ","04"],["Arkansas","AR","05"],["California","CA","06"],["Colorado","CO","08"],["Connecticut","CT","09"],["Delaware","DE","10"],["Florida","FL","12"],["Georgia","GA","13"],["Hawaii","HI","15"],["Idaho","ID","16"],["Illinois","IL","17"],["Indiana","IN","18"],["Iowa","IA","19"],["Kansas","KS","20"],["Kentucky","KY","21"],["Louisiana","LA","22"],["Maine","ME","23"],["Maryland","MD","24"],["Massachusetts","MA","25"],["Michigan","MI","26"],["Minnesota","MN","27"],["Mississippi","MS","28"],["Missouri","MO","29"],["Montana","MT","30"],["Nebraska","NE","31"],["Nevada","NV","32"],["New Hampshire","NH","33"],["New Jersey","NJ","34"],["New Mexico","NM","35"],["New York","NY","36"],["North Carolina","NC","37"],["North Dakota","ND","38"],["Ohio","OH","39"],["Oklahoma","OK","40"],["Oregon","OR","41"],["Pennsylvania","PA","42"],["Rhode Island","RI","44"],["South Carolina","SC","45"],["South Dakota","SD","46"],["Tennessee","TN","47"],["Texas","TX","48"],["Utah","UT","49"],["Vermont","VT","50"],["Virginia","VA","51"],["Washington","WA","53"],["West Virginia","WV","54"],["Wisconsin","WI","55"],["Wyoming","WY","56"]];


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
            tooltips: {
                intersect: false,
                mode: 'index',
                axis: 'x',
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
            tooltips: {
                intersect: false,
                mode: 'index',
                axis: 'x',
            }
        }
    });
}


const g_underreportingFactor = 3.2;
let g_D;

function selectCounty(fips) {
    ajdl('/pop19/36091', (popres) => {
        ajdl('/fips/36091', (res) => {
            g_D = res;
            ActiveCalc.add(res);
            let pop = Number(popres.pop);
            let latest = res[res.length - 1];
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
                name: popres.name,
                pop: popres.pop,
                latest: latest,
                avg7: avg7.toFixed(2),
                avg7Per100K: avg7Per100K.toFixed(2),
                estActive: estActive,
                estActivePer100K: estActivePer100K.toFixed(2),
                estActivePct: estActivePct.toFixed(2),
                groupSize: groupSize,
                groupRisk: groupRisk
            };
            ko.applyBindings(viewModel, $('data-app').get(0));
            casesChart(res);
            deathsChart(res);
        });
    });
}

$( document ).ready( () => {
    let nest = [];
    for (let i = 0; i < g_states.length; ++i) {
        if (i % 10 == 0) {
            nest.push([]);
        }
        nest[nest.length - 1].push(g_states[i]);
    }

    let viewModel = {
        stategroups: nest
    };
    ko.applyBindings(viewModel, $('#select-state').get(0));
});

