import { ProcessedFeature } from 'src/processing/types';
import { PAGES_PER_PARTITION } from './constants';
import TrieSearch from 'trie-search';

type TrieType = {
    name: string;
    feature: ProcessedFeature;
};
export const allTrie = new TrieSearch<TrieType>('name');
export const failedTrie = new TrieSearch<TrieType>('name');

export const loadTries = () => {
    const pages = window.data.pages;
    const partitions = Math.ceil(pages / PAGES_PER_PARTITION);
    Array(partitions)
        .fill(0)
        .forEach(async (_, i) => {
            window.data.providers[i]().then((pages) => {
                pages.forEach((page) =>
                    page.forEach((feature) => {
                        if (feature.failed) {
                            failedTrie.add({
                                name: feature.name,
                                feature,
                            });
                        }
                        allTrie.add({
                            name: feature.name,
                            feature,
                        });
                    })
                );
            });
        });
};
