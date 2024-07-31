import { MAX_PAGINATION_BUTTONS } from './constants';

const paginationButton = (i: number, onPageChange: (page: number) => void) => {
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
        onPageChange(parseInt(page));
    });
    return button;
};

const paginationInput = (onPageChange: (page: number) => void) => {
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
        onPageChange(page);
    });
    return input;
};

/**
 * Updates the pagination based on the current filters.
 */
export const genPaginationElements = (
    pages: number,
    container: HTMLElement,
    onPageChange: (page: number) => void
) => {
    // Add new pagination buttons
    if (pages > MAX_PAGINATION_BUTTONS) {
        container.appendChild(paginationButton(0, onPageChange));
        container.appendChild(paginationInput(onPageChange));
        container.appendChild(paginationButton(pages - 1, onPageChange));
    } else {
        Array(pages)
            .fill(0)
            .forEach((_, i) => {
                container.appendChild(paginationButton(i, onPageChange));
            });
    }
};
