import fs from 'fs';
import processFeature from './processing/process';
import render from './rendering';
import path from 'path';
import { Config } from './config';

export async function renderReport(
    reportPath: string,
    outPath: string,
    projDir: string | null,
    theme: string,
    appName: string,
    showFailedOnStart: boolean = false
) {
    if (showFailedOnStart) {
        console.info('Showing failed scenarios by default');
        Config.setConfig('showFailedOnStart', showFailedOnStart);
    }

    if (projDir) {
        Config.setConfig('projDir', projDir);
        console.info('Using project directory:', projDir);
    }

    if (theme) {
        Config.setConfig('theme', theme);
        console.info('Using theme:', theme);
    }
    const features = await processFeature(reportPath);

    const document = render({ name: appName, features: features });

    Promise.all([
        new Promise<void>((resolve, reject) =>
            fs.copyFile(
                path.join(__dirname, 'script.js'),
                path.join(outPath, 'script.js'),
                (err) => {
                    if (err) {
                        console.error(`An error occurred: ${err}`);
                        reject();
                    } else {
                        console.info('Done.');
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
                    console.info('Done.');
                    resolve();
                }
                process.exit(0);
            })
        ),
    ])
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
