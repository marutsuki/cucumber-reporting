#!/usr/bin/env node
import { renderReport } from './src/index';
import yargs from 'yargs';

const argv = yargs
    .options({
        o: { type: 'string', alias: 'output', default: 'out' },
        p: { type: 'string', alias: 'proj-loc', default: null },
        t: { type: 'string', alias: 'theme', default: 'dark' },
        n: { type: 'string', alias: 'app-name', default: '[undefined]' },
        f: { type: 'boolean', alias: 'show-failed', default: false },
        i: { type: 'string', alias: 'input', default: null },
        v: { type: 'boolean', alias: 'verbose', default: false },
    })
    .positional('report-dir', {
        describe: 'The report directory to read from',
    })
    .parseSync();

const reportPath = argv.i;
if (reportPath === null) {
    console.error('No report path provided.');
    process.exit(1);
}

renderReport(reportPath, argv.o, argv.p, argv.t, argv.n, argv.f, argv.v);
