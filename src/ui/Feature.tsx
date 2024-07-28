import Scenario from './Scenario';

export default function Feature({
    model,
    ...props
}: { model: Feature } & React.Attributes) {
    let failed;
    if (
        model.elements.some((feature) =>
            feature.steps.some((step) => step.result?.status === 'failed')
        )
    ) {
        failed = true;
    }
    return (
        <div
            className="page feature collapse bg-base-200 m-2"
            data-name={model.name}
            {...(failed && { 'data-status': 'failed' })}
            {...props}
        >
            <input className="min-h-1" type="checkbox" />
            <h2
                className={`text-base-content collapse-title text-md font-medium m-0 p-1 min-h-0 bg-opacity-50 ${failed ? 'bg-error' : 'bg-success'}`}
            >
                {model.name}
            </h2>
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
