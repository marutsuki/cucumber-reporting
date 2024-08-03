import { PAGE_SIZE } from '../constants';
import trie, { TrieNode } from '../src/data/trie';
import { PrefixIndex } from '../src/processing/prefix-tree';
import { ProcessedFeature } from '../src/processing/types';

type ActiveFeatures = {
    features: ProcessedFeature[];
    availablePages: number;
};

let cache: {
    features: ProcessedFeature[][];
    availablePages: number;
} | null = null;

let prefixTree: TrieNode<PrefixIndex> | null = null;

fetch('prefix-tree.json')
    .then((res) => res.json())
    .then((data) => {
        prefixTree = data;
    });

const lastCall = {
    partitionIndex: -1,
    failedOnly: false,
    searchFilter: '',
};

export const features = async (
    partitionIndex: number,
    page: number,
    failedOnly: boolean,
    searchFilter?: string
): Promise<ActiveFeatures> => {
    if (
        cache !== null &&
        lastCall.partitionIndex === partitionIndex &&
        lastCall.failedOnly === failedOnly &&
        lastCall.searchFilter === searchFilter
    ) {
        return Promise.resolve({
            features: cache.features[page],
            availablePages: cache.availablePages,
        });
    }

    const providers = failedOnly
        ? window.failed.providers
        : window.data.providers;

    if (searchFilter) {
        return featuresByPrefix(searchFilter, providers, page);
    }

    return providers[partitionIndex]().then((pages) => {
        cache = { features: pages, availablePages: pages.length };
        return { features: pages[page], availablePages: pages.length };
    });
};

export const featuresByPrefix = async (
    prefix: string,
    providers: (() => Promise<ProcessedFeature[][]>)[],
    page: number
): Promise<ActiveFeatures> => {
    if (prefixTree === null) {
        return Promise.resolve({ features: [], availablePages: 0 });
    }
    const node = trie.search(prefixTree, prefix);
    if (node === null) {
        return Promise.resolve({ features: [], availablePages: 0 });
    }
    const { partition, page: pageOffset, start, size } = node;
    return providers[partition]().then((pages) => {
        const actualPageOffset = pageOffset + page;
        let features;
        if (start + size < PAGE_SIZE) {
            features = pages[actualPageOffset].slice(start, start + size);
        } else {
            features = pages[actualPageOffset]
                .slice(start, PAGE_SIZE)
                .concat(
                    pages[actualPageOffset + 1].slice(
                        0,
                        size - (PAGE_SIZE - start)
                    )
                );
        }
        return {
            features,
            availablePages: Math.ceil(size / PAGE_SIZE),
        };
    });
};
