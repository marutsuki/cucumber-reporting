#!/usr/bin/env node
import { renderReport } from './src/index';

let reportPath: string | null = null;
let outPath = 'out';
let projDir: string | null = null;
let theme = 'light';
let appName = '[Undefined]';
let showFailedOnStart = false;

process.argv.slice(2).forEach((val) => {
    const keyValArg = val.match(/-([a-z])=(.+)/);
    const arg = val.match(/--([a-z-]+)/);
    if (keyValArg === null && arg === null) {
        if (reportPath === null) {
            reportPath = val;
        } else {
            console.error('Could not determine report file/directory path.');
            process.exit(1);
        }
    } else if (keyValArg !== null) {
        switch (keyValArg[1]) {
            case 'o': {
                outPath = keyValArg[2];
                break;
            }
            case 'p': {
                projDir = keyValArg[2];
                break;
            }
            case 't': {
                theme = keyValArg[2];
                break;
            }
            case 'n': {
                appName = keyValArg[2];
                break;
            }
            default: {
                console.error(`Unknown option: ${keyValArg[1]}`);
                process.exit(1);
            }
        }
    } else if (arg !== null) {
        switch (arg[1]) {
            case 'show-failed': {
                showFailedOnStart = true;
                break;
            }
        }
    }
});

if (reportPath === null) {
    console.error('No report path provided.');
    process.exit(1);
}

renderReport(reportPath, outPath, projDir, theme, appName, showFailedOnStart);
