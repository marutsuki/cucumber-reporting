import { SEARCH_INPUT_ID } from '@constants';
import engine from './engine';

export default function addListeners(showFailed: boolean) {
    /**
     * Add an event listener to filter features based on the search input.
     */
    const searchElem = document.getElementById(SEARCH_INPUT_ID);
    if (searchElem !== null) {
        searchElem.addEventListener('change', (e) => {
            if (!(e.target instanceof HTMLInputElement)) {
                return;
            }
            engine.setSearchFilter(e.target.value);
        });
    }

    const FAILED_FEATURES_ONLY_CHECKBOX_ID = 'fail-filter-feature';

    /**
     * Add an event listener to filter features based on if they have failed.
     */
    const failedFeaturesCheckbox = document.getElementById(
        FAILED_FEATURES_ONLY_CHECKBOX_ID
    );
    if (failedFeaturesCheckbox !== null) {
        failedFeaturesCheckbox.addEventListener('change', (e) => {
            if (!(e.target instanceof HTMLInputElement)) {
                return;
            }
            engine.setFailedFeaturesOnly(e.target.checked);
        });
    }

    const FAILED_SCENARIOS_ONLY_CHECKBOX_ID = 'fail-filter-scenario';

    if (
        failedFeaturesCheckbox === null ||
        !(failedFeaturesCheckbox instanceof HTMLInputElement)
    ) {
        throw new Error("Couldn't find failed features filter checkbox");
    }

    /**
     * Add an event listener to filter scenarios based on if they have failed.
     */
    const failedScenariosCheckbox = document.getElementById(
        FAILED_SCENARIOS_ONLY_CHECKBOX_ID
    );
    if (
        failedScenariosCheckbox === null ||
        !(failedScenariosCheckbox instanceof HTMLInputElement)
    ) {
        throw new Error("Couldn't find failed scenarios filter checkbox");
    }

    if (failedScenariosCheckbox !== null) {
        failedScenariosCheckbox.addEventListener('change', (e) => {
            if (!(e.target instanceof HTMLInputElement)) {
                return;
            }
            engine.setFailedScenariosOnly(e.target.checked);
        });
    }

    if (showFailed) {
        failedFeaturesCheckbox.checked = true;
        failedScenariosCheckbox.checked = true;
    }
}
