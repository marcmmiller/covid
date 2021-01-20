#!/bin/sh

args=$( getopt ja: $* )
set -- $args

server_flags=

for i; do
  case "$i" in
    -a)
        server_flags="${server_flags} -a $2"
        shift; shift;;
    -j)
        server_flags="${server_flags} -j"
        shift;;
    --)
        shift
        break;;
  esac
done

npm install

#echo nodemon -V -w server.coffee server.coffee ${server_flags} $@
#nodemon -V -w server.coffee server.coffee ${server_flags} $@

mkdir -p gen
./node_modules/node-sass/bin/node-sass -w -o gen client/scss/styles.scss &

node server.js ${server_flags} $@

