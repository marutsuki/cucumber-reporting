import { PARTITION_SIZE } from '../create-datajs';
import { Config } from '../config';
import { getTestSuiteStats } from '../data/stats';
import { TestSuite } from '../rendering/types';
import Header from './Header';
import Summary from './Summary';
import Toolbar from './Toolbar';

export default function CucumberReport({ model }: { model: TestSuite }) {
    const theme = Config.getConfig('theme');
    const stats = getTestSuiteStats(model);

    const partitions = Math.ceil(model.features.length / PARTITION_SIZE);
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
                <script src="https://cdn.jsdelivr.net/npm/mustache@4.2.0/mustache.min.js"></script>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body className="py-4 px-10">
                <Header appName={model.name} />
                <Summary {...stats} />
                <Toolbar />
                <div id="content" className="content"></div>

                <div>
                    <div
                        id="pagination"
                        className="join w-full flex justify-center my-4"
                    ></div>
                </div>
            </body>
            <script>
                {`window.config = {
                    showFailedOnStart: ${Config.getConfig('showFailedOnStart')},
                };`}
            </script>
            <script>const exports = {'{}'};</script>
            {Array(partitions)
                .fill(0)
                .map((_, i) => (
                    <script
                        id={`data-${i}`}
                        src={`./data-${i}.json`}
                        type="application/json"
                    />
                ))}
            <script src="scripts/tailwind.js" />
            <script src="scripts/templating.js" />
            <script src="data.js" />
            <script src="failed.js" />
            <script src="scripts/engine.js" />
        </html>
    );
}
