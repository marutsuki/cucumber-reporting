import { PAGES_PER_PARTITION } from '../constants';
import { features } from './features';
import { genFeatureHtml } from './templating';
import { genPaginationElements } from './pagination';

const contentElem = document.getElementById('content');

if (contentElem === null) {
    throw new Error('Content container not found');
}

const paginationElem = document.getElementById('pagination');

if (paginationElem === null) {
    throw new Error('Pagination container not found');
}

const engineInternal = {
    pages: 0,
    allScenarios: [] as Element[],
    initialized: false,
    searchFilter: '',
    failedFeaturesOnly: false,
    failedScenariosOnly: (enabled: boolean) => {
        for (const scenario of engineInternal.allScenarios) {
            if (!(scenario instanceof HTMLElement)) {
                continue;
            }
            if (!enabled || scenario.getAttribute('data-status') === 'failed') {
                scenario.style.display = 'grid';
            } else {
                scenario.style.display = 'none';
            }
        }
    },
    togglePage: async (page: number) => {
        const partition = Math.floor(page / PAGES_PER_PARTITION);
        const offset = page % PAGES_PER_PARTITION;
        const fs = await features(
            partition,
            offset,
            engineInternal.failedFeaturesOnly,
            engineInternal.searchFilter
        );
        console.log(fs);
        contentElem.innerHTML = genFeatureHtml(fs.features);
        engineInternal.allScenarios.splice(
            0,
            engineInternal.allScenarios.length
        );
        engineInternal.allScenarios.push(
            ...document.getElementsByClassName('scenario')
        );
        engineInternal.pages = fs.availablePages;
    },
    /**
     * Updates the pagination based on the current filters.
     */
    updatePagination: () => {
        // Remove existing pagination buttons
        paginationElem.innerHTML = '';
        genPaginationElements(engineInternal.pages, paginationElem, (page) =>
            engine.togglePage(page)
        );
    },
};

export const initEngine = (failedOnly: boolean) => {
    if (engineInternal.initialized) {
        return;
    }
    engineInternal.failedFeaturesOnly = failedOnly;
    engineInternal.initialized = true;
};

const engine = {
    setSearchFilter: (filter: string) => {
        engineInternal.searchFilter = filter;
        engineInternal.togglePage(0);
        engineInternal.updatePagination();
    },
    setFailedScenariosOnly: (enabled: boolean) => {
        engineInternal.failedScenariosOnly(enabled);
    },
    setFailedFeaturesOnly: (enabled: boolean) => {
        engineInternal.failedFeaturesOnly = enabled;
        engineInternal.togglePage(0);
        engineInternal.updatePagination();
    },
    setFailedOnly: (enabled: boolean) => {
        engine.setFailedFeaturesOnly(enabled);
        engine.setFailedScenariosOnly(enabled);
    },
    togglePage: async (page: number) => {
        engineInternal.togglePage(page);
    },
};

export default engine;
