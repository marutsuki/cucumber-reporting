function Status({ status }: { status: Status }) {
    switch (status) {
        case 'passed':
            return <div className="badge badge-success gap-2">Passed</div>;
        case 'failed':
            return <div className="badge badge-error gap-2">Failed</div>;
        case 'skipped':
            return <div className="badge badge-warning gap-2">Skipped</div>;
        case 'pending':
            return <div className="badge badge-info gap-2">Pending</div>;
        case 'undefined':
            return <div className="badge badge-warning gap-2">Undefined</div>;
        case 'ambiguous':
            return <div className="badge badge-warning gap-2">Ambiguous</div>;
        default:
            return <div className="badge gap-2">Ambiguous</div>;
    }
}
function Step({ name, result }: Step) {
    return (
        <li>
            <div className="flex flex-row justify-between text-md">
                <span>{name}</span>
                <div className="flex flex-row items-center">
                    <p className="px-2">{result?.duration || '0.00s'}</p>
                    <Status status={result?.status || 'ambiguous'} />
                </div>
            </div>
            {result?.error_message && (
                <div className="p-4 mockup-code">{result.error_message}</div>
            )}
        </li>
    );
}
export default function Scenario({ name, steps }: Scenario) {
    let failed = false;
    if (steps.some((step) => step.result?.status === 'failed')) {
        failed = true;
    }
    return (
        <div className="collapse bg-base-200 m-2">
            <input className="min-h-1" type="checkbox" />
            <h2
                className={`collapse-title text-xl font-medium p-2 min-h-0 ${failed ? 'bg-error' : ''}`}
            >
                {name}
            </h2>
            <ul className="collapse-content">
                {steps.map((step) => (
                    <Step {...step} />
                ))}
            </ul>
        </div>
    );
}
