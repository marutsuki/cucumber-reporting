import { getTestSuiteStats } from '../data/stats';
import prepare from './template-prep';
import { Feature } from '../types';

const passedFeature: Feature = {
    id: '',
    line: 0,
    description: '',
    elements: [
        {
            description: '',
            id: '',
            keyword: '',
            line: 0,
            name: '',
            steps: [
                {
                    keyword: '',
                    line: 0,
                    name: '',
                    result: {
                        duration: 0,
                        status: 'passed',
                    },
                },
            ],
            tags: [],
            type: '',
        },
    ],
    keyword: '',
    name: '',
    tags: [],
    uri: '',
};

const failedFeature: Feature = {
    id: '',
    line: 0,
    description: '',
    elements: [
        {
            description: '',
            id: '',
            keyword: '',
            line: 0,
            name: '',
            steps: [
                {
                    keyword: '',
                    line: 0,
                    name: '',
                    result: {
                        duration: 0,
                        status: 'passed',
                    },
                },
                {
                    keyword: '',
                    line: 0,
                    name: '',
                    result: {
                        duration: 0,
                        status: 'failed',
                    },
                },
            ],
            tags: [],
            type: '',
        },
    ],
    keyword: '',
    name: '',
    tags: [],
    uri: '',
};

const OneSecondFeature: Feature = {
    id: '',
    line: 0,
    description: '',
    elements: [
        {
            description: '',
            id: '',
            keyword: '',
            line: 0,
            name: '',
            steps: [
                {
                    keyword: '',
                    line: 0,
                    name: '',
                    result: {
                        duration: 1_000_000_000,
                        status: 'passed',
                    },
                },
            ],
            tags: [],
            type: '',
        },
    ],
    keyword: '',
    name: '',
    tags: [],
    uri: '',
};

const HalfSecondFeature: Feature = {
    id: '',
    line: 0,
    description: '',
    elements: [
        {
            description: '',
            id: '',
            keyword: '',
            line: 0,
            name: '',
            steps: [
                {
                    keyword: '',
                    line: 0,
                    name: '',
                    result: {
                        duration: 500_000_000,
                        status: 'passed',
                    },
                },
            ],
            tags: [],
            type: '',
        },
    ],
    keyword: '',
    name: '',
    tags: [],
    uri: '',
};

const FeatureWithJpegEmbedding: Feature = {
    id: '',
    line: 0,
    description: '',
    elements: [
        {
            description: '',
            id: '',
            keyword: '',
            line: 0,
            name: '',
            steps: [
                {
                    keyword: '',
                    line: 0,
                    name: '',
                    result: {
                        duration: 0,
                        status: 'passed',
                    },
                    embeddings: [
                        {
                            data: 'data',
                            mime_type: 'image/jpeg',
                        },
                    ],
                },
            ],
            tags: [],
            type: '',
        },
    ],
    keyword: '',
    name: '',
    tags: [],
    uri: '',
};

const FeatureWithPngEmbedding: Feature = {
    id: '',
    line: 0,
    description: '',
    elements: [
        {
            description: '',
            id: '',
            keyword: '',
            line: 0,
            name: '',
            steps: [
                {
                    keyword: '',
                    line: 0,
                    name: '',
                    result: {
                        duration: 0,
                        status: 'passed',
                    },
                    embeddings: [
                        {
                            data: 'data',
                            mime_type: 'image/png',
                        },
                    ],
                },
            ],
            tags: [],
            type: '',
        },
    ],
    keyword: '',
    name: '',
    tags: [],
    uri: '',
};

const FeatureWithJsonEmbedding: Feature = {
    id: '',
    line: 0,
    description: '',
    elements: [
        {
            description: '',
            id: '',
            keyword: '',
            line: 0,
            name: '',
            steps: [
                {
                    keyword: '',
                    line: 0,
                    name: '',
                    result: {
                        duration: 0,
                        status: 'passed',
                    },
                    embeddings: [
                        {
                            data: 'data',
                            mime_type: 'application/json',
                        },
                    ],
                },
            ],
            tags: [],
            type: '',
        },
    ],
    keyword: '',
    name: '',
    tags: [],
    uri: '',
};

describe('Post processing test suite', () => {
    test('Post process correctly sets the feature [failed] property - false', () => {
        const stats = getTestSuiteStats([passedFeature]);
        expect(prepare(passedFeature, stats).failed).toBe(false);
    });

    test('Post process correctly sets the feature [failed] property - true', () => {
        const stats = getTestSuiteStats([failedFeature]);
        expect(prepare(passedFeature, stats).failed).toBe(true);
    });

    test('Post process correctly sets the scenario [failed] property - false', () => {
        const stats = getTestSuiteStats([passedFeature]);
        expect(prepare(passedFeature, stats).elements[0].failed).toBe(false);
    });

    test('Post process correctly sets the scenario [failed] property - true', () => {
        const stats = getTestSuiteStats([failedFeature]);
        expect(prepare(failedFeature, stats).elements[0].failed).toBe(true);
    });

    test('Post process correctly formats the step result duration property - 1s', () => {
        const stats = getTestSuiteStats([OneSecondFeature]);
        expect(
            prepare(OneSecondFeature, stats).elements[0].steps[0].result
                ?.duration
        ).toBe('1s');
    });

    test('Post process correctly formats the step result duration property - 0.5s', () => {
        const stats = getTestSuiteStats([HalfSecondFeature]);
        expect(
            prepare(HalfSecondFeature, stats).elements[0].steps[0].result
                ?.duration
        ).toBe('0.5s');
    });

    test("Post process correctly sets the embedding type property - 'image/jpeg'", () => {
        const stats = getTestSuiteStats([FeatureWithJpegEmbedding]);
        const embedding = prepare(FeatureWithJpegEmbedding, stats).elements[0]
            .steps[0].embeddings![0];
        expect(embedding.isJpeg).toBe(true);
        expect(embedding.isPng).toBe(false);
        expect(embedding.isText).toBe(false);
    });

    test("Post process correctly sets the embedding type property - 'image/png'", () => {
        const stats = getTestSuiteStats([FeatureWithPngEmbedding]);
        const embedding = prepare(FeatureWithPngEmbedding, stats).elements[0]
            .steps[0].embeddings![0];
        expect(embedding.isPng).toBe(true);
        expect(embedding.isJpeg).toBe(false);
        expect(embedding.isText).toBe(false);
    });

    test("Post process correctly sets the embedding type property - 'image/text'", () => {
        const stats = getTestSuiteStats([FeatureWithJsonEmbedding]);
        const embedding = prepare(FeatureWithJsonEmbedding, stats).elements[0]
            .steps[0].embeddings![0];
        expect(embedding.isText).toBe(true);
        expect(embedding.isPng).toBe(false);
        expect(embedding.isJpeg).toBe(false);
    });
});
