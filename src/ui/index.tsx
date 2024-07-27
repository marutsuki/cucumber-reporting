export default function CucumberReport({ model }: { model: TestSuite }) {
    console.log(model.features);
    return (
        <div>
            <h1>{model.name}</h1>
            <ul>
                {model.features.map((feature) => (
                    <li key={feature.name}>
                        <h2>{feature.name}</h2>
                        <ul>
                            {feature.elements?.map((scenario) => (
                                <li key={scenario.name}>
                                    <h3>{scenario.name}</h3>
                                    <ul>
                                        {scenario.steps.map((step) => (
                                            <li key={step.name}>
                                                <h4>{step.name}</h4>
                                                <p>{step.result?.status}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}
