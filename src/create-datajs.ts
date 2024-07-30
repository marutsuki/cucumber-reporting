import { createStringifyStream } from 'big-json';
import { Feature } from './processing/types';
import fs from 'fs';
import path from 'path';

const PAGE_SIZE = 15;

function* generator(features: Feature[]) {
    let page = 0;
    const len = features.length;
    const pages = Math.ceil(len / PAGE_SIZE);
    while (page < pages) {
        const pageFeatures = [];
        for (
            let j = page * PAGE_SIZE;
            j < page * PAGE_SIZE + PAGE_SIZE && j < len;
            j++
        ) {
            pageFeatures.push(features[j]);
        }
        yield pageFeatures;
        page++;
    }
}
export default function createDataJs(outPath: string, features: Feature[]) {
    return new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(path.join(outPath, 'data.js'));

        writeStream.write('window.features = [');
        const gen = generator(features);
        try {
            let first = true;
            for (let page = gen.next(); !page.done; page = gen.next()) {
                if (!first) {
                    writeStream.write(',');
                }
                writeStream.write('() => ');
                writeStream.write(JSON.stringify(page.value));
                first = false;
            }
        } catch (err) {
            reject(err);
        }

        resolve();
    });
}
