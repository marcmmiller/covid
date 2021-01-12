
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

$( document ).ready( () => {
    $.ajax({
        url: '/fips/36091',
        dataType: 'json',
        success: (res) => {
            ActiveCalc.add(res);
            let viewModel = {
                latest: res[res.length - 1]
            };
            ko.applyBindings(viewModel); //, $('#moo').get(0));
        },
        error: (jqxhr, tStatus, tError) => {
            alert("Ajax error.");
        }
    });
});

