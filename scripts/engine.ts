import { ProcessedFeature } from 'src/processing/types';
import { MAX_PAGINATION_BUTTONS, PAGES_PER_PARTITION } from './constants';
import { loadTries } from './trie';
import { features } from './features';
import { genFeatureHtml } from './templating';

type PartitionData = {
    providers: (() => Promise<ProcessedFeature[][]>)[];
    pages: number;
};

declare global {
    interface Window {
        data: PartitionData;
        failed: PartitionData;
        config: {
            showFailedOnStart: boolean;
        };
    }
}

/* Event listeners */

const SEARCH_INPUT_ID = 'feature-search';

const allScenarios = [...document.getElementsByClassName('scenario')];

/**
 * Add an event listener to filter features based on the search input.
 */
let searchFilter = '';
const searchElem = document.getElementById(SEARCH_INPUT_ID);
if (searchElem !== null) {
    searchElem.addEventListener('change', (e) => {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        searchFilter = e.target.value;
        update();
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
        failedFeaturesOnly = e.target.checked;
        update();
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
 * Add an event listener to filter features based on if they have failed.
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
        failedScenariosOnly(e.target.checked);
    });
}

const failedScenariosOnly = (enabled: boolean) => {
    for (const scenario of allScenarios) {
        if (!(scenario instanceof HTMLElement)) {
            continue;
        }
        if (!enabled || scenario.getAttribute('data-status') === 'failed') {
            scenario.style.display = 'grid';
        } else {
            scenario.style.display = 'none';
        }
    }
};

const contentElem = document.getElementById('content');

if (contentElem === null) {
    throw new Error('Content container not found');
}

let activePartition = -1;
let cache: ProcessedFeature[][];

let failedFeaturesOnly = false;

const togglePage = async (page: number, refresh: boolean = false) => {
    const partition = Math.floor(page / PAGES_PER_PARTITION);
    if (refresh || activePartition !== partition) {
        cache = await features(partition, failedFeaturesOnly, searchFilter);
    }
    contentElem.innerHTML = genFeatureHtml(cache[page]);
    activePartition = partition;
    updateScenarios();
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
    throw new Error('Pagination container not found');
}

const paginationInput = () => {
    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = '...';
    input.className = 'input w-20 mx-4 text-center bg-base-300';
    input.addEventListener('change', (e) => {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        const page = parseInt(e.target.value);
        if (isNaN(page)) {
            return;
        }
        togglePage(page);
    });
    return input;
};
/**
 * Updates the pagination based on the current filters.
 */
const updatePagination = () => {
    const pages = failedFeaturesOnly ? window.failed.pages : window.data.pages;

    // Remove existing pagination buttons
    paginationElem.innerHTML = '';

    // Add new pagination buttons
    if (pages > MAX_PAGINATION_BUTTONS) {
        paginationElem.appendChild(paginationButton(0));
        paginationElem.appendChild(paginationInput());
        paginationElem.appendChild(paginationButton(pages - 1));
    } else {
        Array(pages)
            .fill(0)
            .forEach((_, i) => {
                paginationElem.appendChild(paginationButton(i));
            });
    }
};

const updateScenarios = () => {
    allScenarios.splice(0, allScenarios.length);
    allScenarios.push(...document.getElementsByClassName('scenario'));
};

const update = () => {
    updatePagination();
    // Reset active page back to 0
    togglePage(0, true);
};

if (window.config.showFailedOnStart) {
    console.info('Showing failed features only on load');
    failedScenariosOnly(true);
    failedFeaturesOnly = true;
    failedFeaturesCheckbox.checked = true;
    failedScenariosCheckbox.checked = true;
}

loadTries();

update();
