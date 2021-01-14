
const fs = require('fs');
const express = require('express');
const csvparse = require('csv-parser');
const path = require('path');

const COUNTIES_CSV_PATH = '../covid-19-data/us-counties.csv';

let parseCsv = (path, cb) => {
    let res = [];
    fs.createReadStream(path)
        .pipe(csvparse())
        .on('error', (err) => { throw err; })
        .on('data', (data) => res.push(data))
        .on('end', () => {
            cb(res);
        });
};

let g_counties;
parseCsv(COUNTIES_CSV_PATH, (res) => {
    console.log(`...parse of ${ res.length } entries complete.`);
    g_counties = res;
});

let g_populations;
(() => {
    //
    // Population estimate data originally fetched from US Census API
    //   https://api.census.gov/data/2019/pep/population?get=NAME,POP&for=county:*
    //
    // To fetch data for just one FIPS code do this:
    //   https://api.census.gov/data/2019/pep/population?get=NAME,POP&for=county:091&in=state:36
    // where "36" are the first two digits of the FIPS code and "091" are the last three.
    //
    let raw = fs.readFileSync(path.join(__dirname, 'pop.json'));
    g_populations  = JSON.parse(raw);
})();

const app = express();

app.use((req, res, next) => {
    console.log('%s %s', req.method, req.url);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/knockout/build/output')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use(express.static(path.join(__dirname, 'node_modules/@popperjs/core/dist/umd')));

app.get('/fips/:fips(\\d+)', (req, res) => {
    res.send(g_counties.filter( i => i.fips == req.params.fips ));
});

app.get('/pop19/:statecode(\\d{2}):countycode(\\d{3})', (req, res) => {
    let ent = g_populations.filter( i => (i[2] == req.params.statecode
                                          && i[3] == req.params.countycode) )[0];
    res.send({ name: ent[0], pop: ent[1] });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    console.log(`Listening on port ${ port }`);
});
