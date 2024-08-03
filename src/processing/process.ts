import * as fs from 'fs';
import { Feature } from './types';
import path from 'path';

import JSONStream from 'JSONstream';

export default async function processFeature(
    filePath: string
): Promise<Feature[]> {
    console.debug('Processing feature/directory:', filePath);
    return new Promise<Feature[]>((resolve) => {
        if (fs.existsSync(filePath) === false) {
            return resolve([]);
        }
        if (fs.lstatSync(filePath).isFile()) {
            const features: Feature[] = [];
            const readStream = fs.createReadStream(filePath, {
                encoding: 'utf8',
            });
            const parseStream = JSONStream.parse('*');
            parseStream.on('data', (data: Feature) => {
                features.push(data);
            });
            parseStream.on('error', () => {
                resolve([]);
            });
            parseStream.on('end', () => {
                resolve(features);
            });
            readStream.pipe(parseStream);
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
}
