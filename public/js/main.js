
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
        let prev = 0;
        let a = new ActiveCalc();
        for (let i = 0; i < data.length; ++i) {
            let cases = Number(data[i].cases);
            let newc = cases - prev;
            data[i].newc = newc;
            a.advance(data, i);
            prev = cases;
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

$( document ).ready( () => {
    ajdl('/pop19/36091', (pop) => {
        ajdl('/fips/36091', (res) => {
            ActiveCalc.add(res);
            let viewModel = {
                name: pop.name,
                pop: pop.pop,
                latest: res[res.length - 1]
            };
            ko.applyBindings(viewModel); //, $('#moo').get(0));
        });
    });
});

