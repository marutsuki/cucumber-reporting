/* eslint-disable no-undef */

for (const button of document.getElementsByClassName('pagination-button')) {
    button.addEventListener('click', () => {
        changePage(button.getAttribute('data-page'));
    });
}

const changePage = (page) => {
    document.querySelectorAll('.page').forEach((p) => {
        console.log(p);
        p.style.display = 'none';
    });
    document.querySelectorAll(`.page-${page}`).forEach(p => {
        p.style.display = 'block';
    });
}