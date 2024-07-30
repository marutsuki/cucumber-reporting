import fs from 'fs';
import processFeature from './processing/process';
import render from './rendering';
import path from 'path';
import { Config } from './config';
import createDataJs from './create-datajs';

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

    const document = render({ name: appName, features: features });

    console.info('Static HTML markup rendered');

    Promise.all([
        createDataJs(outPath, features),
        new Promise<void>((resolve, reject) =>
            fs.copyFile(
                path.join(__dirname, 'script.js'),
                path.join(outPath, 'script.js'),
                (err) => {
                    if (err) {
                        console.error(`An error occurred: ${err}`);
                        reject();
                    } else {
                        console.debug('script.js copied');
                        resolve();
                    }
                }
            )
        ),

        new Promise<void>((resolve, reject) =>
            fs.writeFile(path.join(outPath, 'output.html'), document, (err) => {
                if (err) {
                    console.error(`An error occurred: ${err}`);
                    reject();
                } else {
                    console.debug('output.html created');
                    resolve();
                }
            })
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
