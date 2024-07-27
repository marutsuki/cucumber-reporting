import Scenario from './Scenario';

export default function Feature({ model }: { model: Feature }) {
    return (
        <li>
            <h2>{model.name}</h2>
            <ul>
                {model.elements.map((scenario) => (
                    <Scenario key={scenario.id} {...scenario} />
                ))}
            </ul>
        </li>
    );
}
