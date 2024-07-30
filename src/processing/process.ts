import * as fs from 'fs';
import { Feature } from './types';
import path from 'path';
import { createParseStream } from 'big-json';

export default async function processFeature(
    filePath: string
): Promise<Feature[]> {
    console.debug('Processing feature/directory:', filePath);
    const p = new Promise<Feature[]>((resolve) => {
        if (fs.existsSync(filePath) === false) {
            return resolve([]);
        }
        if (fs.lstatSync(filePath).isFile()) {
            const readStream = fs.createReadStream(filePath);
            const parseStream = createParseStream();
            parseStream.on('data', (data) => {
                resolve(data as Feature[]);
            });
            parseStream.on('error', () => {
                resolve([]);
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
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

    return p;
}
