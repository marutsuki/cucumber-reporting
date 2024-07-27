import Scenario from './Scenario';

export default function Feature({ model }: { model: Feature }) {
    let failed;
    if (
        model.elements.some((feature) =>
            feature.steps.some((step) => step.result?.status === 'failed')
        )
    ) {
        failed = true;
    }
    return (
        <div className="collapse bg-base-200 m-2">
            <input className="min-h-1" type="checkbox" />
            <h2
                className={`collapse-title text-md font-medium m-0 p-1 min-h-0 ${failed ? 'bg-error' : ''}`}
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
