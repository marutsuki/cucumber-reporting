import Feature from './Feature';
import './globals.css';

const PAGE_SIZE = 15;
export default function CucumberReport({ model }: { model: TestSuite }) {
    const pages = Math.ceil(model.features.length / PAGE_SIZE);
    const getPageIndex = (index: number) => Math.floor(index / PAGE_SIZE);
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
                <div className="content">
                    {model.features.map((feature, i) => (
                        <div
                            key={feature.id}
                            className={'page page-'.concat(
                                getPageIndex(i).toString()
                            )}
                        >
                            <Feature model={feature} />
                        </div>
                    ))}
                </div>

                <div>
                    <div className="join">
                        {Array(pages)
                            .fill(0)
                            .map((_, i) => (
                                <input
                                    className="pagination-button pagination-button-join-item btn btn-square"
                                    data-page={i.toString()}
                                    type="radio"
                                    name="options"
                                    aria-label={i.toString()}
                                    defaultChecked={i === 0}
                                />
                            ))}
                    </div>
                </div>
            </body>
            <script src="./script.js" />
        </html>
    );
}
