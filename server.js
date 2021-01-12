
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

const app = express();

app.use((req, res, next) => {
    console.log('%s %s', req.method, req.url);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/knockout/build/output')));

app.get('/fips/:fips(\\d+)', (req, res) => {
    res.send(g_counties.filter( i => i.fips == req.params.fips));
});


const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    console.log(`Listening on port ${ port }`);
});
