<?php
// Habilitar la visualización de errores para depurar posibles problemas
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Melodía Llanera - Instrumentos Llaneros Colombianos</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./Tienda_llanera/css/styles.css">
    <style>
        /* Animación de hover para los recuadros de instrumentos destacados */
        .product-card:hover {
            border: 2px solid #ff9966;
            transform: scale(1.05);
            
            transition: all 0.3s ease;
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav-container">
    <div class="logo-container">
        <h1 class="logo-text">Melodía Llanera</h1>
    </div>
    <div class="nav-links">
        <a href="/InstrumentosLLaneros/index.php" class="active">Inicio</a>
        <a href="./Tienda_llanera/html/products.html">Productos</a>
        <a href="./Tienda_llanera/html/about.html">Nosotros</a>
        <a href="./Tienda_llanera/html/contact.html">Contacto</a>
    </div>
    <div class="nav-actions">
        <a href="./Tienda_llanera/html/login.html" class="auth-link">Login</a>
    </div>
</nav>
    </header>
    <main>
        <section class="hero-section" style="background-image: url('https://p4.wallpaperbetter.com/wallpaper/524/800/885/wooden-guitar-dark-background-guitar-hd-wallpaper-preview.jpg'); background-size: cover; background-position: center;">
            <div class="hero-content">
                <h2>Descubre la Magia de los Llanos</h2>
                <p>Instrumentos auténticos colombianos para los amantes de la música llanera</p>
                <a href="./Tienda_llanera/html/products.html" class="cta-button">Ver Instrumentos</a>
            </div>
        </section>
        <section class="featured-products">
            <h2>Productos Destacados</h2>
            <div class="product-grid">
                <div class="product-card">
                    <div class="product-image">
                        <img src="https://canaltrece.com.co/wp-content/uploads/2024/03/palabras-musica-llanera-1300x731.jpg" alt="Arpa Llanera">
                    </div>
                    <div class="product-info">
                        <h3>Arpa Llanera Profesional</h3>
                        <p class="price">COP 5,500,000</p>
                        <!-- Enlace modificado para utilizar ancla -->
                        <a href="./Tienda_llanera/html/products.html#arpa-lanera" class="details-button">Ver detalles</a>
                    </div>
                </div>
                <div class="product-card">
                    <div class="product-image">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK__VqjpwWJVg7cGmg5kVUxQCuBmc-5huX7Q&s" alt="Cuatro Llanero">
                    </div>
                    <div class="product-info">
                        <h3>Cuatro Llanero Artesanal</h3>
                        <p class="price">COP 1,200,000</p>
                        <a href="./Tienda_llanera/html/products.html#cuatro-llanero" class="details-button">Ver detalles</a>
                    </div>
                </div>
                <div class="product-card">
                    <div class="product-image">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUJiI4Gr593nTDxaFPhKaEzQV1ke7XdtEA_A&s" alt="Maracas Llaneras">
                    </div>
                    <div class="product-info">
                        <h3>Maracas Llaneras</h3>
                        <p class="price">COP 280,000</p>
                        <a href="./Tienda_llanera/html/products.html#maracas-llaneras" class="details-button">Ver detalles</a>
                    </div>
                </div>
            </div>
        </section>

        <section class="info-section" style="padding: 2rem; background-color: var(--light-bg); text-align: center;">
            <div class="about-content" style="margin-bottom: 5.5rem;"> <!-- aumento del margen inferior -->
                <h2>Sobre nosotros</h2>
                <p>Desde Villavicencio, Meta, traemos lo mejor de la tradición musical llanera colombiana a tus manos. Cada instrumento cuenta una historia de artesanía y pasión.</p>
                <a href="./Tienda_llanera/html/about.html" class="learn-more">Conoce más</a>
            </div>
            <div class="contact-info" style="margin-top: 1rem;"> <!-- agregado margen superior -->
                <h2>Contáctanos</h2>
                <p><i class="fas fa-map-marker-alt"></i> Villavicencio, Meta - Colombia</p>
                <p><i class="fas fa-phone"></i> +57 312 3813197</p>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>Melodía Llanera</h3>
                <p>Tu tienda de instrumentos llaneros en Colombia</p>
            </div>
            <div class="footer-section">
                <h3>Enlaces Rápidos</h3>
                <a href="./Tienda_llanera/html/products.html">Productos</a>
                <a href="./Tienda_llanera/html/about.html">Sobre Nosotros</a>
                <a href="./Tienda_llanera/html/contact.html">Contacto</a>
            </div>
            <div class="footer-section">
                <h3>Síguenos</h3>
                <div class="social-links">
                    <a href="#"><i class="fab fa-facebook"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 Melodía Llanera. Todos los derechos reservados.</p>
        </div>
    </footer>

    <script src="./Tienda_llanera/js/app.js"></script>
    <script src="./Tienda_llanera/js/cart.js"></script>
</body>
</html>
