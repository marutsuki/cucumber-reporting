
/* Constants */

const PAGE_SIZE = 15;

const FEATURE_NAME_ATT = 'data-name';
const SEARCH_FILTER_ATT = 'data-filtered-search'
const FAILED_FILTER_ATT = 'data-filtered-failed'

/* Event listeners */

const SEARCH_INPUT_ID = "feature-search"

const allFeatures = [...document.getElementsByClassName("feature")];
const inactiveFeatures = [];
const activeFeatures = [];

/**
 * Add an event listener to filter features based on the search input.
 */
document.getElementById(SEARCH_INPUT_ID).addEventListener("input", (e) => {
    const search = e.target.value;
    for (const feature of allFeatures) {
        if (feature.getAttribute(FEATURE_NAME_ATT).toLowerCase().includes(search.toLowerCase())) {
            feature.removeAttribute(SEARCH_FILTER_ATT);
        } else {
            feature.setAttribute(SEARCH_FILTER_ATT, '');
        }
    }
    update();
})

const FAILED_ONLY_CHECKBOX_ID = "fail-filter"

/**
 * Add an event listener to filter features based on if they have failed.
 */
document.getElementById(FAILED_ONLY_CHECKBOX_ID).addEventListener("change", (e) => {
    const enabled = e.target.checked;
    for (const feature of allFeatures) {
        if (!enabled || feature.getAttribute('data-status') === 'failed') {
            feature.removeAttribute(FAILED_FILTER_ATT);
        } else {
            feature.setAttribute(FAILED_FILTER_ATT, '');
        }
    }
    update();
});

/* Utility functions */

const isEligibleForDisplay = (feature) => {
    return feature.getAttribute(SEARCH_FILTER_ATT) === null
        && feature.getAttribute(FAILED_FILTER_ATT) === null;
}

const loadFeatures = () => {
    activeFeatures.splice(0, activeFeatures.length);
    inactiveFeatures.splice(0, inactiveFeatures.length);

    allFeatures.forEach((feature) => {
        // Exclude pages that are filtered out
        if (isEligibleForDisplay(feature)) {
            feature.style.display = "grid";
            activeFeatures.push(feature);
        } else {
            feature.style.display = "none";
            inactiveFeatures.push(feature);
        }
    });
}
/**
 * Gets the pagination index for the nth record.
 * 
 * @param {*} index the index of the record
 * @returns the page index
 */
const getPageIndex = (index) => Math.floor(index / PAGE_SIZE);

/**
 * Updates the displayed page to the given page index.
 * 
 * @param {*} page the page index to display
 */
const changePage = (page) => {
    document.querySelectorAll('.page').forEach((p) => {
        p.style.display = 'none';
    });
    document.querySelectorAll(`.feature[data-page='${page}'`).forEach(p => {
        p.style.display = 'grid';
    });
}

const paginationButton = (i) => {
    const button = document.createElement('input');
    button.type = "radio"
    button.name = "options"
    button.checked = i === 0;
    button.className = "pagination-button pagination-button-join-item btn btn-square";
    button.setAttribute('data-page', i);
    button.innerText = i;
    button.ariaLabel = i;
    button.addEventListener('click', () => {
        changePage(button.getAttribute('data-page'));
    });
    return button;
}

/**
 * Updates the pagination based on the current filters.
 */
const updatePagination = () => {
    // Remove page index from inactive features
    inactiveFeatures.forEach(p => p.removeAttribute('data-page'));

    // Assign css class indicating page index
    const features = activeFeatures
        .map((p, i) => {
            p.setAttribute('data-page', getPageIndex(i))
        });

    const pages = Math.ceil(features.length / PAGE_SIZE);

    const paginationElem = document.getElementById('pagination');

    // Remove existing pagination buttons
    paginationElem.innerHTML = '';

    // Add new pagination buttons
    Array(pages)
        .fill(0)
        .forEach((_, i) => {
            paginationElem.appendChild(paginationButton(i));
        });

    changePage(0);
}

/* Main */

const update = () => {
    loadFeatures();
    updatePagination();
}

update();