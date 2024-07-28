export type TestSuiteStats = {
    passed: number;
    failed: number;
    features: Readonly<Record<string, FeatureStats>>;
};

export function getTestSuiteStats(model: TestSuite): TestSuiteStats {
    let passed = 0;
    let failed = 0;
    const features = Object.fromEntries(
        model.features.map((feature) => {
            const featureStats = getFeatureStats(feature);
            if (featureStats.failed > 0) {
                failed++;
            } else {
                passed++;
            }
            return [feature.id, featureStats];
        })
    );
    return {
        passed,
        failed,
        features,
    };
}

export type FeatureStats = {
    passed: number;
    failed: number;
    skipped: number;
};

function getFeatureStats(feature: Feature): FeatureStats {
    let passed = 0;
    let failed = 0;
    let skipped = 0;
    feature.elements.forEach((scenario) => {
        scenario.steps.forEach((step) => {
            if (step.result === undefined) {
                return;
            }
            switch (step.result.status) {
                case 'passed':
                    passed++;
                    break;
                case 'failed':
                    failed++;
                    break;
                case 'skipped':
                    skipped++;
                    break;
            }
        });
    });
    return {
        passed,
        failed,
        skipped,
    };
}
