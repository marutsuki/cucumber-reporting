import { Feature } from './processing/types';
import fs from 'fs';
import path from 'path';
import postProcess from './processing/post-process';
import { TestSuiteStats } from './data/stats';

export const PARTITION_SIZE = 500;

const PAGE_SIZE = 15;

function* pageGenerator(features: Feature[], testStats: TestSuiteStats) {
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
            pageFeatures.push(postProcess(features[j], testStats));
        }
        yield pageFeatures;
        page++;
    }
}

export default function createDataJs(
    outPath: string,
    features: Feature[],
    testStats: TestSuiteStats
) {
    return new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(path.join(outPath, 'data.js'));
        const gen = pageGenerator(features, testStats);
        let done = false;
        let partitionIndex = 0;
        try {
            writeStream.write('window.features.push(');
            while (!done) {
                const jsonWriteStream = fs.createWriteStream(
                    path.join(outPath, `data-${partitionIndex}.json`)
                );

                jsonWriteStream.write('[');
                let first = true;
                let index = 0;
                let page = gen.next();
                while (!page.done && index < PARTITION_SIZE) {
                    if (!first) {
                        jsonWriteStream.write(',');
                    }
                    jsonWriteStream.write(JSON.stringify(page.value));
                    writeStream.write(
                        `() => fetch('data-${partitionIndex}.json').then(res => res.json()),`
                    );
                    index++;
                    page = gen.next();
                    first = false;
                }

                jsonWriteStream.write(']');
                jsonWriteStream.end();
                done = page.done || false;
                partitionIndex++;
            }
            writeStream.write(');');
        } catch (err) {
            reject(err);
        } finally {
            writeStream.end();
        }
        resolve();
    });
}
