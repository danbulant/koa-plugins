#!/usr/bin/env node

global.argv = require('yargs')

const chalk = require("chalk");
console = (function(oldCons){
    return {
        log: function(...text){
            if(argv.verbose)
                oldCons.log(...text);
        },
        info: function(...text){
            oldCons.info("[INFO]", ...text);
        },
        warn: function (...text) {
            oldCons.warn(chalk.yellow("[WARN]", ...text));
        },
        error: function (...text) {
            oldCons.error(chalk.red("[ERROR]", ...text));
        }
    };
}(console));

var argv = global.argv
    .command('start [port]', 'Starts the server', (yargs) => {
        yargs
            .positional('port', {
                describe: 'Port to bind on. Requires sudo on <1024',
                default: 80
            })
    }, (argv) => {
        console.info(`starting server on :${argv.port}`)
        require("../index.js")(argv.port);
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    })
    .argv