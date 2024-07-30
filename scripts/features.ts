import { ProcessedFeature } from 'src/processing/types';
import { PAGE_SIZE } from './constants';
import { allTrie, failedTrie } from './trie';

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

    if (!searchFilter) {
        return (failedOnly ? window.failed.providers : window.data.providers)[
            partitionIndex
        ]();
    }

    const results = (failedOnly ? failedTrie : allTrie).get(searchFilter);
    const ret = [];
    let page: ProcessedFeature[] = [];
    let i = 0;
    for (const f of results) {
        if (i >= PAGE_SIZE) {
            ret.push(page);
            page = [];
            i = 0;
        }
        page.push(f.feature);
        i++;
    }
    ret.push(page);
    return Promise.resolve(ret);
};
