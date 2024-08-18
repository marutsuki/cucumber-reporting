import fs from 'fs';
import readFeatures from '@reading/read';
import path from 'path';
import { Config } from '@config';
import partition from '@processing/partition';
import { getTestSuiteStats } from '@data/stats';
import render from '@ui/render';
import { PARTITION_SIZE } from '@constants';
import generate from '@processing/prefix-tree';
import { writeFilePromise } from '@data/file';

console.debug = (message: string, ...args: unknown[]) => {
    if (Config.getConfig('verbose')) {
        console.info(message, args);
    }
};

type RenderReportOptions = {
    reportPath: string;
    outPath: string;
    projDir: string;
    theme: string;
    appName: string;
    showFailed: boolean;
    verbose: boolean;
};

export async function renderReport(
    reportPath: string,
    {
        outPath = 'out',
        projDir, // TODO: NOT WORKING.
        theme = 'dark',
        appName = '[Undefined]',
        showFailed = false,
        verbose = false,
    }: Partial<RenderReportOptions>
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
    const features = await readFeatures(reportPath);

    console.info('Features loaded into memory');

    features.sort((a, b) => a.name.localeCompare(b.name));
    console.debug('Sorted features by name');
    const scriptsPath = path.join(outPath, 'scripts');
    fs.mkdirSync(scriptsPath, { recursive: true });
    console.debug('Generated scripts directory');

    const partitions = Math.ceil(features.length / PARTITION_SIZE);
    const stats = getTestSuiteStats(features);
    console.debug('Test suite stats generated');

    Promise.all([
        partition(outPath, features, stats, 'data').catch((err) => {
            console.error('An error occurred:', err);
        }),

        partition(outPath, features, stats, 'failed', true).catch((err) => {
            console.error('An error occurred:', err);
        }),

        writeFilePromise(
            path.join(outPath, 'prefix-tree-data.json'),
            JSON.stringify(generate(features))
        ),

        writeFilePromise(
            path.join(outPath, 'prefix-tree-data.json'),
            JSON.stringify(generate(features, true))
        ),

        new Promise<void>((resolve, reject) => {
            const from = path.join(__dirname, 'scripts');
            console.debug('Copying scripts from', from, 'to', scriptsPath);
            fs.cp(from, scriptsPath, { recursive: true }, (err) => {
                if (err) {
                    console.error(`An error occurred: ${err}`);
                    reject();
                } else {
                    console.debug('Scripts copied');
                    resolve();
                }
            });
        }),

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
                            console.info('Static HTML markup rendered');
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
