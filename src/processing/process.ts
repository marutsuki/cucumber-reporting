import * as fs from 'fs';
import { Feature } from './types';
import path from 'path';

export default async function processFeature(
    filePath: string
): Promise<Feature[]> {
    console.debug('Processing feature/directory:', filePath);
    const p = new Promise<Feature[]>((resolve, reject) => {
        if (fs.existsSync(filePath) === false) {
            return resolve([]);
        }
        if (fs.lstatSync(filePath).isFile()) {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('An error occurred:', err);
                    reject();
                }
                try {
                    const features = JSON.parse(data) as Feature[];
                    resolve(features);
                } catch (err: unknown) {
                    console.debug(
                        'Tried to process:',
                        filePath,
                        "but the content isn't JSON"
                    );
                    resolve([]);
                }
            });
        } else {
            return Promise.all(
                fs
                    .readdirSync(filePath)
                    .map((f) => processFeature(path.join(filePath, f)))
            ).then((features) => {
                const flat = features.flat();
                console.debug(
                    'Processed directory',
                    filePath,
                    ':',
                    flat.length,
                    'features included'
                );
                resolve(flat);
            });
        }
    });

    return p;
}
