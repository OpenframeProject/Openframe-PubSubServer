#! /usr/bin/env node

var program = require('commander'),
    debug = require('debug')('openframe:pubsub:cli'),
    p = require('../package.json'),
    version = p.version.split('.').shift(),
    conf = {},
    server;

program
    .version(version)
    .option('-f, --file', 'Specify a .env file which includes environment vars to load.')
    .option('-v, --verbose', 'Output some extra warnings.')
    .parse(process.argv);

if (program.file) {
    debug('Use .env file');
    conf.path = program.file;
}

if (!program.verbose) {
    conf.silent = true;
}

// load env vars from a .env file
// TODO: nothing is actually taken from ENV vars right now, so this isn't
// doing anything... but it's there for the FUTURE!
require('dotenv').config(conf);

server = require('../index');
server.start();
