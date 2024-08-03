import { Feature } from './types';
import trie from '../data/trie';
import { PAGE_SIZE } from '../../constants';
import { PAGES_PER_PARTITION } from '../../constants';
import { writeFilePromise } from '../data/file';

type PrefixIndex = {
    start: number;
    page: number;
    partition: number;
    size: number;
};

export default function generate(outPath: string, features: Feature[]) {
    const prefixTree = trie.create<PrefixIndex>();
    features.sort((a, b) => a.name.localeCompare(b.name));
    features.forEach((feature, i) => {
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
    });

    return writeFilePromise(outPath, JSON.stringify(prefixTree));
}
