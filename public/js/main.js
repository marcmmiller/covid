
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

const g_underreportingFactor = 4;

$( document ).ready( () => {
    ajdl('/pop19/36091', (popres) => {
        ajdl('/fips/36091', (res) => {
            ActiveCalc.add(res);
            let pop = Number(popres.pop);
            let latest = res[res.length - 1];
            let avg7 = latest.last7 / 7;
            let avg7Per100K = avg7 / (pop / 100000);
            let estActive = latest.active[10] * g_underreportingFactor;
            let estActivePer100K = estActive / (pop / 100000);
            let viewModel = {
                name: popres.name,
                pop: popres.pop,
                latest: latest,
                avg7: avg7.toFixed(2),
                avg7Per100K: avg7Per100K.toFixed(2),
                estActive: estActive,
                estActivePer100K: estActivePer100K.toFixed(2)
            };
            ko.applyBindings(viewModel); //, $('#moo').get(0));
        });
    });
});

