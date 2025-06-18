<!DOCTYPE html>
<html lang="en">
<head>
<?php session_start(); ?>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<!-- Boxicons: Corregir el enlace a CSS -->
	<link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">

	<!-- My CSS -->
	<link rel="stylesheet" href="layouts.css">

	<title>Melodía Llanera - Panel de Control</title>

    <!-- Agregar Cropper.js -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js"></script>
</head>
<body>
    <!-- Agregar modal de confirmación de logout -->
    <div id="logoutModal" class="modal">
        <div class="modal-content">
            <h2>Cerrar Sesión</h2>
            <p>¿Estás seguro que quieres cerrar sesión?</p>
            <div class="modal-buttons">
                <button id="confirmLogout">Sí</button>
                <button id="cancelLogout">No</button>
            </div>
        </div>
    </div>

	<!-- SIDEBAR -->
	<section id="sidebar">
<a href="#" class="brand">
    <i class='bx bx-music bx-md'></i>
    <span class="text">Melodía Llanera</span>
</a>
		<ul class="side-menu top">
			<li class="active">
				<a href="#">
					<i class='bx bxs-dashboard bx-sm' ></i>
					<!-- El texto "Productos" coincide con la clave en menuContent -->
					<span class="text">Productos</span>
				</a>
			</li>
			<li>
				<a href="#">
					<i class='bx bxs-guitar-amp bx-sm' ></i>
					<span class="text">Categorias</span>
				</a>
			</li>
			<li>
				<a href="#" title="Compras">
					<i class='bx bxs-cart bx-sm' ></i>
					<span class="text">Compras</span>
				</a>
			</li>
			<li>
				<a href="#">
					<i class='bx bxs-user-account bx-sm' ></i>
					<span class="text">Reseñas</span>
				</a>
			</li>
			<!-- Nuevo ítem perfil -->
			<li>
				<a href="#">
					<i class='bx bxs-user bx-sm'></i>
					<span class="text">Perfil</span>
				</a>
			</li>
		</ul>
		<ul class="side-menu bottom">
			<li class="settings-item">
				<a href="#" id="settingsButton">
					<i class='bx bxs-cog bx-sm bx-spin-hover'></i>
					<span class="text">Settings</span>
				</a>
				<div class="settings-menu">
					<ul>
						<li><a href="#"><i class='bx bxs-file'></i> Terms</a></li>
						<li><a href="#"><i class='bx bxs-lock-alt'></i> Privacy</a></li>
						<li class="theme-toggle">
							<a href="#"><i class='bx bxs-moon'></i> Dark Mode</a>
						</li>
					</ul>
				</div>
			</li>
		</ul>
		<!-- Admin Link moved outside the bottom menu list for absolute positioning -->
		<ul class="side-menu admin-menu-container">
			<li class="admin-link-item" style="display: none;"> <!-- Oculto por defecto -->
				<a href="../admin-mode/" target="_blank" class="admin-link" id="adminLink">
					<i class='bx bxs-shield-quarter bx-sm'></i>
					<span class="text">Admin Panel</span>
				</a>
			</li>
		</ul>
	<?php if(isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin'): ?>
<a href="http://localhost:3001/" class="admin-panel-btn">
    <i class='bx bx-shield-quarter'></i>
    <span class="text">Panel Admin</span>
</a>
<?php endif; ?>
</section>
	<!-- SIDEBAR -->



	<!-- CONTENT -->
	<section id="content">
		<!-- NAVBAR -->
<nav>
	<div class="nav-left">
		<i class='bx bx-menu bx-sm'></i>
	</div>
	<div class="nav-center">
		<form action="#">
			<div class="form-input">
				<input type="search" placeholder="Search...">
				<button type="submit" class="search-btn">
					<i class='bx bx-search'></i>
					<span class="sr-only">Buscar</span>
				</button>
			</div>
		</form>
	</div>
	<div class="nav-right">
		<a href="#" class="profile" id="profileIcon">
			<img src="https://placehold.co/600x400/png" alt="Profile">
		</a>
		<div class="profile-menu" id="profileMenu">
			<ul>
				<li><a href="#"><i class='bx bxs-user'></i> Mi Perfil</a></li>
				<li><a href="#" id="headerSettingsButton"><i class='bx bxs-cog'></i> Configuración</a></li>
				<!-- Agregar id "logoutButton" para el enlace de cerrar sesión -->
				<li><a href="#" id="logoutButton"><i class='bx bxs-log-out'></i> Cerrar Sesión</a></li>
			</ul>
		</div>
	</div>
</nav>
<!-- NAVBAR -->


		<!-- MAIN -->
		<main>
            <div class="head-title">
                <div class="left">
                    <h1>Nuestros Instrumentos</h1>
                    <ul class="breadcrumb">
                        <li>
                            <a href="#">Catálogo</a>
                        </li>
                        <li><i class='bx bx-chevron-right' ></i></li>
                        <li>
                            <a class="active" href="#">Productos</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="product-grid" id="product-grid-main">
                <?php 
                // Incluir el script para cargar productos
                // Este script debería estar en una ubicación accesible y devolver JSON
                // Por simplicidad, asumiremos que tenemos una función o incluimos un archivo que nos da los productos
                // En un caso real, harías una solicitud a `cargar_productos.php` o similar
                // y luego iterarías sobre los resultados.

                // Simulación de carga de productos (reemplazar con lógica real de BD)
                // include __DIR__ . '/../php/cargar_productos_para_home.php'; 
                // $productos = cargarProductosParaHome(); // Suponiendo que esta función existe y devuelve un array

                // Dado que cargar_productos.php ya existe y devuelve JSON, 
                // sería mejor que script.js maneje la carga vía AJAX para la sección principal también,
                // o pasar los datos de PHP a JS. 
                // Por ahora, dejaremos un placeholder y lo llenaremos con JS.
                ?>
                <!-- Los productos se cargarán aquí dinámicamente por JavaScript -->
            </div>
            <!-- Sección de reseñas y carrito eliminada del contenido inicial -->
        </main>

        <!-- Modal de Configuración -->
        <div id="settingsModal" class="modal">
            <div class="modal-content">
                <span class="close-button" id="closeSettingsModal">&times;</span>
                <h2>Configuración del Sitio Web</h2>
                <ul class="settings-list">
                    <li>
                        <button id="toggleTheme" class="settings-button">
                            <i class='bx bxs-palette'></i>
                            <span>Tono del Sitio Web</span>
                        </button>
                    </li>
                    <li>
                        <button id="paymentMethods" class="settings-button">
                            <i class='bx bxs-credit-card'></i>
                            <span>Métodos de Pago</span>
                        </button>
                    </li>
                    <li>
                        <a href="./documentos/terminos.html" class="settings-button">
                            <i class='bx bxs-file'></i>
                            <span>Términos y Condiciones</span>
                        </a>
                    </li>
                    <li>
                        <a href="./documentos/privacidad.html" class="settings-button">
                            <i class='bx bxs-lock-alt'></i>
                            <span>Política de Privacidad</span>
                        </a>
                    </li>
                    <li>
                        <button id="deleteAccount" class="settings-button delete-button">
                            <i class='bx bxs-trash'></i>
                            <span>Eliminar Cuenta</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
		<!-- MAIN -->
	<?php if(isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin'): ?>
<a href="http://localhost:3001/" class="admin-panel-btn">
    <i class='bx bx-shield-quarter'></i>
    <span class="text">Panel Admin</span>
</a>
<?php endif; ?>
</section>
	<!-- CONTENT -->
	

	<script src="script.js"></script>
    <!-- Incluir resenas.js -->
    <script src="resenas.js"></script>

    <!-- Modificar estilos del modal antes de cerrar el body -->
    <style>
    .cart-section {
        padding: 20px;
    }

    .cart-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }

    .cart-item {
        background: #f5f5f5;
        border-radius: 10px;
        padding: 15px;
        text-align: center;
    }

    .cart-item img {
        width: 100%;
        max-width: 200px;
        height: auto;
        border-radius: 8px;
    }

    .cart-summary {
        margin-top: 30px;
        text-align: right;
        padding: 20px;
        background: #f5f5f5;
        border-radius: 10px;
    }

    .remove-from-cart {
        background: #ff4444;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
    }

    .remove-from-cart:hover {
        background: #cc0000;
    }

      .modal {
          display: none;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          /* Sin blur para fondo */
      }
      .modal-content {
          background: #3a3a3a; /* Fondo gris oscuro */
          margin: 20% auto;
          padding: 20px;
          border: 1px solid #555;
          width: 300px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          text-align: center;
          color: #fff; /* Texto blanco */
      }
      .modal-content p {
          margin-bottom: 20px; /* Separar el texto de los botones */
      }
      .modal-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
      }
      .modal-buttons button {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
      }
      #confirmLogout {
          background: #ff9966; /* Botón 'Sí' en color #ff9966 */
          color: white;
      }
      #cancelLogout {
          background: #555;
          color: white;
          border: 1px solid #777;
      }
      .modal-buttons button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }

      .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
      }
    </style>
</body>
</html>
