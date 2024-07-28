import Scenario from './Scenario';

type FeatureStats = {
    passed: number;
    failed: number;
    skipped: number;
};

const getFeatureStats = (feature: Feature): FeatureStats => {
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
};

export default function Feature({
    model,
    ...props
}: { model: Feature } & React.Attributes) {
    const stats = getFeatureStats(model);
    const failed = stats.failed > 0;
    return (
        <div
            className="page feature collapse bg-base-200 m-1"
            data-name={model.name}
            {...(failed && { 'data-status': 'failed' })}
            {...props}
        >
            <input className="min-h-1" type="checkbox" />
            <div
                className={`collapse-title rounded-md p-1 flex flex-row justify-between min-h-0 bg-opacity-50 bg-gradient-to-r ${failed ? 'from-error' : 'from-success'} from-0% to-50% to-neutral`}
            >
                <h2
                    className={`${failed ? 'text-error-content' : 'text-success-content'} text-md font-medium m-0 min-h-0`}
                >
                    {model.name}
                </h2>
                <div className="flex flex-row">
                    <div className="text-success h-full rounded-md w-24">
                        {stats.passed} passed
                    </div>
                    <div className="text-error h-full rounded-md w-20">
                        {stats.failed} failed
                    </div>
                    <div className="text-warning h-full rounded-md w-20">
                        {stats.skipped} skipped
                    </div>
                </div>
            </div>

            <div className="collapse-content">
                <ul>
                    {model.elements.map((scenario) => (
                        <Scenario key={scenario.id} {...scenario} />
                    ))}
                </ul>
            </div>
        </div>
    );
}
