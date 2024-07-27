import Feature from './Feature';
import './globals.css';
export default function CucumberReport({ model }: { model: TestSuite }) {
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
            <body className="flex w-full">
                <div>
                    <h1>{model.name}</h1>
                    <ul>
                        {model.features.map((feature) => (
                            <Feature key={feature.id} model={feature} />
                        ))}
                    </ul>
                </div>
            </body>
        </html>
    );
}
