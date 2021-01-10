
const fs = require('fs').promises;
const express = require('express');
const csvparse = require('csv-parse/lib/sync');

let counties;

(async function() {
    const content = await fs.readFile('../covid-19-data/us-counties.csv');
    counties = csvparse(content);
    console.log('parsing complete');
})();

const app = express();

app.use((req, res, next) => {
    res.send(JSON.stringify(counties));
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
