import { Feature } from '@types';
import trie, { TrieNode } from '@util/trie';
import { PAGE_SIZE } from '@constants';
import { PAGES_PER_PARTITION } from '@constants';
import { featureFailed } from '@processing/stats';

export type PrefixIndex = {
    start: number;
    page: number;
    partition: number;
    size: number;
};

/**
 * Generates a prefix tree based on the feature names. Nodes contain information about the feature's position in the data.
 *
 * Expects the features to be in sorted order.
 *
 * @param outPath the file to output the prefix tree to
 * @param features the features to generate the prefix tree from
 * @returns a promise that resolves when the prefix tree has been written to the file
 */
export default function generate(
    features: Feature[],
    failedOnly = false
): TrieNode<PrefixIndex> {
    const prefixTree = trie.create<PrefixIndex>();
    let i = 0;
    features.forEach((feature) => {
        if (failedOnly && !featureFailed(feature)) {
            return;
        }
        const start = i % PAGE_SIZE;
        const page = Math.floor(i / PAGE_SIZE);
        const partition = Math.floor(page / PAGES_PER_PARTITION);
        const pageOffset = page % PAGES_PER_PARTITION;
        const data = () => ({ start, page: pageOffset, partition, size: 1 });
        trie.applyAndInsert(
            prefixTree,
            feature.name,
            data(),
            data,
            (node) => (node.size += 1)
        );
        i++;
    });
    return prefixTree;
}
