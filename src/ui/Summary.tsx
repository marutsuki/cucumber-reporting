import { TestSuiteStats } from '../data/stats';

export default function Summary({ passed, failed, features }: TestSuiteStats) {
    const [scenariosPassed, scenariosFailed] = Object.values(features).reduce(
        (p, f) => [p[0] + f.passed, p[1] + f.failed],
        [0, 0]
    );
    return (
        <div className="card shadow-base-300 bg-base-100 w-96 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Summary</h2>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <p className="text-success">{passed} features passed</p>
                        <p className="text-error">{failed} features failed</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-success">
                            {scenariosPassed} scenarios passed
                        </p>
                        <p className="text-error">
                            {scenariosFailed} scenarios failed
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
