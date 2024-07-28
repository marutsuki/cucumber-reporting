import * as fs from 'fs';
import { Feature } from './types';
import path from 'path';

export default async function processFeature(
    filePath: string
): Promise<Feature[]> {
    console.info('Processing...');
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
                return resolve(JSON.parse(data) as Feature[]);
            });
        } else {
            return Promise.all(
                fs
                    .readdirSync(filePath)
                    .map((f) => processFeature(path.join(filePath, f)))
            ).then((features) => resolve(features.flat()));
        }
    });

    return p;
}
