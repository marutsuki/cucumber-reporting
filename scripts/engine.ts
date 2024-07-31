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
        const pages = await features(
            partition,
            engineInternal.failedFeaturesOnly,
            engineInternal.searchFilter
        );
        contentElem.innerHTML = genFeatureHtml(pages[page]);
        engineInternal.allScenarios.splice(
            0,
            engineInternal.allScenarios.length
        );
        engineInternal.allScenarios.push(
            ...document.getElementsByClassName('scenario')
        );
    },
    /**
     * Updates the pagination based on the current filters.
     */
    updatePagination: () => {
        const pages = engineInternal.failedFeaturesOnly
            ? window.failed.pages
            : window.data.pages;
        // Remove existing pagination buttons
        paginationElem.innerHTML = '';
        genPaginationElements(pages, paginationElem, engine.togglePage);
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
        engineInternal.updatePagination();
        engineInternal.togglePage(0);
    },
    setFailedScenariosOnly: (enabled: boolean) => {
        engineInternal.failedScenariosOnly(enabled);
    },
    setFailedFeaturesOnly: (enabled: boolean) => {
        engineInternal.failedFeaturesOnly = enabled;
        engineInternal.updatePagination();
        engineInternal.togglePage(0);
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
