import { Config } from '../config';

export default function Toolbar() {
    const showFailedOnStart = Config.getConfig('showFailedOnStart');
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Results</a>
            </div>
            <div className="flex-none gap-2">
                <label>Failed Features Only</label>
                <input
                    id="fail-filter-feature"
                    type="checkbox"
                    defaultChecked={showFailedOnStart}
                />
                <label>Failed Scenarios Only</label>
                <input
                    id="fail-filter-scenario"
                    type="checkbox"
                    defaultChecked={showFailedOnStart}
                />

                <div className="form-control">
                    <input
                        id="feature-search"
                        type="text"
                        placeholder="Search"
                        className="input input-bordered w-24 md:w-auto"
                    />
                </div>
            </div>
        </div>
    );
}
