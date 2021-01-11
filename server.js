
const fs = require('fs');
const express = require('express');
const csvparse = require('csv-parser');

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

let counties;
parseCsv(COUNTIES_CSV_PATH, (res) => {
    console.log(`...parse of ${ res.length } entries complete.`);
    counties = res;
});

const app = express();


app.get('/county/:fips(\\d+)', (req, res) => {
    res.send(counties.filter( i => i.fips == req.params.fips));
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    console.log(`Listening on port ${ port }`);
});
