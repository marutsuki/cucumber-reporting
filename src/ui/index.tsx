import { Config } from '../config';
import { getTestSuiteStats } from '../data/stats';
import { TestSuite } from '../rendering/types';
import Feature from './Feature';
import Header from './Header';
import Summary from './Summary';
import Toolbar from './Toolbar';

export default function CucumberReport({ model }: { model: TestSuite }) {
    const theme = Config.getConfig('theme');
    const stats = getTestSuiteStats(model);
    return (
        <html data-theme={theme}>
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>{`${model.name} Cucumber Report`}</title>
                <link
                    href="https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css"
                    rel="stylesheet"
                    type="text/css"
                />
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body className="py-4 px-10">
                <Header appName={model.name} />
                <Summary {...stats} />
                <Toolbar />
                <div className="content">
                    {model.features.map((feature) => (
                        <div key={feature.id.concat(':wrapper')}>
                            <Feature
                                key={feature.id}
                                model={feature}
                                stats={stats.features[feature.id]}
                            />
                        </div>
                    ))}
                </div>

                <div>
                    <div id="pagination" className="join"></div>
                </div>
            </body>
            <script>
                {`window.config = {
                    showFailedOnStart: ${Config.getConfig('showFailedOnStart')}
                };`}
            </script>
            <script src="./script.js" />
        </html>
    );
}
