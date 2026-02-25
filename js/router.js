/* ═══════════════════════════════════════════════════
   SQUAX — Hash-Based SPA Router
═══════════════════════════════════════════════════ */

const Routes = {
    '': 'dashboard',
    '#dashboard': 'dashboard',
    '#bounties': 'bounties',
    '#sandbox': 'sandbox',
    '#reports': 'reports',
    '#june': 'june',
};

const PageLoaders = {};

function registerPage(name, loaderFn) {
    PageLoaders[name] = loaderFn;
}

function getRoute() {
    const hash = window.location.hash || '';
    return Routes[hash] || Routes['#dashboard'];
}

function navigateTo(hash) {
    window.location.hash = hash;
}

async function render() {
    const route = getRoute();
    const content = document.getElementById('page-content');

    // Update active nav
    document.querySelectorAll('.nav-item[data-route]').forEach(el => {
        el.classList.toggle('active', el.dataset.route === route);
    });

    // Clear & render
    content.innerHTML = '';
    if (PageLoaders[route]) {
        PageLoaders[route](content);
    }
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);

window.Router = { navigateTo, registerPage, render };
