// Variables for pagination
let products = [];
let currentPage = 1;
const productsPerPage = 3;

// Obtener productos desde la BD mediante el endpoint PHP
async function fetchProducts() {
    try {
        // Ajusta la ruta según corresponda (por ejemplo, si getProducts.php está en htdocs)
        const response = await fetch('../../getProducts.php');
        products = await response.json();
        displayProducts(currentPage);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Function to display products for current page
function displayProducts(page) {
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = products.slice(start, end);
    
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = `
            <div class="product-card" data-product="${product.cod_prod}">
                <div class="product-image">
                    <img src="https://via.placeholder.com/300" alt="${product.nom_prod}" onclick="showProductDetails('${product.cod_prod}')">
                </div>
                <div class="product-info">
                    <h3>${product.nom_prod}</h3>
                    <p class="product-description">${product.desc_prod}</p>
                    <div class="product-meta">
                        <span class="price">${product.precio_prod}</span>
                    </div>
                    <div class="product-actions">
                        <button class="details-button" onclick="showProductDetails('${product.cod_prod}')">Ver Detalles</button>
                    </div>
                </div>
            </div>
        `;
        productsGrid.innerHTML += productCard;
    });

    updatePaginationButtons();
}

// Function to update pagination buttons
function updatePaginationButtons() {
    const totalPages = Math.ceil(products.length / productsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.className = `pagination-button ${i === currentPage ? 'active' : ''}`;
        button.textContent = i;
        button.onclick = () => {
            currentPage = i;
            displayProducts(currentPage);
        };
        paginationContainer.appendChild(button);
    }
}

// Function to show product details in modal
function showProductDetails(productId) {
    const product = products.find(p => p.cod_prod === productId);
    if (!product) return;

    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const modalPrice = document.getElementById('modalPrice');

    modalTitle.textContent = product.nom_prod;
    modalImage.src = product.image;
    modalImage.alt = product.nom_prod;
    modalDescription.textContent = product.desc_prod;
    modalPrice.textContent = product.precio_prod;

    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('active'), 10);
}

// Close modal when clicking on close button or outside the modal
document.querySelector('.close-modal').onclick = () => {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
};

window.onclick = (event) => {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});
