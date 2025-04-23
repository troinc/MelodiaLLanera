// Datos de productos actualizados con instrumentos llaneros
const products = [
    { id: 1, name: "Arpa Llanera Profesional", price: "$2,500,000", image: "https://placehold.co/300x300/png" },
    { id: 2, name: "Cuatro Venezolano", price: "$800,000", image: "https://placehold.co/300x300/png" },
    { id: 3, name: "Maracas Artesanales", price: "$150,000", image: "https://placehold.co/300x300/png" },
    { id: 4, name: "Bandola Llanera", price: "$1,200,000", image: "https://placehold.co/300x300/png" },
    { id: 5, name: "Capachos Tradicionales", price: "$180,000", image: "https://placehold.co/300x300/png" },
    { id: 6, name: "Furruco Artesanal", price: "$450,000", image: "https://placehold.co/300x300/png" },
    { id: 7, name: "Tambora Llanera", price: "$350,000", image: "https://placehold.co/300x300/png" },
    { id: 8, name: "Charrasca de Metal", price: "$120,000", image: "https://placehold.co/300x300/png" },
    { id: 9, name: "Guitarra Criolla", price: "$900,000", image: "https://placehold.co/300x300/png" },
    { id: 10, name: "Bajo Quinto Tradicional", price: "$1,800,000", image: "https://placehold.co/300x300/png" },
    { id: 11, name: "Requinto Llanero", price: "$750,000", image: "https://placehold.co/300x300/png" },
    { id: 12, name: "Cajón Peruano", price: "$280,000", image: "https://placehold.co/300x300/png" },
    { id: 13, name: "Güiro Profesional", price: "$95,000", image: "https://placehold.co/300x300/png" },
    { id: 14, name: "Tiple Colombiano", price: "$650,000", image: "https://placehold.co/300x300/png" },
    { id: 15, name: "Mandolina Artesanal", price: "$950,000", image: "https://placehold.co/300x300/png" }
];

const defaultAvatarUrl = 'https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg';

// Variables globales
let selectedProductId = null;
let selectedProductName = "";
let selectedRating = 0;
let reviews = []; // Inicializar vacío, se cargará desde la BD
let editingReviewId = null; // Mantenemos esto para el modo edición
const MIN_CHARS = 100; // Minimum number of characters for the comment

// --- NUEVA FUNCIÓN para cargar reseñas desde la BD ---
function loadReviewsFromDatabase() {
    fetch('../php/cargar_resenas.php', { cache: 'no-store' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                reviews = data.reviews; // Actualizar el array local
                console.log('Reseñas cargadas desde BD:', reviews);
                renderReviews(); // Volver a renderizar la lista
            } else {
                console.error('Error al cargar reseñas desde BD:', data.message);
                reviews = []; // Asegurarse de vaciar si hay error
                renderReviews();
            }
        })
        .catch(error => {
            console.error('Error en fetch al cargar reseñas:', error);
            reviews = [];
            renderReviews();
        });
}

// Renderizar lista de productos
function renderProductList() {
    const productList = document.getElementById('product-list');
    if (!productList) { 
        // Si no existe, no hacer nada o dar aviso de debug
        console.warn("Elemento #product-list no encontrado");
        return;
    }
    productList.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('li');
        productElement.className = 'product-item';
        productElement.dataset.id = product.id;

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-item-image">
            <div class="product-item-name">${product.name}</div>
            <div class="product-item-price">${product.price}</div>
        `;

        productList.appendChild(productElement);
    });
}

// Renderizar reseñas
function renderReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) {
        console.error('Contenedor de reseñas no encontrado');
        return;
    }
    reviewsContainer.innerHTML = ''; // Limpiar antes de renderizar

    if (!reviews || reviews.length === 0) {
        reviewsContainer.innerHTML = '<p style="text-align: center; color: var(--dark);">Aún no hay reseñas. ¡Sé el primero!</p>';
        return;
    }

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review';
        reviewElement.dataset.id = review.id; // Usar el ID de la BD (cod_res)

        const starsHTML = generateStarsHTML(review.rating);
        const userBadge = review.isCurrentUser ? '<span class="user-badge">Tú</span>' : '';
        const productInfo = review.productName ? `<div class="review-product">Producto: ${review.productName}</div>` : '';

        // Crear botones solo si isCurrentUser es true
        let actionButtonsHTML = '';
        if (review.isCurrentUser) {
            actionButtonsHTML = `
                <div class="review-actions">
                    <button class="review-action-button edit-review">
                        <i class='bx bx-edit-alt'></i>
                        <span>Editar</span>
                    </button>
                    <button class="review-action-button delete-review">
                        <i class='bx bx-trash'></i>
                        <span>Eliminar</span>
                    </button>
                </div>
            `;
        }

        reviewElement.innerHTML = `
            <div class="review-header">
                <img src="${review.userAvatar || defaultAvatarUrl}" alt="${review.userName}" class="user-avatar">
                <div class="review-user-info">
                    <div class="review-user-name">${review.userName} ${userBadge}</div>
                    <div class="review-meta">
                        ${productInfo}
                        <div class="review-date">${review.date || 'Fecha desconocida'}</div>
                    </div>
                    <div class="review-rating">
                        ${starsHTML}
                    </div>
                </div>
            </div>
            <div class="review-content">${review.content}</div>
            ${actionButtonsHTML}
        `;

        reviewsContainer.appendChild(reviewElement);

        // --- Adjuntar listeners directamente después de añadir el elemento ---
        if (review.isCurrentUser) {
            const editButton = reviewElement.querySelector('.edit-review');
            const deleteButton = reviewElement.querySelector('.delete-review');

            if (editButton) {
                editButton.addEventListener('click', handleEditReview);
            }
            if (deleteButton) {
                deleteButton.addEventListener('click', handleDeleteReview);
            }
        }
    });

    // Ya no necesitamos llamar a attachReviewActionListeners aquí
    // attachReviewActionListeners();
}

// Generar HTML para estrellas
function generateStarsHTML(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += `<span class="star ${i <= rating ? 'active' : ''}" data-value="${i}">★</span>`;
    }
    return html;
}

// Configurar event listeners
function setupEventListeners() {
    const productButton = document.getElementById('product-button');
    const productDropdown = document.getElementById('product-dropdown');

    if (productButton && productDropdown) {
        productButton.addEventListener('click', function (e) {
            e.stopPropagation();
            productDropdown.classList.toggle('active');
        });

        document.addEventListener('click', function (e) {
            if (!productDropdown.contains(e.target) && e.target !== productButton) {
                productDropdown.classList.remove('active');
            }
        });
    }

    const productList = document.getElementById('product-list');
    if (productList) {
        productList.addEventListener('click', function (e) {
            const productItem = e.target.closest('.product-item');
            if (productItem) {
                const productId = parseInt(productItem.dataset.id);
                selectProduct(productId);
                productDropdown.classList.remove('active');
            }
        });
    }

    const stars = document.querySelectorAll('#rating-stars .star');
    stars.forEach(star => {
        star.addEventListener('click', function () {
            const value = parseInt(this.dataset.value);
            selectRating(value);
        });

        star.addEventListener('mouseover', function () {
            const value = parseInt(this.dataset.value);
            highlightStars(value);
        });
    });

    const ratingStars = document.getElementById('rating-stars');
    if (ratingStars) {
        ratingStars.addEventListener('mouseout', function () {
            highlightStars(selectedRating);
        });
    }

    const reviewText = document.getElementById('review-text');
    const charCounter = document.getElementById('char-counter');
    if (reviewText && charCounter) {
        reviewText.addEventListener('input', function () {
            const length = this.value.length;
            charCounter.textContent = `${length}/${MIN_CHARS}`;

            if (length < MIN_CHARS) {
                charCounter.className = length >= MIN_CHARS * 0.7 ? 'char-counter warning' : 'char-counter error';
            } else {
                charCounter.className = 'char-counter';
            }

            validateForm();
        });
    }

    const postButton = document.getElementById('post-button');
    if (postButton) {
        postButton.addEventListener('click', submitReview);
    }

    const cancelEditButton = document.getElementById('cancel-edit');
    if (cancelEditButton) {
        cancelEditButton.addEventListener('click', cancelEdit);
    }
}

// Funciones para seleccionar producto, calificación, validar y enviar reseñas
function selectProduct(productId) {
    selectedProductId = productId;
    const product = products.find(p => p.id === productId);
    selectedProductName = product.name;
    document.getElementById('selected-product-text').textContent = product.name;
    document.querySelectorAll('.product-item').forEach(item => {
        item.classList.remove('selected');
        if (parseInt(item.dataset.id) === productId) {
            item.classList.add('selected');
        }
    });
    validateForm();
}

function selectRating(rating) {
    selectedRating = rating;
    highlightStars(rating);
    validateForm();
}

function highlightStars(count) {
    document.querySelectorAll('#rating-stars .star').forEach(star => {
        const value = parseInt(star.dataset.value);
        if (value <= count) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function validateForm() {
    const submitButton = document.getElementById('post-button');
    const errorMessage = document.getElementById('error-message');
    const reviewText = document.getElementById('review-text').value.trim();
    const isTextValid = reviewText.length >= MIN_CHARS;
    const isRatingValid = selectedRating > 0;
    const isValid = isTextValid && isRatingValid;
    submitButton.disabled = !isValid;
    if (!isValid) {
        let errorMsg = [];
        if (!isTextValid) errorMsg.push(`Debes escribir al menos ${MIN_CHARS} caracteres`);
        if (!isRatingValid) errorMsg.push("Debes seleccionar una calificación");
        errorMessage.textContent = errorMsg.join(" y ");
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
    }
}

function submitReview() {
    const reviewText = document.getElementById('review-text').value.trim();
    if (reviewText.length < MIN_CHARS || selectedRating === 0) {
        document.getElementById('error-message').style.display = 'block';
        return;
    }

    const reviewData = {
        productId: selectedProductId,
        rating: selectedRating,
        content: reviewText,
        editingReviewId: editingReviewId
    };

    console.log("Enviando reseña a BD:", reviewData);

    // Deshabilitar botón mientras se envía
    const postButton = document.getElementById('post-button');
    postButton.disabled = true;
    postButton.textContent = editingReviewId ? 'Actualizando...' : 'Publicando...';

    fetch('../php/guardar_resena.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor (guardar reseña):', data);
        if (data.status === 'success') {
            alert(data.message || (editingReviewId ? 'Reseña actualizada!' : 'Reseña publicada!'));
            exitEditMode(); // Limpia el formulario y sale del modo edición si aplica
            loadReviewsFromDatabase(); // Recargar reseñas desde la BD
        } else {
            alert('Error al guardar la reseña: ' + data.message);
            postButton.disabled = false; // Rehabilitar botón en caso de error
            postButton.textContent = editingReviewId ? 'Actualizar' : 'Publicar';
        }
    })
    .catch((error) => {
        console.error('Error en fetch al guardar reseña:', error);
        alert('Ocurrió un error de red al guardar la reseña.');
        postButton.disabled = false; // Rehabilitar botón
        postButton.textContent = editingReviewId ? 'Actualizar' : 'Publicar';
    });
}

function handleEditReview(event) {
    const reviewElement = event.target.closest('.review');
    const reviewId = reviewElement.dataset.id; // Ahora es el cod_res (string)
    const review = reviews.find(r => r.id === reviewId);

    if (review && review.isCurrentUser) {
        enterEditMode(review);
    } else {
        console.warn('No se encontró la reseña para editar o no pertenece al usuario', reviewId);
    }
}

function enterEditMode(review) {
    editingReviewId = review.id;
    document.getElementById('review-text').value = review.content;
    const charCounter = document.getElementById('char-counter');
    charCounter.textContent = `${review.content.length}/${MIN_CHARS}`;
    charCounter.className = 'char-counter';
    if (review.productId) {
        selectProduct(review.productId);
    } else {
        selectedProductId = null;
        selectedProductName = "";
        document.getElementById('selected-product-text').textContent = "Producto (opcional)";
    }
    selectRating(review.rating);
    document.getElementById('comment-area').classList.add('edit-mode');
    document.getElementById('post-button').textContent = 'Actualizar';
    document.getElementById('cancel-edit').style.display = 'inline-block';
    document.getElementById('comment-area').scrollIntoView({ behavior: 'smooth' });
    validateForm(); // Validar estado inicial del formulario de edición
}

function exitEditMode() {
    editingReviewId = null;
    document.getElementById('comment-area').classList.remove('edit-mode');
    document.getElementById('post-button').textContent = 'Publicar';
    document.getElementById('cancel-edit').style.display = 'none';
    resetForm();
}

function cancelEdit() {
    exitEditMode();
}

function resetForm() {
    document.getElementById('review-text').value = '';
    document.getElementById('selected-product-text').textContent = 'Producto (opcional)';
    const charCounter = document.getElementById('char-counter');
    charCounter.textContent = `0/${MIN_CHARS}`;
    charCounter.className = 'char-counter error';
    selectedProductId = null;
    selectedProductName = '';
    selectRating(0);
    validateForm();
}

function handleDeleteReview(event) {
    const reviewElement = event.target.closest('.review');
    const reviewId = reviewElement.dataset.id; // cod_res
    const review = reviews.find(r => r.id === reviewId);

    if (review && review.isCurrentUser) {
        if (confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
            console.log("Eliminando reseña con ID:", reviewId);

            fetch(`../php/guardar_resena.php?id=${reviewId}`, { // Enviar ID en la URL para DELETE
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta del servidor (eliminar reseña):', data);
                if (data.status === 'success') {
                    alert(data.message || 'Reseña eliminada.');
                    if (editingReviewId === reviewId) {
                        exitEditMode(); // Salir del modo edición si se eliminó la reseña actual
                    }
                    loadReviewsFromDatabase(); // Recargar reseñas desde la BD
                } else {
                    alert('Error al eliminar la reseña: ' + data.message);
                }
            })
            .catch((error) => {
                console.error('Error en fetch al eliminar reseña:', error);
                alert('Ocurrió un error de red al eliminar la reseña.');
            });
        }
    }
}

// Agregar función de inicialización
function initReviews() {
    const reviewsSection = document.querySelector('.reviews-section');
    if (!reviewsSection) {
        console.warn("La sección de reseñas no está presente en el DOM actual.");
        return; // Salir si no estamos en la página de reseñas
    }

    // Verificar si los elementos esenciales del formulario existen
    const reviewText = document.getElementById('review-text');
    const productButton = document.getElementById('product-button');
    const ratingStars = document.getElementById('rating-stars');
    const postButton = document.getElementById('post-button');

    if (!reviewText || !productButton || !ratingStars || !postButton) {
        console.error('Faltan elementos esenciales del formulario de reseñas.');
        // Podríamos ocultar el formulario o mostrar un mensaje
        return;
    }

    console.log("Inicializando sistema de reseñas...");
    // Inicializar estado
    selectedProductId = null;
    selectedProductName = "";
    selectedRating = 0;
    editingReviewId = null;

    renderProductList(); // Renderizar lista de productos en el dropdown
    setupEventListeners(); // Configurar listeners del formulario
    resetForm(); // Resetear el estado inicial del formulario
    loadReviewsFromDatabase(); // Cargar reseñas existentes desde la BD
}

// Hacer la función disponible globalmente
window.initReviews = initReviews;
