import fs from 'fs';
import readFeatures from '@reading/read';
import path from 'path';
import { Config } from '@config';
import partition from '@processing/partition';
import { featureFailed, getTestSuiteStats } from '@processing/stats';
import render from '@ui/render';
import { PAGE_SIZE, PARTITION_SIZE } from '@constants';
import generate from '@processing/prefix-tree';
import { writeFilePromise } from '@util/file';

console.debug = (message: string, ...args: unknown[]) => {
    if (Config.getConfig('verbose')) {
        console.info(message, ...args);
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
    Config.setConfig('verbose', verbose);

    if (showFailed) {
        console.info('Showing failed scenarios by default');
    }

    if (projDir) {
        console.info('Using project directory:', projDir);
    }

    console.info('Using theme:', theme);

    console.info('Processing JSON report files found under:', reportPath);
    const features = await readFeatures(reportPath);

    console.info('Features loaded into memory');

    features.sort((a, b) => a.name.localeCompare(b.name));
    console.debug('Sorted features by name');
    const scriptsPath = path.join(outPath, 'scripts');

    const partitions = Math.ceil(features.length / PARTITION_SIZE);
    const stats = getTestSuiteStats(features);
    console.debug('Test suite stats generated');

    const failedFeatures = features.filter((f) => featureFailed(f));

    console.debug('Failed features filtered, count:', failedFeatures.length);

    fs.mkdirSync(scriptsPath, { recursive: true });
    fs.mkdirSync(path.join(outPath, 'data/all'), { recursive: true });
    fs.mkdirSync(path.join(outPath, 'data/failed'), { recursive: true });

    console.debug('Generated output directories');

    return Promise.all([
        partition(features, stats).map((p, i) =>
            writeFilePromise(
                path.join(outPath, 'data/all', `data-${i}.json`),
                p
            )
        ),

        partition(failedFeatures, stats).map((p, i) =>
            writeFilePromise(
                path.join(outPath, 'data/failed', `failed-${i}.json`),
                p
            )
        ),

        writeFilePromise(
            path.join(outPath, 'global.json'),
            `{ "failedPages": ${Math.ceil(failedFeatures.length / PAGE_SIZE)}, "pages": ${Math.ceil(features.length / PAGE_SIZE)} }`
        ),

        writeFilePromise(
            path.join(outPath, 'prefix-tree-data.json'),
            JSON.stringify(generate(features))
        ),

        writeFilePromise(
            path.join(outPath, 'prefix-tree-failed.json'),
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

        render(appName, stats, partitions, theme, showFailed).then((document) =>
            writeFilePromise(path.join(outPath, 'index.html'), document)
        ),
    ]);
}
