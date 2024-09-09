import { Feature } from '@types';
import prepare, { ProcessedFeature } from '@ui/template-prep';
import { TestSuiteStats } from './stats';
import { PAGE_SIZE } from '@constants';
import { PARTITION_SIZE } from '@constants';

function* pageGenerator(
    features: Feature[],
    testStats: TestSuiteStats
): Generator<ProcessedFeature[][], void> {
    let i = 0;
    const len = features.length;
    while (i < len) {
        const partitionFeatures: ProcessedFeature[][] = [];
        let p = 0;
        while (p < PARTITION_SIZE && i < len) {
            const pageFeatures: ProcessedFeature[] = [];
            let size = 0;
            while (size < PAGE_SIZE && i < len) {
                pageFeatures.push(prepare(features[i], testStats));
                size++;
                i++;
            }
            partitionFeatures.push(pageFeatures);
            p++;
        }
        yield partitionFeatures;
    }
}

export default function partition(
    features: Feature[],
    testStats: TestSuiteStats
) {
    const gen = pageGenerator(features, testStats);
    let page = gen.next();
    const partitions = [];
    while (!page.done) {
        const val = page.value;
        partitions.push(JSON.stringify(val));
        page = gen.next();
    }
    return partitions;
}
