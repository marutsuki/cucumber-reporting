import { PAGE_SIZE, PAGES_PER_PARTITION } from '@constants';
import trie, { TrieNode } from '@util/trie';
import { PrefixIndex } from '@processing/prefix-tree';
import { ProcessedFeature } from '@ui/template-prep';

type ActiveFeatures = {
    features: ProcessedFeature[];
    availablePages: number;
};

type State = Partial<{
    cache: {
        pages: ProcessedFeature[][];
        availablePages: number;
    };
    pageCount: {
        pages: number;
        failedPages: number;
    };
    prefixTree: TrieNode<PrefixIndex>;
    prefixTreeFailed: TrieNode<PrefixIndex>;
    lastCall: {
        partition: number;
        failedOnly: boolean;
        searchFilter?: string;
    };
}>;

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
            state.pageCount = data;
        }),

    fetch('prefix-tree-data.json')
        .then((res) => res.json())
        .then((data) => {
            state.prefixTree = data;
        }),

    fetch('prefix-tree-failed.json')
        .then((res) => res.json())
        .then((data) => {
            state.prefixTreeFailed = data;
        }),
]);

const state: State = {};

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
    let features;
    if (searchFilter) {
        features = featuresFiltered(page, failedOnly, searchFilter);
    } else {
        features = featuresUnfiltered(page, failedOnly);
    }
    return features.then((data) => {
        state.lastCall = {
            partition: data.partition,
            failedOnly,
            searchFilter,
        };
        return data;
    });
}

type Metadata = {
    partition: number;
};

async function featuresFiltered(
    page: number,
    failedOnly: boolean,
    searchFilter: string
): Promise<ActiveFeatures & Metadata> {
    const pTree = failedOnly ? state.prefixTreeFailed : state.prefixTree;
    if (pTree === undefined) {
        throw new Error("Prefix tree data hasn't been loaded yet");
    }
    return featuresByPrefix(searchFilter, pTree, page, failedOnly);
}

async function featuresUnfiltered(
    page: number,
    failedOnly: boolean
): Promise<ActiveFeatures & Metadata> {
    const partition = Math.floor(page / PAGES_PER_PARTITION);
    const offset = page % PAGES_PER_PARTITION;
    const cached = resolveCache(offset, partition, failedOnly);
    if (cached) {
        return cached;
    }
    return getPartition(partition, failedOnly).then((pages) => {
        const availablePages =
            (failedOnly
                ? state.pageCount?.failedPages
                : state.pageCount?.pages) || 0;
        return {
            features: pages[offset],
            availablePages,
            partition,
        };
    });
}

async function featuresByPrefix(
    prefix: string,
    pTree: TrieNode<PrefixIndex>,
    virtualPage: number,
    failedOnly: boolean = false
): Promise<ActiveFeatures & Metadata> {
    const node = trie.search(pTree, prefix);
    if (node === null) {
        return Promise.resolve({
            pages: [],
            features: [],
            availablePages: 0,
            partition: 0,
        });
    }

    const { page: actualPage, partition: actualPartition } = getPageLocation(
        virtualPage,
        node
    );

    const cached = resolveCache(
        virtualPage,
        actualPartition,
        failedOnly,
        prefix
    );
    if (cached) {
        return cached;
    }

    return Promise.all(
        getProvidersByOffset(actualPage, actualPartition, failedOnly)
    ).then((partitions) => {
        const regrouped: ProcessedFeature[][] = [];
        let group: ProcessedFeature[] = [];
        const features =
            // If the page is within the first partition, slice any potential imcomptable feature names.
            virtualPage < PAGES_PER_PARTITION
                ? partitions.flat().slice(node.page).flat().slice(node.start)
                : // Otherwise, just take the features as they are.
                  partitions.flat().flat();
        // Use the same logic to retrieve the correct page.
        const pageOffset =
            virtualPage < PAGES_PER_PARTITION
                ? actualPage - node.page
                : actualPage;

        features.forEach((feature, i) => {
            if (i !== 0 && i % PAGE_SIZE === 0) {
                regrouped.push(group);
                group = [];
            }
            group.push(feature);
        });
        if (group.length > 0) {
            regrouped.push(group);
        }

        return {
            pages: regrouped,
            features: regrouped[pageOffset % PAGES_PER_PARTITION],
            availablePages: Math.ceil(node.size / PAGE_SIZE),
            partition: actualPartition,
        };
    });
}

function resolveCache(
    page: number,
    partition: number,
    failedOnly: boolean,
    searchFilter?: string
) {
    if (
        state.cache !== undefined &&
        state.lastCall !== undefined &&
        state.lastCall.partition === partition &&
        state.lastCall.failedOnly === failedOnly &&
        state.lastCall.searchFilter === searchFilter
    ) {
        console.debug(
            'Cache hit, returning cached features: ',
            partition,
            failedOnly,
            searchFilter
        );
        return {
            ...state.cache,
            features: state.cache.pages[page],
            partition,
        };
    }

    console.debug(
        'Cache miss, fetching new features: ',
        partition,
        failedOnly,
        searchFilter
    );

    return null;
}

const getProvidersByOffset = (
    actualPage: number,
    partition: number,
    failedOnly: boolean
) => {
    if (actualPage + 1 < PAGES_PER_PARTITION) {
        return [getPartition(partition, failedOnly)];
    } else {
        return [
            getPartition(partition, failedOnly),
            getPartition(partition + 1, failedOnly),
        ];
    }
};

const getPartition = (
    partition: number,
    failedOnly: boolean
): Promise<ProcessedFeature[][]> =>
    fetch(
        failedOnly
            ? `data/failed/failed-${partition}.json`
            : `data/all/data-${partition}.json`
    ).then((data) => data.json());

const getPageLocation = (virtualPage: number, node: PrefixIndex) => {
    // If page is out of bounds
    if (virtualPage > node.size / PAGE_SIZE) {
        return {
            page: -1,
            partition: -1,
        };
    }

    // Actual page offset value = page offset defined for trie node + requested page
    const actualPageOffset = Math.floor(
        (node.page + virtualPage) % PAGES_PER_PARTITION
    );
    // Actual partition offset value = partition offset defined for trie node + requested page / pages per partition
    const actualPartition =
        node.partition +
        Math.floor((node.page + virtualPage) / PAGES_PER_PARTITION);
    return {
        page: actualPageOffset,
        partition: actualPartition,
    };
};
