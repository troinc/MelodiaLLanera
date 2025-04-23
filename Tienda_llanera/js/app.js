// app.js - Funcionalidad general de la aplicación

document.addEventListener('DOMContentLoaded', () => {
    initializeCurrencySelector();
    initializeNavigation();
    initializeProductFilters();
    initializeProductTabs();
});

// Manejo de conversión de moneda
function initializeCurrencySelector() {
    const currencySelector = document.getElementById('currency-selector');
    if (currencySelector) {
        currencySelector.addEventListener('change', updateCurrencyDisplay);
        // Cargar preferencia guardada
        const savedCurrency = localStorage.getItem('preferredCurrency') || 'COP';
        currencySelector.value = savedCurrency;
        updateCurrencyDisplay();
    }
}

function updateCurrencyDisplay() {
    const currencySelector = document.getElementById('currency-selector');
    const selectedCurrency = currencySelector.value;
    localStorage.setItem('preferredCurrency', selectedCurrency);

    const prices = document.querySelectorAll('.product-price, .item-price, .item-total, .cart-total');
    prices.forEach(price => {
        const amount = parseFloat(price.textContent.replace(/[^0-9]/g, ''));
        if (selectedCurrency === 'USD') {
            // Tasa de conversión aproximada
            const usdAmount = amount / 4000;
            price.textContent = `$${usdAmount.toFixed(2)} USD`;
        } else {
            price.textContent = `$${amount.toLocaleString('es-CO')} COP`;
        }
    });
}

// Navegación y UI
function initializeNavigation() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Marcar enlace activo
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const activeLink = document.querySelector(`.nav-links a[href="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Filtros de productos
function initializeProductFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    const searchInput = document.querySelector('.search-input');

    if (filterSelects) {
        filterSelects.forEach(select => {
            select.addEventListener('change', filterProducts);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
}

function filterProducts() {
    const products = document.querySelectorAll('.product-card');
    const categoryFilter = document.querySelector('#category-filter')?.value || 'all';
    const priceFilter = document.querySelector('#price-filter')?.value || 'all';
    const searchTerm = document.querySelector('.search-input')?.value.toLowerCase() || '';

    products.forEach(product => {
        const category = product.dataset.category;
        const price = parseFloat(product.dataset.price);
        const name = product.querySelector('h3').textContent.toLowerCase();

        const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
        const matchesPrice = priceFilter === 'all' || matchesPriceRange(price, priceFilter);
        const matchesSearch = name.includes(searchTerm);

        product.style.display = matchesCategory && matchesPrice && matchesSearch ? 'block' : 'none';
    });
}

function matchesPriceRange(price, range) {
    switch (range) {
        case 'under-1m':
            return price < 1000000;
        case '1m-2m':
            return price >= 1000000 && price <= 2000000;
        case 'over-2m':
            return price > 2000000;
        default:
            return true;
    }
}

// Pestañas de producto
function initializeProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons && tabContents) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;

                // Actualizar botones
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Actualizar contenido
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
}
