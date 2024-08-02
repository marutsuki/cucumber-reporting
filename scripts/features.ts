import { ProcessedFeature } from 'src/processing/types';

let cache: ProcessedFeature[][];

const lastCall = {
    partitionIndex: -1,
    failedOnly: false,
    searchFilter: '',
};
export const features = (
    partitionIndex: number,
    failedOnly: boolean,
    searchFilter?: string
): Promise<ProcessedFeature[][]> => {
    if (
        cache !== undefined &&
        lastCall.partitionIndex === partitionIndex &&
        lastCall.failedOnly === failedOnly &&
        lastCall.searchFilter === searchFilter
    ) {
        return Promise.resolve(cache);
    }

    return (failedOnly ? window.failed.providers : window.data.providers)[
        partitionIndex
    ]();
};
