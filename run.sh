#!/bin/bash

args=$( getopt bcja: $* )
set -- $args

build=0
clean=0
server_flags=

for i; do
  case "$i" in
    -a)
        server_flags="${server_flags} -a $2"
        shift; shift;;
    -j)
        server_flags="${server_flags} -j"
        shift;;
    -b)
        build=1
        shift;;
    -c)
        clean=1
        shift;;
    --)
        shift
        break;;
  esac
done

if [[ $build == "1" ]]; then
    set -x
    cd -P "$( dirname "${BASH_SOURCE[0]}" )"
    mkdir -p gen
    mkdir -p data
    ./node_modules/node-sass/bin/node-sass -o gen client/scss/styles.scss || exit 1
    curl https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv > data/us-counties.csv || exit 1
    curl https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv > data/us-states.csv || exit 1
    curl https://raw.githubusercontent.com/nytimes/covid-19-data/master/us.csv > data/us.csv || exit 1
    exit 0
fi

if [[ $clean == "1" ]]; then
    set -x
    cd -P "$( dirname "${BASH_SOURCE[0]}" )"
    rm -rf gen
    rm -f data/us-counties.csv data/us-states.csv data/us.csv
    exit 1;
fi

npm install

#echo nodemon -V -w server.coffee server.coffee ${server_flags} $@
#nodemon -V -w server.coffee server.coffee ${server_flags} $@

mkdir -p gen
./node_modules/node-sass/bin/node-sass -w -o gen client/scss/styles.scss &

node server.js ${server_flags} $@

