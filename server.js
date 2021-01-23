const csvparse = require('csv-parser');
const express = require('express');
const fs = require('fs');
const https = require('https');
const md = require('markdown-it')({ html: true });
const path = require('path');

const COUNTIES_CSV_PATH = path.join(__dirname, 'us-counties.csv');

function parseCsv(path) {
    return new Promise(cb => {
        console.log("Loading csv...");
        let res = [];
        fs.createReadStream(path)
            .pipe(csvparse())
            .on('error', (err) => { throw err; })
            .on('data', (data) => res.push(data))
            .on('end', () => {
                cb(res);
            });
    });
};

let g_populations;
function loadPop() {
    //
    // Population estimate data originally fetched from US Census API
    //   https://api.census.gov/data/2019/pep/population?get=NAME,POP&for=county:*
    //
    // To fetch data for just one FIPS code do this:
    //   https://api.census.gov/data/2019/pep/population?get=NAME,POP&for=county:091&in=state:36
    // where "36" are the first two digits of the FIPS code and "091" are the last three.
    //
    return new Promise(cb => {
        let raw = fs.readFileSync(path.join(__dirname, 'pop.json'));
        cb(JSON.parse(raw));
    });
}

let g_counties;

// Note: this can be called multiple times to re-load data.
async function initialize() {
    let counties = await parseCsv(COUNTIES_CSV_PATH);
    console.log(`...parse of ${ counties.length } entries complete.`);

    let populations = await loadPop();

    populations = populations.filter( (i) => {
        // Remove any county that doesn't appear in the NYT data
        let fips = i[2] + '' + i[3];
        let found = counties.findIndex((j) => j.fips == fips) >= 0;
        if (!found) {
            console.log("Removing county " + i[0]);
        }
        return found;
    });
    // Add a fake New York City "county" to the list.
    populations.push(["New York City, New York",
                      "8419000", "36", "000"]);

    // Give the fake New York City a "36000" fips code.
    counties = counties.map( (i) => {
        if (i.county == "New York City") {
            i.fips = "36000";
        }
        return i;
    });

    g_counties = counties;
    g_populations = populations;

    console.log("Done");
};

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'vash');

app.use((req, res, next) => {
    let old_end = res.end;
    res.end = (...restArgs) => {
        console.log('%s %s %s -> %d', new Date().toUTCString(),
                    req.method, req.url, res.statusCode);
        old_end.apply(res, restArgs);
    };
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'gen')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/knockout/build/output')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use(express.static(path.join(__dirname, 'node_modules/chart.js/dist')));

app.get('/fips/:fips(\\d+)', (req, res) => {
    res.send(g_counties.filter( i => i.fips == req.params.fips ));
});

app.get('/pop19/:statecode(\\d{2}):countycode(\\d{3})', (req, res) => {
    let ent = g_populations.filter( i => (i[2] == req.params.statecode
                                          && i[3] == req.params.countycode) )[0];
    res.send({ name: ent[0], pop: ent[1] });
});

app.get('/counties/:statecode(\\d{2})', (req, res) => {
    let counties = g_populations.filter( i => (i[2] == req.params.statecode) );
    res.send(counties);
});

app.get('/county/:statecode(\\d{2})', (req, res) => {
    let counties = g_populations.filter( i => (i[2] == req.params.statecode) );
    res.render('county', {
        counties: counties,
    });
});

app.get('/data/:statecode(\\d{2}):countycode(\\d{3})', (req, res) => {
    let fips = req.params.statecode + '' + req.params.countycode;
    let data = g_counties.filter( i => i.fips == fips );
    let pop19 = g_populations.filter( i => (i[2] == req.params.statecode
                                            && i[3] == req.params.countycode) )[0];
    res.render('data', {
        pop: pop19,
        data: data
    });
});

app.get('/dl-counties', (req, res) => {
    if (process.env.NODE_ENV == 'production') {
        let cronheader = req.header('X-Appengine-Cron');
        if (!cronheader) {
            console.error("Bad cron header: " + cronheader);
            throw new Error('Access denied.');
        }
        res.sendStatus(200);
    }

    console.log("Downloading new county data...");
    // TODO: consider using a higher-level http fetcher that handles 302 redirects.
    https.get('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv',
              (httpres) => {
                  console.log("Status: " + httpres.statusCode);
                  if (httpres.statusCode !== 200) {
                      console.error("Download request failed w/ status: " + httpres.statusCode);
                      console.dir(httpres.headers);
                      httpres.resume();
                      //res.sendStatus(500);
                      return;
                  }
                  let file = fs.createWriteStream(COUNTIES_CSV_PATH);
                  httpres.pipe(file);
                  httpres.on('end', () => {
                      console.log("Successfully completed download of us-counties.csv");
                      initialize().then( () => {
                          console.log("Re-initialize complete");
                          //res.send('ok');
                      });
                  });
                  httpres.on('err', (e) => { console.err(e); /*res.send(500);*/ } );
              });
});

app.get('/learnmore', (req, res) => {
    let raw = fs.readFileSync(path.join(__dirname, "client/md/learnmore.md"), 'utf8');
    res.render('text', {
        md: md.render(raw)
    });
});

app.get('/', (req, res) => {
    res.render('index', {});
});

initialize().then(x => {
    const port = Number(process.env.PORT || 3000);
    app.listen(port, () => {
        console.log(`Listening on port ${ port }`);
    });
});

