import { Config } from '../config';
import { getTestSuiteStats } from '../data/stats';
import Feature from './Feature';
import './globals.css';
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
                <link type="text/css" rel="stylesheet" href="./globals.css" />
            </head>
            <body className="py-4 px-10">
                <Header appName={model.name} />
                <Summary {...stats} />
                <Toolbar />
                <div className="content">
                    {model.features.map((feature) => (
                        <div>
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
            <script src="./script.js" />
        </html>
    );
}
