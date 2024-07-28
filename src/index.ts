import fs from 'fs';
import processFeature from './processing/process';
import render from './rendering';
import path from 'path';
import { Config } from './config';

// TODO: Make directories processable
const featurePath = process.argv[2];
const outPath = process.argv[3];
const projDir = process.argv[4].length > 0 ? process.argv[4] : undefined;
const theme = process.argv[5].length > 0 ? process.argv[5] : undefined;

if (!featurePath) {
    console.error('No feature path provided.');
    process.exit(1);
}

if (projDir) {
    Config.setConfig('projDir', projDir);
    console.info('Using project directory:', projDir);
}

if (theme) {
    Config.setConfig('theme', theme);
    console.info('Using theme:', theme);
}

const features = processFeature(featurePath);

const document = render({ name: 'app name', features: features });

fs.writeFile(path.join(outPath, 'output.html'), document, (err) => {
    if (err) {
        console.error(`An error occurred: ${err}`);
    } else {
        console.info('Done.');
    }
    process.exit(0);
});
