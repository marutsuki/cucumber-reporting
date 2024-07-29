import processFeature from './process';
import { Feature } from './types';

const FEATURE_KEYWORDS = ['Feature'];
const SCENARIO_KEYWORDS = ['Scenario', 'Scenario Outline'];
const STEP_KEYWORDS = ['After', 'Before', 'Given', 'When', 'Then', 'And'];

const assertFeaturesPopulated = (features: Feature[]) =>
    features.map((f) => {
        expect(f.id).toBeTruthy();
        expect(f.name).toBeTruthy();
        expect(FEATURE_KEYWORDS).toContain(f.keyword.trim());
        f.elements.forEach((s) => {
            expect(s.id).toBeTruthy();
            expect(s.name).toBeTruthy();
            expect(s.type).toBeTruthy();
            expect(SCENARIO_KEYWORDS).toContain(s.keyword.trim());
            s.steps.forEach((step) => {
                expect(STEP_KEYWORDS).toContain(step.keyword.trim());
            });
        });
    });

describe('Report processing test suite', () => {
    test('Process a single JSON file', async () => {
        const features = await processFeature(
            'test/data/reports/example-1.json'
        );
        expect(features.length).toBe(1);

        assertFeaturesPopulated(features);
    });

    test('Process a directory of JSON files', async () => {
        const features = await processFeature('test/data/reports');
        expect(features.length).toBe(3);

        assertFeaturesPopulated(features);
    });

    test('Process a non JSON file', async () => {
        const features = await processFeature('test/data/notjson/an-xml.xml');
        expect(features.length).toBe(0);
    });

    test('Process a directory with no JSON files', async () => {
        const features = await processFeature('test/data/notjson');
        expect(features.length).toBe(0);
    });

    test('Process a directory with a mix of JSON files and non-JSON files', async () => {
        const features = await processFeature('test/data');
        expect(features.length).toBe(3);
    });
});
