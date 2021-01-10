
const fs = require('fs');
const express = require('express');
const csvparse = require('csv-parser');
const DataStore = require('nedb');

const COUNTIES_CSV_PATH = '../covid-19-data/us-counties.csv';
const COUNTIES_DB_PATH = 'db/us-counties.db';

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

let countiesdb;

let refreshDb = (csv_path, db_path) => {
    console.log("Refreshing counties db...");
    parseCsv(csv_path, (res) => {
        console.log("  ...parse complete...");
        countiesdb = new DataStore(db_path);
        countiesdb.loadDatabase();
        countiesdb.ensureIndex({ fieldName: 'fips' }, (err) => {
            if (err) throw err;
            countiesdb.insert(res, (err, done) => {
                if (err) throw err;
                console.log(` ...done reading ${res.length} records.`);
            });
        });
    });
};

if (!fs.existsSync(COUNTIES_DB_PATH)) {
    refreshDb(COUNTIES_CSV_PATH, COUNTIES_DB_PATH);
}
else {
    console.log('1');
    countiesdb = new DataStore({ filename: COUNTIES_DB_PATH });
    console.log('2');
    countiesdb.loadDatabase();
    console.log('3');
    countiesdb.findOne({fips : '36091'}, (err, doc) => {
        console.log(err, doc);
        countiesdb.findOne({fips : '36091'}, (err, doc) => {
            console.log(err, doc);
        });
    });
}

const app = express();

app.use((req, res, next) => {
    res.send(JSON.stringify(counties));
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
