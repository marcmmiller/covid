
function addActive(data) {
    let prev = 0;
    let active15 = 0;
    for (let i = 0; i < data.length; ++i) {
        let cases = Number(data[i].cases);
        let newc = cases - prev;
        data[i].newc = newc;
        active15 += newc;
        if (i >= 15) {
            active15 -= data[i-15].newc;
        }
        data[i].active15 = active15;
        prev = cases;
    }
}


$( document ).ready( () => {
    $.ajax({
        url: '/fips/36091',
        dataType: 'json',
        success: (res) => {
            addActive(res);
            let vm = { counties: res };
            ko.applyBindings(vm, $('#moo').get(0));
        },
        error: (jqxhr, tStatus, tError) => {
            alert("Ajax error.");
        }
    });
});

