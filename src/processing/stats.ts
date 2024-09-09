import { Feature } from '@types';

export type TestSuiteStats = {
    featuresPassed: number;
    featuresFailed: number;
    scenariosPassed: number;
    scenariosFailed: number;
    features: Readonly<Record<string, FeatureStats>>;
};

export function getTestSuiteStats(featureList: Feature[]): TestSuiteStats {
    let featuresPassed = 0;
    let featuresFailed = 0;
    let scenariosPassed = 0;
    let scenariosFailed = 0;
    const features = Object.fromEntries(
        featureList.map((feature) => {
            const featureStats = getFeatureStats(feature);
            if (featureStats.failed > 0) {
                featuresFailed++;
            } else {
                featuresPassed++;
            }
            scenariosPassed += featureStats.passed;
            scenariosFailed += featureStats.failed;
            return [feature.id, featureStats];
        })
    );
    return {
        featuresPassed,
        featuresFailed,
        scenariosPassed,
        scenariosFailed,
        features,
    };
}

export type FeatureStats = {
    passed: number;
    failed: number;
    skipped: number;
};

export function featureFailed(feature: Feature) {
    return feature.elements.some((f) =>
        f.steps.some((s) => s.result?.status === 'failed')
    );
}

function getFeatureStats(feature: Feature): FeatureStats {
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    feature.elements.forEach((scenario) => {
        let passedScenario = true;
        let skippedScenario = false;
        scenario.steps.forEach((step) => {
            if (step.result === undefined) {
                return;
            }
            switch (step.result.status) {
                case 'passed':
                    break;
                case 'failed':
                    passedScenario = false;
                    break;
                case 'skipped':
                    skippedScenario = true;
                    break;
            }
        });
        passedScenario ? (skippedScenario ? skipped++ : passed++) : failed++;
    });
    return {
        passed,
        failed,
        skipped,
    };
}
