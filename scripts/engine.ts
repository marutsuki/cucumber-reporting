/* Constants */

import { Feature } from "src/processing/types";

declare global {
    interface Window {
        genFeatureHtml: (features: Feature[]) => string;
        features: (() => Promise<Feature[][]>)[];
        config: {
            showFailedOnStart: boolean;

        }
    }
}

const PAGES_PER_PARTITION = 30;

const FEATURE_NAME_ATT = 'data-name';

/* Event listeners */

const SEARCH_INPUT_ID = 'feature-search';

const allFeatures = [...document.getElementsByClassName('feature')];

const allScenarios = [...document.getElementsByClassName('scenario')];

const searchFiltered = new Set();
const failedScenarioFiltered = new Set();
const failedFeatureFiltered = new Set();

/**
 * Add an event listener to filter features based on the search input.
 */
const searchElem = document.getElementById(SEARCH_INPUT_ID);
if (searchElem !== null) {
    searchElem.addEventListener('input', (e) => {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        const search = e.target.value;
        for (const feature of allFeatures) {
            if (
                (
                    feature
                        .getAttribute(FEATURE_NAME_ATT)?.toLowerCase() || '')
                    .includes(search.toLowerCase())
            ) {
                searchFiltered.delete(feature);
            } else {
                searchFiltered.add(feature);
            }
        }
        update();
    });
}


const FAILED_FEATURES_ONLY_CHECKBOX_ID = 'fail-filter-feature';

const failedFeaturesOnly = (enabled: boolean) => {
    for (const feature of allFeatures) {
        if (!enabled || feature.getAttribute('data-status') === 'failed') {
            failedFeatureFiltered.delete(feature);
        } else {
            failedFeatureFiltered.add(feature);
        }
    }
};

/**
 * Add an event listener to filter features based on if they have failed.
 */
const failedFeaturesCheckbox = document
    .getElementById(FAILED_FEATURES_ONLY_CHECKBOX_ID);
if (failedFeaturesCheckbox !== null) {
    failedFeaturesCheckbox.addEventListener('change', (e) => {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        failedFeaturesOnly(e.target.checked);
        update();
    });
}


const FAILED_SCENARIOS_ONLY_CHECKBOX_ID = 'fail-filter-scenario';

const failedScenariosOnly = (enabled: boolean) => {
    for (const scenario of allScenarios) {
        if (!enabled || scenario.getAttribute('data-status') === 'failed') {
            failedScenarioFiltered.delete(scenario);
        } else {
            failedScenarioFiltered.add(scenario);
        }
    }
};

/**
 * Add an event listener to filter features based on if they have failed.
 */
const failedScenariosCheckbox = document
    .getElementById(FAILED_SCENARIOS_ONLY_CHECKBOX_ID)
if (failedScenariosCheckbox !== null) {
    failedScenariosCheckbox.addEventListener('change', (e) => {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        failedScenariosOnly(e.target.checked);
        update();
    });
}

const contentElem = document.getElementById('content');

if (contentElem === null) {
    throw new Error("Content container not found");
}

let activePartition = -1;
let cache: Feature[][];

const togglePage = async (page: number) => {
    const partition = Math.floor(page / PAGES_PER_PARTITION);
    if (activePartition !== partition) {
        cache = await window.features[partition]();
    }
    const features = cache[page];
    contentElem.innerHTML = window.genFeatureHtml(features);
    activePartition = partition;
};

const paginationButton = (i: number) => {
    const button = document.createElement('input');
    const str = i.toString();
    button.type = 'radio';
    button.name = 'options';
    button.checked = i === 0;
    button.className =
        'pagination-button pagination-button-join-item btn btn-square';
    button.setAttribute('data-page', str);
    button.innerText = str;
    button.ariaLabel = str;
    button.addEventListener('click', () => {
        const page = button.getAttribute('data-page');
        if (page === null) {
            return;
        }
        togglePage(parseInt(page));
    });
    return button;
};

const paginationElem = document.getElementById('pagination');

if (paginationElem === null) {
    throw new Error("Pagination container not found");
}

/**
 * Updates the pagination based on the current filters.
 */
const updatePagination = () => {
    const pages = window.features.length;


    // Remove existing pagination buttons
    paginationElem.innerHTML = '';

    // Add new pagination buttons
    Array(pages)
        .fill(0)
        .forEach((_, i) => {
            paginationElem.appendChild(paginationButton(i));
        });
};

const update = () => {
    updatePagination();
    // Reset active page back to 0
    togglePage(0);
};

if (window.config.showFailedOnStart) {
    failedFeaturesOnly(true);
    failedScenariosOnly(true);
}

update();
