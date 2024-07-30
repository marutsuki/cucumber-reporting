/* Constants */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PAGES_PER_PARTITION = 30;

const FEATURE_NAME_ATT = 'data-name';

/* Event listeners */

const SEARCH_INPUT_ID = 'feature-search';

const allFeatures = [...document.getElementsByClassName('feature')];
const inactiveFeatures = [];
const activeFeatures = [];

const allScenarios = [...document.getElementsByClassName('scenario')];

const searchFiltered = new Set();
const failedScenarioFiltered = new Set();
const failedFeatureFiltered = new Set();

/** Tailwind setup */

// eslint-disable-next-line no-undef
tailwind.config = {
    daisyui: {
        themes: [
            'light',
            'dark',
            'cupcake',
            'bumblebee',
            'emerald',
            'corporate',
            'synthwave',
            'retro',
            'cyberpunk',
            'valentine',
            'halloween',
            'garden',
            'forest',
            'aqua',
            'lofi',
            'pastel',
            'fantasy',
            'wireframe',
            'black',
            'luxury',
            'dracula',
            'cmyk',
            'autumn',
            'business',
            'acid',
            'lemonade',
            'night',
            'coffee',
            'winter',
            'dim',
            'nord',
            'sunset',
        ],
    },
};

/**
 * Add an event listener to filter features based on the search input.
 */
document.getElementById(SEARCH_INPUT_ID).addEventListener('input', (e) => {
    const search = e.target.value;
    for (const feature of allFeatures) {
        if (
            feature
                .getAttribute(FEATURE_NAME_ATT)
                .toLowerCase()
                .includes(search.toLowerCase())
        ) {
            searchFiltered.delete(feature);
        } else {
            searchFiltered.add(feature);
        }
    }
    update();
});

const FAILED_FEATURES_ONLY_CHECKBOX_ID = 'fail-filter-feature';

const failedFeaturesOnly = (enabled) => {
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
document
    .getElementById(FAILED_FEATURES_ONLY_CHECKBOX_ID)
    .addEventListener('change', (e) => {
        failedFeaturesOnly(e.target.checked);
        update();
    });



const FAILED_SCENARIOS_ONLY_CHECKBOX_ID = 'fail-filter-scenario';

const failedScenariosOnly = (enabled) => {
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
document
    .getElementById(FAILED_SCENARIOS_ONLY_CHECKBOX_ID)
    .addEventListener('change', (e) => {
        failedScenariosOnly(e.target.checked);
        update();
    });


const isEligibleForDisplay = (feature) => {
    return (
        !failedFeatureFiltered.has(feature) &&
        !searchFiltered.has(feature)
    );
};

const loadFeatures = () => {
    // Clear cache
    activeFeatures.splice(0, activeFeatures.length);
    inactiveFeatures.splice(0, inactiveFeatures.length);

    allFeatures.forEach((feature) => {
        // Exclude pages that are filtered out
        if (isEligibleForDisplay(feature)) {
            activeFeatures.push(feature);
        } else {
            inactiveFeatures.push(feature);
        }
    });

    // Show/hide scenarios
    allScenarios.forEach((scenario) => {
        if (!failedScenarioFiltered.has(scenario)) {
            // DaisyUI uses display: grid for the accordion component
            scenario.style.display = 'grid';
        } else {
            scenario.style.display = 'none';
        }
    });
};

/**
 * Updates the displayed page to the given page index.
 *
 * @param {*} page the page index to display
 */
const changePage = (newPage) => {
    togglePage(newPage);
};

const contentElem = document.getElementById('content');

let activePartition;
let cache;

const togglePage = async (page) => {
    const partition = Math.floor(page / PAGES_PER_PARTITION);
    if (activePartition !== partition) {
        cache = await window.features[partition]();
    }
    const features = cache[page];
    contentElem.innerHTML = window.genFeatureHtml(features);
    activePartition = partition;
}

const paginationButton = (i) => {
    const button = document.createElement('input');
    button.type = 'radio';
    button.name = 'options';
    button.checked = i === 0;
    button.className =
        'pagination-button pagination-button-join-item btn btn-square';
    button.setAttribute('data-page', i);
    button.innerText = i;
    button.ariaLabel = i;
    button.addEventListener('click', () => {
        changePage(button.getAttribute('data-page'));
    });
    return button;
};

/**
 * Updates the pagination based on the current filters.
 */
const updatePagination = () => {
    const pages = window.features.length;

    const paginationElem = document.getElementById('pagination');

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
    loadFeatures();
    updatePagination();
    // Reset active page back to 0
    togglePage(0);
};


if (window.config.showFailedOnStart) {
    failedFeaturesOnly(true);
    failedScenariosOnly(true);
}

// Initally hide all pages and let update() populate the first page
document.querySelectorAll('.page').forEach((p) => {
    p.style.display = 'none';
    // Even though the content is already collapsed inside the accordion, we can
    // set `display` to `none` to reduce the amount of layout computation needed.
    const content = [...p.getElementsByClassName('content')];
    content.forEach(c => {
        c.style.display = 'none';
    });

    // Then we only enable `display` when the accordion contents should be
    // visible, ie. the input is checked.
    p.getElementsByTagName('input')[0].addEventListener('change', (e) => {
        const display = e.target.checked ? 'grid' : 'none'
        content.forEach(c => {
            c.style.display = display;
        })
    })
});

update();
