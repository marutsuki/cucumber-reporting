import * as fs from 'fs';
import { Feature } from '../types';
import path from 'path';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';

export default async function readFeatures(
    filePath: string
): Promise<Feature[]> {
    console.debug('Processing feature/directory:', filePath);
    return new Promise<Feature[]>((resolve) => {
        if (fs.existsSync(filePath) === false) {
            return resolve([]);
        }
        if (fs.lstatSync(filePath).isFile()) {
            if (!filePath.endsWith('.json')) {
                return resolve([]);
            }
            const features: Feature[] = [];
            const parseStream = fs
                .createReadStream(filePath, {
                    encoding: 'utf8',
                })
                .pipe(parser())
                .pipe(streamArray());
            parseStream.on('data', (data: { key: number; value: Feature }) => {
                features.push(data.value);
            });
            parseStream.on('error', () => {
                resolve([]);
            });
            parseStream.on('end', () => {
                resolve(features);
            });
        } else {
            return Promise.all(
                fs
                    .readdirSync(filePath)
                    .map((f) => readFeatures(path.join(filePath, f)))
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
}
