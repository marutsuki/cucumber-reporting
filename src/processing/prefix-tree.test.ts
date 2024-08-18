import { TrieNode } from 'src/data/trie';
import generate, { PrefixIndex } from './prefix-tree';
import { Feature } from './types';

jest.mock('../../constants', () => ({ PAGE_SIZE: 2, PAGES_PER_PARTITION: 2 }));

const dummyFeatures: Feature[] = [
    {
        id: '',
        line: 0,
        description: '',
        elements: [],
        keyword: '',
        name: 'alphabet',
        tags: [],
        uri: '',
    },
    {
        id: '',
        line: 0,
        description: '',
        elements: [],
        keyword: '',
        name: 'alpaca',
        tags: [],
        uri: '',
    },
    {
        id: '',
        line: 0,
        description: '',
        elements: [],
        keyword: '',
        name: 'banana',
        tags: [],
        uri: '',
    },
];

const dummyFeaturesTwo: Feature[] = [
    {
        id: '',
        line: 0,
        description: '',
        elements: [],
        keyword: '',
        name: 'alphabet',
        tags: [],
        uri: '',
    },
    {
        id: '',
        line: 0,
        description: '',
        elements: [],
        keyword: '',
        name: 'alpaca',
        tags: [],
        uri: '',
    },
    {
        id: '',
        line: 0,
        description: '',
        elements: [],
        keyword: '',
        name: 'bandana',
        tags: [],
        uri: '',
    },
    {
        id: '',
        line: 0,
        description: '',
        elements: [],
        keyword: '',
        name: 'banana',
        tags: [],
        uri: '',
    },
    {
        id: '',
        line: 0,
        description: '',
        elements: [],
        keyword: '',
        name: 'boat',
        tags: [],
        uri: '',
    },
    {
        id: '',
        line: 0,
        description: '',
        elements: [],
        keyword: '',
        name: 'cinnamon',
        tags: [],
        uri: '',
    },
    {
        id: '',
        line: 0,
        description: '',
        elements: [],
        keyword: '',
        name: 'cinnamoroll',
        tags: [],
        uri: '',
    },
    {
        id: '',
        line: 0,
        description: '',
        elements: [],
        keyword: '',
        name: 'duck',
        tags: [],
        uri: '',
    },
    {
        id: '',
        line: 0,
        description: '',
        elements: [],
        keyword: '',
        name: 'quack',
        tags: [],
        uri: '',
    },
];

function expectNodeDefined(
    prefixTree: TrieNode<PrefixIndex>,
    prefix: string
): void {
    let node = prefixTree;
    for (const char of prefix) {
        expect(node.children[char]).toBeDefined();
        node = node.children[char];
    }
}

function expectNodeHasSize(
    prefixTree: TrieNode<PrefixIndex>,
    prefix: string,
    size: number
): void {
    let node = prefixTree;
    for (const char of prefix) {
        node = node.children[char];
    }
    expect(Object.values(node.children).length).toEqual(size);
}

function expectPrefixHasProperty<P extends keyof PrefixIndex>(
    prefixTree: TrieNode<PrefixIndex>,
    prefix: string,
    property: P,
    expectedValue: PrefixIndex[P]
): void {
    let node = prefixTree;
    for (const char of prefix) {
        node = node.children[char];
    }
    expect(node.value).toBeDefined();
    expect(node.value![property]).toEqual(expectedValue);
}

describe('Prefix tree generation test suite', () => {
    test('Prefix tree correctly branches into child nodes', () => {
        const prefixTree = generate(dummyFeatures);
        // First character can only be 'a' or 'b'
        expectNodeDefined(prefixTree, 'a');
        expectNodeDefined(prefixTree, 'b');
        expectNodeDefined(prefixTree, 'al');
        expectNodeDefined(prefixTree, 'alp');
        expectNodeDefined(prefixTree, 'alpaca');
        expectNodeDefined(prefixTree, 'alphabet');
        expectNodeDefined(prefixTree, 'banana');
    });

    test('Prefix tree creates children only for existing values', () => {
        const prefixTree = generate(dummyFeatures);
        // First character can only be 'a' or 'b'
        expectNodeHasSize(prefixTree, 'a', 1);
        expectNodeHasSize(prefixTree, 'b', 1);
        expectNodeHasSize(prefixTree, 'al', 1);
        expectNodeHasSize(prefixTree, 'alp', 2);
        expectNodeHasSize(prefixTree, 'alpaca', 0);
        expectNodeHasSize(prefixTree, 'alphabet', 0);
        expectNodeHasSize(prefixTree, 'banana', 0);
    });

    test('Prefix tree correctly sets the prefix size', () => {
        const prefixTree = generate(dummyFeatures);

        // 'a' includes 'alphabet' and 'alpaca'
        expectPrefixHasProperty(prefixTree, 'a', 'size', 2);
        expectPrefixHasProperty(prefixTree, 'alp', 'size', 2);
        expectPrefixHasProperty(prefixTree, 'alpa', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'alpaca', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'alph', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'alphabet', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'b', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'banana', 'size', 1);
    });

    test('Prefix tree correctly sets the prefix size - 2', () => {
        const prefixTree = generate(dummyFeaturesTwo);

        expectPrefixHasProperty(prefixTree, 'a', 'size', 2);
        expectPrefixHasProperty(prefixTree, 'alp', 'size', 2);
        expectPrefixHasProperty(prefixTree, 'alpa', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'alpaca', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'alph', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'alphabet', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'b', 'size', 3);
        expectPrefixHasProperty(prefixTree, 'ban', 'size', 2);
        expectPrefixHasProperty(prefixTree, 'band', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'bandana', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'banana', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'bo', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'boat', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'c', 'size', 2);
        expectPrefixHasProperty(prefixTree, 'cinnamo', 'size', 2);
        expectPrefixHasProperty(prefixTree, 'cinnamoroll', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'cinnamon', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'd', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'duck', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'q', 'size', 1);
        expectPrefixHasProperty(prefixTree, 'quack', 'size', 1);
    });

    test('Prefix tree correctly sets the start offset of the prefix', () => {
        const prefixTree = generate(dummyFeatures);

        // 'a' includes 'alphabet' and 'alpaca'
        expectPrefixHasProperty(prefixTree, 'a', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'alp', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'alph', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'alphabet', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'alpa', 'start', 1);
        expectPrefixHasProperty(prefixTree, 'alpaca', 'start', 1);
        // Page size is 2, so 'b' starts at 0
        expectPrefixHasProperty(prefixTree, 'b', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'banana', 'start', 0);
    });

    test('Prefix tree correctly sets the start offset of the prefix - 2', () => {
        const prefixTree = generate(dummyFeaturesTwo);

        // 'a' includes 'alphabet' and 'alpaca'
        expectPrefixHasProperty(prefixTree, 'a', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'alp', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'alph', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'alphabet', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'alpa', 'start', 1);
        expectPrefixHasProperty(prefixTree, 'alpaca', 'start', 1);
        // Page size is 2, so 'b' starts at 0
        expectPrefixHasProperty(prefixTree, 'b', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'bandana', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'banana', 'start', 1);
        expectPrefixHasProperty(prefixTree, 'banana', 'start', 1);
        expectPrefixHasProperty(prefixTree, 'bo', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'boat', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'c', 'start', 1);
        expectPrefixHasProperty(prefixTree, 'cinnamo', 'start', 1);
        expectPrefixHasProperty(prefixTree, 'cinnamon', 'start', 1);
        expectPrefixHasProperty(prefixTree, 'cinnamoroll', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'd', 'start', 1);
        expectPrefixHasProperty(prefixTree, 'duck', 'start', 1);
        expectPrefixHasProperty(prefixTree, 'q', 'start', 0);
        expectPrefixHasProperty(prefixTree, 'quack', 'start', 0);
    });

    test('Prefix tree correctly sets the page offset of the prefix', () => {
        const prefixTree = generate(dummyFeatures);

        // 'a' includes 'alphabet' and 'alpaca'
        expectPrefixHasProperty(prefixTree, 'a', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'alp', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'alph', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'alphabet', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'alpa', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'alpaca', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'b', 'page', 1);
        expectPrefixHasProperty(prefixTree, 'banana', 'page', 1);
    });

    test('Prefix tree correctly sets the page offset of the prefix - 2', () => {
        const prefixTree = generate(dummyFeaturesTwo);

        expectPrefixHasProperty(prefixTree, 'a', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'alp', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'alph', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'alphabet', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'alpa', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'alpaca', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'b', 'page', 1);
        expectPrefixHasProperty(prefixTree, 'bandana', 'page', 1);
        expectPrefixHasProperty(prefixTree, 'banana', 'page', 1);
        // Partition size is 2, so the 3rd page starts on a new partition
        expectPrefixHasProperty(prefixTree, 'bo', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'boat', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'c', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'cinnamo', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'cinnamon', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'cinnamoroll', 'page', 1);
        expectPrefixHasProperty(prefixTree, 'd', 'page', 1);
        expectPrefixHasProperty(prefixTree, 'duck', 'page', 1);
        expectPrefixHasProperty(prefixTree, 'q', 'page', 0);
        expectPrefixHasProperty(prefixTree, 'quack', 'page', 0);
    });

    test('Prefix tree correctly sets the partition offset of the prefix', () => {
        const prefixTree = generate(dummyFeaturesTwo);

        expectPrefixHasProperty(prefixTree, 'a', 'partition', 0);
        expectPrefixHasProperty(prefixTree, 'alp', 'partition', 0);
        expectPrefixHasProperty(prefixTree, 'alph', 'partition', 0);
        expectPrefixHasProperty(prefixTree, 'alphabet', 'partition', 0);
        expectPrefixHasProperty(prefixTree, 'alpa', 'partition', 0);
        expectPrefixHasProperty(prefixTree, 'alpaca', 'partition', 0);
        expectPrefixHasProperty(prefixTree, 'b', 'partition', 0);
        expectPrefixHasProperty(prefixTree, 'bandana', 'partition', 0);
        expectPrefixHasProperty(prefixTree, 'banana', 'partition', 0);
        // Partition size is 2 pages = 4 elements
        expectPrefixHasProperty(prefixTree, 'bo', 'partition', 1);
        expectPrefixHasProperty(prefixTree, 'boat', 'partition', 1);
        expectPrefixHasProperty(prefixTree, 'c', 'partition', 1);
        expectPrefixHasProperty(prefixTree, 'cinnamo', 'partition', 1);
        expectPrefixHasProperty(prefixTree, 'cinnamon', 'partition', 1);
        expectPrefixHasProperty(prefixTree, 'cinnamoroll', 'partition', 1);
        expectPrefixHasProperty(prefixTree, 'd', 'partition', 1);
        expectPrefixHasProperty(prefixTree, 'duck', 'partition', 1);
        // 9th element, so it belongs to the 3rd partition
        expectPrefixHasProperty(prefixTree, 'q', 'partition', 2);
        expectPrefixHasProperty(prefixTree, 'quack', 'partition', 2);
    });
});
