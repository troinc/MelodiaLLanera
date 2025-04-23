<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro - Melodía Llanera</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="Tienda_llanera/css/styles.css">
    <style>
        .register-container {
            max-width: 500px;
            margin: 100px auto 40px;
            padding: 2.5rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.3s ease;
        }

        .register-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .register-header h2 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: var(--text-color);
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-color);
            font-weight: 500;
        }

        .form-group input {
            width: 100%;
            padding: 1.2rem;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            font-size: 1rem;
            background-color: rgba(255, 255, 255, 0.05);
            color: var(--text-color);
            transition: all 0.3s ease;
        }

        .form-group input:focus {
            outline: none;
            border-color: var(--primary-color);
        }

        .register-button {
            width: auto;
            padding: 0.8rem 1.5rem;
            background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            margin-top: 1rem;
        }

        .register-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(var(--primary-color-rgb), 0.3);
        }

        .register-footer {
            text-align: center;
            margin-top: 1.5rem;
        }

        .register-footer a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
        }

        .register-footer a:hover {
            color: var(--accent-color);
        }

        .terms {
            font-size: 0.9rem;
            color: var(--text-color);
            text-align: center;
            margin-top: 1.5rem; // se aumentó de 1rem a 1.5rem para mayor separación
        }

        .terms a {
            color: var(--primary-color);
            text-decoration: none;
        }

        .terms a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="nav-container">
            <div class="logo-container">
                <h1>Melodía Llanera</h1>
            </div>
            <div class="nav-links">
                <a href="http://localhost/InstrumentosLLaneros/index.php">Inicio</a>
                <a href="http://localhost/InstrumentosLLaneros/Tienda_llanera/html/products.html">Productos</a>
                <a href="http://localhost/InstrumentosLLaneros/Tienda_llanera/html/about.html">Nosotros</a>
                <a href="http://localhost/InstrumentosLLaneros/Tienda_llanera/html/contact.html">Contacto</a>
            </div>
            <div class="nav-actions">
                <a href="http://localhost/InstrumentosLLaneros/Tienda_llanera/html/login.html" class="auth-link">Ingresar</a>
            </div>
        </nav>
    </header>

    <main>
        <div class="register-container">
            <!-- Contenedor para mensajes de error -->
            <!-- Se elimina el div de mensajes ya que el feedback se dará con alert() -->
            <div class="register-header">
                <h2>Crear Cuenta</h2>
                <p>Únete a la comunidad de Melodía Llanera</p>
            </div>
            <!-- Se utiliza envío tradicional del formulario -->
            <form action="process_form.php" method="POST" class="register-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="nom_cli">Nombre</label>
                        <input type="text" id="nom_cli" name="nom_cli" required>
                    </div>
                    <div class="form-group">
                        <label for="ape_cli">Apellido</label>
                        <input type="text" id="ape_cli" name="ape_cli" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="email_cli">Correo Electrónico</label>
                    <input type="email" id="email_cli" name="email_cli" required placeholder="ejemplo@correo.com" title="Ingrese un correo válido" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$">
                </div>
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <div style="position: relative;">
                        <input type="password" id="password" name="password" required minlength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y un número">
                        <i class="fa fa-eye" id="togglePassword" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); cursor: pointer;"></i>
                    </div>
                </div>
                <!-- Botón de envío normal -->
                <div style="text-align: center;">
                    <button type="submit" class="register-button">Crear Cuenta</button>
                </div>
            </form>
                <p class="terms">
                    Al registrarte, aceptas nuestros <a href="#">Términos y Condiciones</a> y nuestra <a href="#">Política de Privacidad</a>
                </p>
                <div class="register-footer">
                    <p>¿Ya tienes una cuenta? <a href="http://localhost/InstrumentosLLaneros/Tienda_llanera/html/login.html">Inicia Sesión</a></p>
                </div>
        </div>
    </main>

    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>Melodía Llanera</h3>
                <p>Tu tienda de instrumentos llaneros en Colombia</p>
            </div>
            <div class="footer-section">
                <h3>Enlaces Rápidos</h3>
                <a href="products.html">Productos</a>
                <a href="about.html">Sobre Nosotros</a>
                <a href="contact.html">Contacto</a>
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

    <script src="Tienda_llanera/html/js/app.js"></script>
    <script src="Tienda_llanera/html/js/auth.js"></script>
    <script>
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('fa-eye-slash');
        });
    </script>
</body>
</html>