import fs from 'fs';
import processFeature from './processing/process';
import render from './rendering';
import path from 'path';

// TODO: Make directories processable
const featurePath = process.argv[2];
const outPath = process.argv[3];

if (!featurePath) {
    console.error('No feature path provided.');
    process.exit(1);
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
