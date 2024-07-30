import { Feature } from './processing/types';
import fs from 'fs';
import path from 'path';
import postProcess from './processing/post-process';
import { TestSuiteStats } from './data/stats';
export const PARTITION_SIZE = 500;

const PAGE_SIZE = 15;

const featureFailed = (feature: Feature) =>
    feature.elements.some((f) =>
        f.steps.some((s) => s.result?.status === 'failed')
    );

function* pageGenerator(
    features: Feature[],
    testStats: TestSuiteStats,
    failedOnly: boolean
) {
    let i = 0;
    const len = features.length;
    while (i < len) {
        const pageFeatures = [];
        let size = 0;

        while (size < PAGE_SIZE && i < len) {
            if (!failedOnly || featureFailed(features[i])) {
                pageFeatures.push(postProcess(features[i], testStats));
                size++;
            }
            i++;
        }
        yield pageFeatures;
    }
}

export default function createDataJs(
    outPath: string,
    features: Feature[],
    testStats: TestSuiteStats,
    prefix: string,
    failedOnly = false
) {
    return new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(
            path.join(outPath, `${prefix}.js`)
        );
        const gen = pageGenerator(features, testStats, failedOnly);
        let done = false;
        let partitionIndex = 0;
        let totalPages = 0;
        try {
            writeStream.write(`
                window.${prefix} = {}; 
                window.${prefix}.providers = []; 
                window.${prefix}.providers.push(
                `);
            while (!done) {
                const jsonWriteStream = fs.createWriteStream(
                    path.join(outPath, `${prefix}-${partitionIndex}.json`)
                );
                jsonWriteStream.write('[');

                let first = true;
                let index = 0;
                let page = gen.next();

                writeStream.write(
                    `() => fetch('${prefix}-${partitionIndex}.json').then(res => res.json()),`
                );
                while (!page.done && index < PARTITION_SIZE) {
                    if (!first) {
                        jsonWriteStream.write(',');
                    }
                    jsonWriteStream.write(JSON.stringify(page.value));

                    index++;
                    totalPages++;
                    page = gen.next();
                    first = false;
                }

                jsonWriteStream.write(']');
                jsonWriteStream.end();
                done = page.done || false;
                partitionIndex++;
            }
            writeStream.write(');');
            writeStream.write(`window.${prefix}.pages = ${totalPages};`);
        } catch (err) {
            reject(err);
        } finally {
            writeStream.end();
        }
        resolve();
    });
}
