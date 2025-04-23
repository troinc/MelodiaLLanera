// cart.js - Gestión del carrito de compras

class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.total = 0;
        this.updateCartCount();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Botones de agregar al carrito
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleAddToCart(e));
        });

        // Botones de cantidad en el carrito
        const quantityInputs = document.querySelectorAll('.quantity-input');
        quantityInputs.forEach(input => {
            input.addEventListener('change', (e) => this.updateQuantity(e));
        });

        // Botones de eliminar del carrito
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => this.removeItem(e));
        });
    }

    handleAddToCart(e) {
        const productContainer = e.target.closest('.product-card, .product-detail-container');
        if (!productContainer) return;

        const productId = productContainer.dataset.productId;
        const productName = productContainer.querySelector('h3, h1').textContent;
        const productPrice = parseFloat(productContainer.querySelector('.product-price').textContent.replace(/[^0-9]/g, ''));
        const quantity = parseInt(productContainer.querySelector('.quantity-input')?.value || 1);
        const imageUrl = productContainer.querySelector('img').src;

        this.addItem({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: quantity,
            image: imageUrl
        });

        this.showNotification('Producto agregado al carrito');
    }

    addItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push(item);
        }

        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    removeItem(e) {
        const itemId = e.target.closest('.cart-item').dataset.productId;
        this.items = this.items.filter(item => item.id !== itemId);
        
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    updateQuantity(e) {
        const itemId = e.target.closest('.cart-item').dataset.productId;
        const newQuantity = parseInt(e.target.value);

        if (newQuantity < 1) {
            this.removeItem(e);
            return;
        }

        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    updateCartDisplay() {
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Tu carrito está vacío</p>
                    <a href="products.html" class="continue-shopping">Continuar comprando</a>
                </div>
            `;
            return;
        }

        cartContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">$${item.price.toLocaleString('es-CO')} COP</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="cart.decreaseQuantity('${item.id}')">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                    <button class="quantity-btn" onclick="cart.increaseQuantity('${item.id}')">+</button>
                </div>
                <p class="item-total">$${(item.price * item.quantity).toLocaleString('es-CO')} COP</p>
                <button class="remove-item" onclick="cart.removeItem('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        this.updateTotal();
    }

    updateTotal() {
        const totalElement = document.querySelector('.cart-total');
        if (!totalElement) return;

        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalElement.textContent = `$${this.total.toLocaleString('es-CO')} COP`;
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }
}

// Inicializar el carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
});
