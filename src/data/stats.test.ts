import { Feature } from '@types';
import { getTestSuiteStats } from './stats';

const ThreePassedScenarios: Feature[] = [
    {
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
    },
    {
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
    },
];

const ThreeFailedScenarios: Feature[] = [
    {
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
                            status: 'failed',
                        },
                    },
                ],
                tags: [],
                type: '',
            },
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
    },
    {
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
    },
];
describe('Stats module test suite', () => {
    test('getTestSuiteStats correctly counts passed scenarios', () => {
        expect(getTestSuiteStats(ThreePassedScenarios).scenariosPassed).toBe(3);
    });

    test('getTestSuiteStats correctly counts failed scenarios', () => {
        expect(getTestSuiteStats(ThreeFailedScenarios).scenariosFailed).toBe(3);
    });

    test('getTestSuiteStats correctly counts passed features', () => {
        expect(getTestSuiteStats(ThreePassedScenarios).featuresPassed).toBe(2);
    });

    test('getTestSuiteStats correctly counts failed features', () => {
        expect(getTestSuiteStats(ThreeFailedScenarios).featuresFailed).toBe(2);
    });
});
