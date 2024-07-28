import Feature from './Feature';
import './globals.css';

function getTestSuiteStats(model: TestSuite) {
    const stats = {
        passed: 0,
        failed: 0,
    };
    model.features.forEach((feature) => {
        feature.elements.forEach((scenario) => {
            for (const step of scenario.steps) {
                if (step.result?.status === 'failed') {
                    stats.failed += 1;
                    return;
                }
            }
            stats.passed += 1;
        });
    });
    return stats;
}
export default function CucumberReport({ model }: { model: TestSuite }) {
    const { passed, failed } = getTestSuiteStats(model);
    return (
        <html>
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>{`${model.name} Cucumber Report`}</title>
                <link type="text/css" rel="stylesheet" href="./globals.css" />
            </head>
            <body className="p-10">
                <div className="card bg-base-100 w-96 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Summary</h2>
                        <p className="text-success">
                            {passed} scenarios passed
                        </p>
                        <p className="text-error">{failed} scenarios failed</p>
                    </div>
                </div>
                <div className="navbar bg-base-100">
                    <div className="flex-1">
                        <a className="btn btn-ghost text-xl">Results</a>
                    </div>
                    <div className="flex-none gap-2">
                        <label>Failed Only</label>
                        <input
                            id="fail-filter"
                            type="checkbox"
                            defaultChecked={false}
                        />

                        <div className="form-control">
                            <input
                                id="feature-search"
                                type="text"
                                placeholder="Search"
                                className="input input-bordered w-24 md:w-auto"
                            />
                        </div>
                    </div>
                </div>
                <div className="content">
                    {model.features.map((feature) => (
                        <div>
                            <Feature key={feature.id} model={feature} />
                        </div>
                    ))}
                </div>

                <div>
                    <div id="pagination" className="join"></div>
                </div>
            </body>
            <script src="./script.js" />
        </html>
    );
}
