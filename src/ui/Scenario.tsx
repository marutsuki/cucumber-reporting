import path from 'path';
import { Config } from '../config';
import { Scenario, Status, Step } from '../processing/types';

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

// Currently the supported languages are Java, JavaScript, TypeScript, Ruby
const cleanUrl = (url: string) =>
    url.replace(/(.+\.(java|js|ts|jsx|tsx|rb)):\d+/g, '$1');

const getLineNo = (url: string) => {
    const match = url.match(/:(\d+)$/);
    return match ? match[1] : '';
};

function Ref({ location }: { location: string }) {
    const projDir = Config.getConfig('projDir');
    const url = cleanUrl(location);
    const link = (
        <code>
            Line ${getLineNo(location)} at ${url}
        </code>
    );
    return projDir ? (
        <a className="text-primary underline" href={path.join(projDir, url)}>
            {link}
        </a>
    ) : (
        <div>{link}</div>
    );
}

function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="max-h-96 overflow-y-auto p-4">
            <pre className="whitespace-pre-wrap text-sm bg-base-100 text-base-content p-2">
                {message}
            </pre>
        </div>
    );
}

const formatSeconds = (seconds: number) =>
    `${Math.round(seconds * 1e-9 * 100) / 100}s`;

function Step({
    keyword,
    name,
    match,
    result,
    embeddings,
    arguments: argumentz,
    ...props
}: Step & React.Attributes) {
    const key = props.key?.toString() || '';
    return (
        <li {...props} className="pt-2 max-w-full">
            <div>
                <div className="flex flex-row justify-between text-md">
                    <div className="flex flex-row">
                        <span className="font-bold">{keyword}</span>
                        <span className="indent-2">{name}</span>
                    </div>
                    <div className="flex flex-row items-center">
                        <p className="px-2">
                            {formatSeconds(result?.duration || 0)}
                        </p>
                        <Status status={result?.status || 'ambiguous'} />
                    </div>
                </div>

                <div className="max-w-[75%]">
                    {argumentz &&
                        argumentz.map((arg, k) => (
                            <table key={`${name}:table:${k}`} className="table">
                                {arg.rows.map((row, i) => (
                                    <tr key={`${name}:${i}:${key}`}>
                                        {row.cells.map((cell, j) => (
                                            <td
                                                key={`${name}:${i}:${key}:${j}`}
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </table>
                        ))}
                </div>
            </div>

            {embeddings &&
                embeddings.length > 0 &&
                embeddings.map((embedding, i) => {
                    const key = `${embedding.data.slice(0, 10)}:${i}:embedding`;
                    switch (embedding.mime_type) {
                        case 'image/png':
                            return (
                                <img
                                    key={key}
                                    src={`data:image/png;base64,${embedding.data}`}
                                    alt="screenshot"
                                />
                            );
                        case 'image/jpeg':
                            return (
                                <img
                                    key={key}
                                    src={`data:image/jpeg;base64,${embedding.data}`}
                                    alt="screenshot"
                                />
                            );
                        default:
                            return <pre key={key}>{embedding.data}</pre>;
                    }
                })}
            {result?.error_message && (
                <>
                    {match && <Ref location={match.location} />}
                    <ErrorMessage message={result.error_message} />
                </>
            )}
        </li>
    );
}
export default function Scenario({ id, name, steps, before, after }: Scenario) {
    let failed = false;
    if (steps.some((step) => step.result?.status === 'failed')) {
        failed = true;
    }
    return (
        <div
            {...(failed && { 'data-status': 'failed' })}
            className="scenario collapse bg-base-300 m-2 shadow-lg shadow-base-content"
        >
            <input className="min-h-1" type="checkbox" />
            <h2
                className={`text-base-content collapse-title text-md font-medium px-2 py-0.5 min-h-0 bg-opacity-50 ${failed ? 'bg-error text-error-content' : 'bg-neutral text-neutral-content'}`}
            >
                {name}
            </h2>
            <ul className="collapse-content">
                {before &&
                    before
                        .filter(
                            (b) =>
                                // Only display the After step if there's meaningful information
                                (b.embeddings && b.embeddings.length > 0) ||
                                b.result.status !== 'passed'
                        )
                        .map((beforeStep, i) => (
                            <Step
                                key={`${id || name}:before:${i}`}
                                {...beforeStep}
                                keyword="Before"
                                line={0}
                                name={beforeStep.match?.location || ''}
                            />
                        ))}
                {steps.map((step) => (
                    <Step key={`${id || name}:${step.name}}`} {...step} />
                ))}
                {after &&
                    after
                        .filter(
                            (a) =>
                                // Only display the After step if there's meaningful information
                                (a.embeddings && a.embeddings.length > 0) ||
                                a.result.status !== 'passed'
                        )
                        .map((afterStep, i) => (
                            <Step
                                key={`${id || name}:after:${i}`}
                                {...afterStep}
                                keyword="After"
                                line={0}
                                name={afterStep.match?.location || ''}
                            />
                        ))}
            </ul>
        </div>
    );
}
