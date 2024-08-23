import { PAGE_SIZE, PAGES_PER_PARTITION } from '@constants';
import trie, { TrieNode } from '@util/trie';
import { PrefixIndex } from '@processing/prefix-tree';
import { ProcessedFeature } from '@ui/template-prep';

type ActiveFeatures = {
    features: ProcessedFeature[];
    availablePages: number;
};

let cache: {
    features: ProcessedFeature[][];
    availablePages: number;
} | null = null;

const pageCount = {
    data: 0,
    failed: 0,
};

let prefixTree: TrieNode<PrefixIndex> | null = null;
let prefixTreeFailed: TrieNode<PrefixIndex> | null = null;

const lastCall = {
    partitionIndex: -1,
    failedOnly: false,
    searchFilter: '',
};

/**
 * {@link features} depends on:
 * - global.json for page counts
 * - prefix-tree-data.json for prefix tree of all features
 * - prefix-tree-failed.json for prefix tree of failed features
 */
const deps = Promise.all([
    fetch('global.json')
        .then((res) => res.json())
        .then((data) => {
            pageCount.data = data.pages;
            pageCount.failed = data.failedPages;
            console.log(pageCount);
        }),

    fetch('prefix-tree-data.json')
        .then((res) => res.json())
        .then((data) => {
            prefixTree = data;
        }),

    fetch('prefix-tree-failed.json')
        .then((res) => res.json())
        .then((data) => {
            prefixTreeFailed = data;
        }),
]);

const getPartition = (partition: number, failedOnly: boolean) =>
    fetch(
        failedOnly ? `failed-${partition}.json` : `data-${partition}.json`
    ).then((data) => data.json());

export default async function features(
    page: number,
    failedOnly: boolean,
    searchFilter?: string
) {
    return deps.then(() => featuresImpl(page, failedOnly, searchFilter));
}

async function featuresImpl(
    page: number,
    failedOnly: boolean,
    searchFilter?: string
): Promise<ActiveFeatures> {
    const partition = Math.floor(page / PAGES_PER_PARTITION);
    const offset = page % PAGES_PER_PARTITION;

    if (
        cache !== null &&
        lastCall.partitionIndex === partition &&
        lastCall.failedOnly === failedOnly &&
        !searchFilter
    ) {
        return Promise.resolve({
            features: cache.features[offset],
            availablePages: cache.availablePages,
        });
    }

    const availablePages = failedOnly ? pageCount.failed : pageCount.data;

    if (searchFilter) {
        const pTree = failedOnly ? prefixTreeFailed : prefixTree;
        if (pTree === null) {
            return Promise.resolve({ features: [], availablePages: 0 });
        }
        return featuresByPrefix(searchFilter, pTree, page, failedOnly);
    }

    return getPartition(partition, failedOnly).then((pages) => {
        cache = { features: pages, availablePages };
        return { features: pages[offset], availablePages };
    });
}

export const featuresByPrefix = async (
    prefix: string,
    pTree: TrieNode<PrefixIndex>,
    page: number,
    failedOnly: boolean = false
): Promise<ActiveFeatures> => {
    const node = trie.search(pTree, prefix);
    if (node === null) {
        return Promise.resolve({ features: [], availablePages: 0 });
    }

    const { partition, page: pageOffset, start, size } = node;
    // Actual page offset value = page offset defined for trie node + requested page
    const actualPageOffset = Math.floor(
        (pageOffset + page) % PAGES_PER_PARTITION
    );
    // Actual partition offset value = partition offset defined for trie node + requested page / pages per partition
    const actualPartition =
        partition + Math.floor((pageOffset + page) / PAGES_PER_PARTITION);
    // Number of pages to be shown in the pagination buttons
    const availablePages = Math.ceil(size / PAGE_SIZE);

    let requiredProviders;
    if (actualPageOffset + 1 < PAGES_PER_PARTITION) {
        requiredProviders = [getPartition(actualPartition, failedOnly)];
    } else {
        requiredProviders = [
            getPartition(actualPartition, failedOnly),
            getPartition(actualPartition + 1, failedOnly),
        ];
    }
    return Promise.all(requiredProviders).then((partitions) => {
        const pages = partitions.flat();
        cache = {
            features: pages,
            availablePages,
        };
        let features;
        const featuresRemaining = size - page * PAGE_SIZE;

        // If there's less than a page of features left, only show those
        if (featuresRemaining < PAGE_SIZE) {
            features = pages[actualPageOffset].slice(
                start,
                start + featuresRemaining
            );
        } else {
            features = pages[actualPageOffset]
                .slice(start, PAGE_SIZE)
                .concat(
                    pages[actualPageOffset + 1].slice(
                        0,
                        Math.min(start, size - PAGE_SIZE)
                    )
                );
        }
        return {
            features,
            availablePages,
        };
    });
};
