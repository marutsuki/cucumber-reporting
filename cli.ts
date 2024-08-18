#!/usr/bin/env node
import { renderReport } from './src/index';
import yargs from 'yargs';

const argv = yargs
    .options({
        o: { type: 'string', alias: 'output' },
        p: { type: 'string', alias: 'proj-loc' },
        t: { type: 'string', alias: 'theme' },
        n: { type: 'string', alias: 'app-name' },
        f: { type: 'boolean', alias: 'show-failed' },
        i: { type: 'string', alias: 'input' },
        v: { type: 'boolean', alias: 'verbose' },
    })
    .positional('report-dir', {
        describe: 'The report directory to read from',
    })
    .parseSync();

const reportPath = argv.i;
if (reportPath === undefined) {
    console.error('No report path provided.');
    process.exit(1);
}

renderReport(reportPath, {
    outPath: argv.o,
    projDir: argv.p,
    theme: argv.t,
    appName: argv.n,
    showFailed: argv.f,
    verbose: argv.v,
})
    .then(() => {
        console.info('Done.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('An error occurred:', err);
        process.exit(1);
    });
