import fs from 'fs';
import processFeature from './processing/process';
import path from 'path';
import { Config } from './config';
import createDataJs from './create-datajs';
import { getTestSuiteStats } from './data/stats';
import render from './ui/render';
import { PARTITION_SIZE } from '../constants';

console.debug = (message: string, ...args: unknown[]) => {
    if (Config.getConfig('verbose')) {
        console.info(message, args);
    }
};

export async function renderReport(
    reportPath: string,
    outPath: string,
    projDir: string | null,
    theme: string,
    appName: string,
    showFailed: boolean,
    verbose: boolean
) {
    if (showFailed) {
        console.info('Showing failed scenarios by default');
        Config.setConfig('showFailedOnStart', showFailed);
    }

    if (projDir) {
        console.info('Using project directory:', projDir);
        Config.setConfig('projDir', projDir);
    }

    Config.setConfig('theme', theme);
    console.info('Using theme:', theme);

    Config.setConfig('verbose', verbose);

    console.info('Processing JSON report files found under:', reportPath);
    const features = await processFeature(reportPath);

    console.info('Static HTML markup rendered');

    fs.mkdirSync(path.join(outPath, 'scripts'), { recursive: true });

    const partitions = Math.ceil(features.length / PARTITION_SIZE);
    const stats = getTestSuiteStats(features);

    Promise.all([
        createDataJs(outPath, features, stats, 'data'),

        createDataJs(outPath, features, stats, 'failed', true),

        new Promise<void>((resolve, reject) =>
            fs.cp(
                path.join(__dirname, '../scripts'),
                path.join(outPath, 'scripts'),
                { recursive: true },
                (err) => {
                    if (err) {
                        console.error(`An error occurred: ${err}`);
                        reject();
                    } else {
                        console.debug('engine.js copied');
                        resolve();
                    }
                }
            )
        ),

        new Promise<void>((resolve, reject) =>
            render(appName, stats, partitions).then((document) =>
                fs.writeFile(
                    path.join(outPath, 'index.html'),
                    document,
                    (err) => {
                        if (err) {
                            console.error(`An error occurred: ${err}`);
                            reject();
                        } else {
                            console.debug('output.html created');
                            resolve();
                        }
                    }
                )
            )
        ),
    ])
        .then(() => {
            console.info('Done.');
            process.exit(0);
        })
        .catch(() => {
            console.error('Something went wrong.');
            process.exit(1);
        });
}
