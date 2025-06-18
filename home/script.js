// Menu items content
const menuContent = {
    'productos': {
        title: 'Productos',
        content: `
            <div class="head-title">
                <div class="left">
                    <h1>Nuestros Instrumentos</h1>
                    <ul class="breadcrumb">
                        <li><a href="#">Catálogo</a></li>
                        <li><i class='bx bx-chevron-right'></i></li>
                        <li><a class="active" href="#">Productos</a></li>
                    </ul>
                </div>
            </div>
            <div class="product-grid" id="product-grid-main">
                <!-- Los productos se cargarán aquí dinámicamente por JavaScript -->
            </div>
        `
    },
    'categorias': {
        title: 'Categorias',
        content: `
            <div class="head-title" style="margin-bottom: 3rem;">
                <div class="left">
                    <h1>Categorías de Instrumentos</h1>
                    <ul class="breadcrumb">
                        <li><a href="#">Catálogo</a></li>
                        <li><i class='bx bx-chevron-right'></i></li>
                        <li><a class="active" href="#">Categorías</a></li>
                    </ul>
                </div>
            </div>
            <div class="category-buttons" style="
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            ">
                <button class="category-btn active" data-category="todos" style="
                    padding: 0.8rem 1.5rem;
                    border: none;
                    border-radius: 25px;
                    background: var(--blue);
                    color: var(--light);
                    cursor: pointer;
                    font-weight: 500;
                    transition: opacity 0.3s ease;
                ">Todos</button>
                <button class="category-btn" data-category="cuerdas" style="
                    padding: 0.8rem 1.5rem;
                    border: none;
                    border-radius: 25px;
                    background: var(--grey);
                    color: var(--dark);
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                ">Cuerdas</button>
                <button class="category-btn" data-category="percusion" style="
                    padding: 0.8rem 1.5rem;
                    border: none;
                    border-radius: 25px;
                    background: var(--grey);
                    color: var (--dark);
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                ">Percusión</button>
                <button class="category-btn" data-category="viento" style="
                    padding: 0.8rem 1.5rem;
                    border: none;
                    border-radius: 25px;
                    background: var(--grey);
                    color: var(--dark);
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                ">Viento</button>
                <button class="category-btn" data-category="tradicionales" style="
                    padding: 0.8rem 1.5rem;
                    border: none;
                    border-radius: 25px;
                    background: var(--grey);
                    color: var(--dark);
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;
                ">Tradicionales</button>
            </div>
            <div class="instrument-details">
                <!-- INSTRUMENTOS DE CUERDA -->
                <div class="detail-card" data-category="cuerdas" data-id="1">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Arpa Llanera">
                    </div>
                    <div class="detail-info">
                        <h2>Arpa Llanera Profesional</h2>
                        <p class="price">$2,500,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>36 cuerdas de nylon</li>
                                <li>Madera de cedro seleccionada</li>
                                <li>Acabado artesanal premium</li>
                                <li>Altura: 1.45 metros</li>
                                <li>Incluye funda de transporte</li>
                            </ul>
                            <p>El arpa llanera es uno de los instrumentos más emblemáticos...</p>
                            <p class="stock">Stock disponible: <span>10</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="cuerdas" data-id="2">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Cuatro Llanero">
                    </div>
                    <div class="detail-info">
                        <h2>Cuatro Llanero</h2>
                        <p class="price">$800,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>4 cuerdas de nylon</li>
                                <li>Madera de caoba</li>
                                <li>Acabado artesanal</li>
                                <li>Incluye funda de transporte</li>
                            </ul>
                            <p>El cuatro llanero es un instrumento tradicional...</p>
                            <p class="stock">Stock disponible: <span>15</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="cuerdas" data-id="4">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Bandola">
                    </div>
                    <div class="detail-info">
                        <h2>Bandola Llanera</h2>
                        <p class="price">$1,200,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>8 cuerdas de nylon</li>
                                <li>Madera de pino</li>
                                <li>Acabado artesanal</li>
                                <li>Incluye funda de transporte</li>
                            </ul>
                            <p>La bandola llanera es un instrumento tradicional...</p>
                            <p class="stock">Stock disponible: <span>8</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="cuerdas" data-id="9">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Guitarra Criolla">
                    </div>
                    <div class="detail-info">
                        <h2>Guitarra Criolla</h2>
                        <p class="price">$900,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>6 cuerdas de nylon</li>
                                <li>Madera de caoba</li>
                                <li>Acabado artesanal</li>
                                <li>Incluye funda de transporte</li>
                            </ul>
                            <p>La guitarra criolla es un instrumento tradicional...</p>
                            <p class="stock">Stock disponible: <span>10</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="cuerdas" data-id="10">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Bajo Quinto">
                    </div>
                    <div class="detail-info">
                        <h2>Bajo Quinto Tradicional</h2>
                        <p class="price">$1,800,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>10 cuerdas de nylon</li>
                                <li>Madera de pino</li>
                                <li>Acabado artesanal</li>
                                <li>Incluye funda de transporte</li>
                            </ul>
                            <p>El bajo quinto es un instrumento tradicional...</p>
                            <p class="stock">Stock disponible: <span>6</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="cuerdas" data-id="11">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Requinto">
                    </div>
                    <div class="detail-info">
                        <h2>Requinto Llanero</h2>
                        <p class="price">$750,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>4 cuerdas de nylon</li>
                                <li>Madera de caoba</li>
                                <li>Acabado artesanal</li>
                                <li>Incluye funda de transporte</li>
                            </ul>
                            <p>El requinto llanero es un instrumento tradicional...</p>
                            <p class="stock">Stock disponible: <span>9</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="cuerdas" data-id="14">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Tiple">
                    </div>
                    <div class="detail-info">
                        <h2>Tiple Colombiano</h2>
                        <p class="price">$650,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>12 cuerdas (4 grupos de 3)</li>
                                <li>Madera de cedro</li>
                                <li>Acabado brillante</li>
                                <li>Incluye estuche</li>
                            </ul>
                            <p>El tiple es fundamental en la música andina colombiana...</p>
                            <p class="stock">Stock disponible: <span>7</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="cuerdas" data-id="15">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Mandolina">
                    </div>
                    <div class="detail-info">
                        <h2>Mandolina Artesanal</h2>
                        <p class="price">$950,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>8 cuerdas metálicas</li>
                                <li>Tapa de pino abeto</li>
                                <li>Aros y fondo de arce</li>
                                <li>Incrustaciones de nácar</li>
                            </ul>
                            <p>Ideal para música folclórica y clásica...</p>
                            <p class="stock">Stock disponible: <span>5</span> unidades</p>
                        </div>
                    </div>
                </div>
                <!-- INSTRUMENTOS DE PERCUSIÓN -->
                <div class="detail-card" data-category="percusion" data-id="3">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Maracas">
                    </div>
                    <div class="detail-info">
                        <h2>Maracas Artesanales</h2>
                        <p class="price">$150,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>Hechas a mano</li>
                                <li>Material: calabaza y madera</li>
                                <li>Sonido auténtico</li>
                            </ul>
                            <p>Las maracas son instrumentos de percusión...</p>
                            <p class="stock">Stock disponible: <span>20</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="percusion" data-id="5">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Capachos">
                    </div>
                    <div class="detail-info">
                        <h2>Capachos Tradicionales</h2>
                        <p class="price">$180,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>Hechos a mano</li>
                                <li>Material: madera y cuero</li>
                                <li>Sonido auténtico</li>
                            </ul>
                            <p>Los capachos son instrumentos de percusión...</p>
                            <p class="stock">Stock disponible: <span>12</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="percusion" data-id="6">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Furruco">
                    </div>
                    <div class="detail-info">
                        <h2>Furruco Artesanal</h2>
                        <p class="price">$450,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>Hecho a mano</li>
                                <li>Material: madera y cuero</li>
                                <li>Sonido auténtico</li>
                            </ul>
                            <p>El furruco es un instrumento de percusión...</p>
                            <p class="stock">Stock disponible: <span>5</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="percusion" data-id="7">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Tambora">
                    </div>
                    <div class="detail-info">
                        <h2>Tambora Llanera</h2>
                        <p class="price">$350,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>Hecha a mano</li>
                                <li>Material: madera y cuero</li>
                                <li>Sonido auténtico</li>
                            </ul>
                            <p>La tambora llanera es un instrumento de percusión...</p>
                            <p class="stock">Stock disponible: <span>7</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="percusion" data-id="8">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Charrasca">
                    </div>
                    <div class="detail-info">
                        <h2>Charrasca de Metal</h2>
                        <p class="price">$120,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>Hecha a mano</li>
                                <li>Material: metal</li>
                                <li>Sonido auténtico</li>
                            </ul>
                            <p>La charrasca es un instrumento de percusión...</p>
                            <p class="stock">Stock disponible: <span>18</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="percusion" data-id="12">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Cajón Peruano">
                    </div>
                    <div class="detail-info">
                        <h2>Cajón Peruano</h2>
                        <p class="price">$280,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>Hecho a mano</li>
                                <li>Material: madera</li>
                                <li>Sonido auténtico</li>
                            </ul>
                            <p>El cajón peruano es un instrumento de percusión...</p>
                            <p class="stock">Stock disponible: <span>14</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="percusion" data-id="13">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Güiro">
                    </div>
                    <div class="detail-info">
                        <h2>Güiro Profesional</h2>
                        <p class="price">$95,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>Fabricado en calabaza</li>
                                <li>Incluye raspador de madera</li>
                                <li>Sonido rítmico característico</li>
                                <li>Acabado natural</li>
                            </ul>
                            <p>Esencial en ritmos latinos como salsa y cumbia...</p>
                            <p class="stock">Stock disponible: <span>25</span> unidades</p>
                        </div>
                    </div>
                </div>
                <!-- INSTRUMENTOS DE VIENTO (Asumiendo IDs ficticios) -->
                <div class="detail-card" data-category="viento" data-id="16">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Flauta Llanera">
                    </div>
                    <div class="detail-info">
                        <h2>Flauta Llanera Tradicional</h2>
                        <p class="price">$350,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>Hecha a mano</li>
                                <li>Material: madera</li>
                                <li>Sonido auténtico</li>
                            </ul>
                            <p>La flauta llanera es un instrumento de viento...</p>
                            <p class="stock">Stock disponible: <span>11</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="viento" data-id="17">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Quena">
                    </div>
                    <div class="detail-info">
                        <h2>Quena Tradicional</h2>
                        <p class="price">$280,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>Material: Bambú selecto</li>
                                <li>7 agujeros frontales</li>
                                <li>1 agujero posterior</li>
                                <li>Longitud: 40 cm</li>
                                <li>Incluye funda protectora</li>
                            </ul>
                            <p>La quena es una flauta tradicional de los Andes...</p>
                            <p class="stock">Stock disponible: <span>8</span> unidades</p>
                        </div>
                    </div>
                </div>
                <!-- INSTRUMENTOS TRADICIONALES (Asumiendo IDs ficticios) -->
                <div class="detail-card" data-category="tradicionales" data-id="18">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Sistro">
                    </div>
                    <div class="detail-info">
                        <h2>Sistro del Llano</h2>
                        <p class="price">$90,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>Cascabeles de bronce</li>
                                <li>Mango de madera tallada</li>
                                <li>Diseño tradicional</li>
                                <li>Longitud: 25 cm</li>
                                <li>Sonido cristalino</li>
                            </ul>
                            <p>Instrumento de percusión tradicional del llano...</p>
                            <p class="stock">Stock disponible: <span>15</span> unidades</p>
                        </div>
                    </div>
                </div>
                <div class="detail-card" data-category="tradicionales" data-id="19">
                    <div class="detail-image">
                        <img src="/InstrumentosLLaneros/uploads/products/prod_1_6828b243d0daa_Imagen_de_WhatsApp_2025_01_27_a_las_14.03.49_635a3b45.jpg" alt="Quitiplas">
                    </div>
                    <div class="detail-info">
                        <h2>Quitiplas Tradicionales</h2>
                        <p class="price">$200,000</p>
                        <div class="description">
                            <h3>Características:</h3>
                            <ul>
                                <li>Set de 4 tubos de bambú</li>
                                <li>Diferentes tamaños y tonos</li>
                                <li>Acabado natural</li>
                                <li>Incluye soporte</li>
                                <li>Manual de ritmos básicos</li>
                            </ul>
                            <p>Instrumento de percusión formado por tubos de bambú...</p>
                            <p class="stock">Stock disponible: <span>10</span> unidades</p>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    'compras': {
        title: 'Compras',
        content: `
            <div class="head-title">
                <div class="left">
                    <h1>Tu Carrito de Compras</h1>
                    <ul class="breadcrumb">
                        <li><a href="#">Carrito</a></li>
                        <li><i class='bx bx-chevron-right'></i></li>
                        <li><a class="active" href="#">Pedidos</a></li>
                    </ul>
                </div>
            </div>
            <div class="cart-container">
                <div id="cart-items">
                    <!-- Los items del carrito se insertarán aquí dinámicamente -->
                </div>
                <div class="cart-summary">
                    <h3>Resumen del Pedido</h3>
                    <div class="summary-details">
                        <p>Subtotal: <span id="subtotal">$0</span></p>
                        <p>IVA (19%): <span id="tax">$0</span></p>
                        <p>Total: <span id="total">$0</span></p>
                    </div>
                    <button id="checkout-btn" class="checkout-button">Proceder al Pago</button>
                </div>
            </div>
        `
    },
    'reseñas': {
        title: 'Reseñas',
        content: `
            <div class="head-title">
                <div class="left">
                    <h1>Reseñas de Clientes</h1>
                    <ul class="breadcrumb">
                        <li><a href="#">Opiniones</a></li>
                        <li><i class='bx bx-chevron-right'></i></li>
                        <li><a class="active" href="#">Reseñas</a></li>
                    </ul>
                </div>
            </div>
            <div class="reviews-container">
                <div class="container">
                    <!-- Área de comentarios estilo Facebook -->
                    <div class="card">
                        <div class="comment-box">
                            <div class="default-avatar">
                                <i class='bx bxs-user'></i>
                            </div>
                            <div class="comment-input-area" id="comment-area">
                                <div class="char-counter" id="char-counter">0/100</div>
                                <textarea class="comment-input" id="review-text" placeholder="Escribe tu reseña (mínimo 100 caracteres)..."></textarea>
                                
                                <div class="comment-actions">
                                    <div class="action-buttons">
                                        <div class="product-selector">
                                            <button class="product-button" id="product-button">
                                                <span class="product-button-icon">📦</span>
                                                <span id="selected-product-text">Producto (opcional)</span>
                                            </button>
                                            
                                            <div class="product-dropdown" id="product-dropdown">
                                                <ul class="product-list" id="product-list">
                                                    <!-- Los productos se generarán dinámicamente -->
                                                </ul>
                                            </div>
                                        </div>
                                        
                                        <div class="star-rating" id="rating-stars">
                                            <span class="star" data-value="1">★</span>
                                            <span class="star" data-value="2">★</span>
                                            <span class="star" data-value="3">★</span>
                                            <span class="star" data-value="4">★</span>
                                            <span class="star" data-value="5">★</span>
                                        </div>
                                    </div>
                                    
                                    <div class="post-actions">
                                        <button class="cancel-edit-button" id="cancel-edit" style="display: none;">Cancelar</button>
                                        <button class="post-button" id="post-button" disabled>Publicar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="error-message" id="error-message" style="display: none;">
                            Debes escribir al menos 100 caracteres y seleccionar una calificación
                        </div>
                    </div>
                    
                    <!-- Sección de reseñas -->
                    <div class="card">
                        <div class="reviews-section" id="reviews-container">
                            <!-- Las reseñas se generarán dinámicamente -->
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    'perfil': {
        title: 'Perfil',
        content: `
            <div class="head-title" style="margin-bottom: 3rem;">
                <div class="left">
                    <h1 class="adaptive-title" style="
                        margin-bottom: 1rem;
                        color: var(--dark);
                    ">Mi Perfil</h1>
                    <ul class="breadcrumb">
                        <li><a href="#" style="color: white;">Cuenta</a></li>
                        <li><i class='bx bx-chevron-right' style="color: white;"></i></li>
                        <li><a class="active" href="#" style="color: #ff9966;">Perfil</a></li>
                    </ul>
                </div>
            </div>

            <!-- Banner y Avatar con nuevo diseño -->
            <div class="profile-banner" style="
                position: relative;
                background: linear-gradient(45deg,rgb(247, 176, 130),rgba(255, 141, 75, 0.97));
                height: 200px;
                border-radius: 15px;
                margin-bottom: 80px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            ">
                <div class="profile-avatar" style="
                    position: absolute;
                    bottom: -50px;
                    left: 40px;
                    width: 130px;
                    height: 130px;
                    border-radius: 50%;
                    border: 5px solid var(--light);
                    background: var(--grey);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    cursor: pointer;
                    overflow: hidden;
                ">
                    <input type="file" id="avatar-upload" style="display: none;" accept="image/*">
                    <label for="avatar-upload" style="
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                    ">
                        <i class='bx bxs-user' style="font-size: 50px; color: var(--dark);"></i>
                        <div class="hover-text" style="
                            position: absolute;
                            background: rgba(0,0,0,0.7);
                            color: #fff;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            opacity: 0;
                            transition: opacity 0.3s;
                        ">
                            <i class='bx bxs-camera'></i>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Contenedor Principal con nuevo esquema de colores -->
            <div style="max-width:1000px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
                
                <!-- Columna Izquierda -->
                <div class="profile-card adaptive-bg" style="
                    padding: 2rem;
                    border-radius: 15px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                ">
                 

                    <form id="perfilFormInline" class="perfil-form" style="
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                    ">
                        <div class="form-group" style="
                            width: 100%;
                            margin-bottom: 1.5rem;
                        ">
                            <label style="
                                text-align: left;
                                display: block;
                                margin-bottom: 0.5rem;
                                color: #fff;
                            ">Correo Electrónico</label>
                            <input type="email" required style="
                                width: 100%;
                                padding: 0.8rem;
                                border: 1px solid var(--grey);
                                border-radius: 8px;
                                background: var(--grey);
                                color: var(--dark);
                            " placeholder="Correo Registrado">
                        </div>

                        <div class="form-group" style="
                            width: 100%;
                            margin-bottom: 1.5rem;
                        ">
                            <label style="
                                text-align: left;
                                display: block;
                                margin-bottom: 0.5rem;
                                color: #fff;
                            ">Contraseña</label>
                            <input type="password" required style="
                                width: 100%;
                                padding: 0.8rem;
                                border: 1px solid var(--grey);
                                border-radius: 8px;
                                background: var(--grey);
                                color: var (--dark);
                            " placeholder="Contraseña">
                        </div>

                        <button type="submit" style="
                            width: 100%;
                            padding: 0.8rem;
                            background: var(--blue);
                            color: var(--light);
                            border: none;
                            border-radius: 8px;
                            font-size: 1rem;
                            font-weight: 500;
                            cursor: pointer;
                            margin-top: 1rem;
                        ">Guardar Cambios</button>
                    </form>
                </div>

                <!-- Columna Derecha -->
                <div style="display:grid; gap:1rem;">
                    <div class="doc-card adaptive-bg" style="
                        padding:2rem;
                        border-radius:15px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    ">
                        <h2 class="adaptive-title" style="margin-bottom:1.5rem; font-size:1.5rem;">Documentos</h2>
                        <div style="display:grid; gap:1rem;">
                            <!-- Enlaces actualizados -->
                            <a href="documentos/terminos.html" target="_blank" class="doc-link" style="
                                display:flex;
                                align-items:center;
                                padding:1rem;
                                background:var(--grey);
                                border-radius:8px;
                                text-decoration:none;
                                transition:all 0.3s ease;
                            ">
                                <i class='bx bxs-file-pdf' style="font-size:24px; margin-right:1rem; color:#ff9966;"></i>
                                <span class="doc-text">Términos y Condiciones</span>
                                <i class='bx bx-chevron-right' style="margin-left:auto;"></i>
                            </a>

                            <a href="documentos/privacidad.html" target="_blank" class="doc-link" style="
                                display:flex;
                                align-items:center;
                                padding:1rem;
                                background:#333;
                                border-radius:8px;
                                color:#fff;
                                text-decoration:none;
                                transition:all 0.3s ease;
                            ">
                                <i class='bx bxs-lock-alt' style="
                                    font-size:24px;
                                    color:#ff9966;
                                    margin-right:1rem;
                                "></i>
                                <span class="doc-text">Política de Privacidad</span>
                                <i class='bx bx-chevron-right' style="margin-left:auto;"></i>
                            </a>

                            <a href="documentos/condiciones.html" target="_blank" class="doc-link" style="
                                display:flex;
                                align-items:center;
                                padding:1rem;
                                background:#333;
                                border-radius:8px;
                                color:#fff;
                                text-decoration:none;
                                transition:all 0.3s ease;
                            ">
                                <i class='bx bxs-book-alt' style="
                                    font-size:24px;
                                    color:#ff9966;
                                    margin-right:1rem;
                                "></i>
                                <span class="doc-text">Condiciones de Uso</span>
                                <i class='bx bx-chevron-right' style="margin-left:auto;"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Editor de Imagen Modal -->
            <div id="imageEditorModal" class="modal" style="display:none;">
                <div class="modal-content">
                    <div class="editor-container">
                        <div class="crop-container">
                            <img id="imageToEdit" src="" alt="Preview">
                        </div>
                        <div class="editor-controls">
                            <input type="range" id="zoomSlider" min="1" max="3" step="0.1" value="1">
                            <button id="rotateLeft"><i class='bx bx-rotate-left'></i></button>
                            <button id="rotateRight"><i class='bx bx-rotate-right'></i></button>
                            <button id="saveImage">Guardar</button>
                            <button id="cancelEdit">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                /* Estilos adaptativos para modo claro/oscuro */
                .adaptive-title {
                    color: var(--dark) !important;
                }

                .adaptive-text {
                    color: var(--dark) !important;
                }

                body.dark .adaptive-text {
                    color: var(--light) !important;
                }

                /* Estilos específicos para los enlaces de documentos */
                .doc-link span {
                    color: #fff !important;
                    transition: color 0.3s ease;
                }

                body.dark .doc-link span {
                    color: var(--dark) !important;
                }

                /* Mantenemos el color del ícono sin cambios */
                .doc-link i {
                    color: #ff9966;
                }

                .adaptive-bg {
                    background: var(--light);
                }

                body.dark .adaptive-bg {
                    background: #2a2a2a;
                }

                .profile-avatar:hover .hover-text {
                    opacity: 1;
                }

                /* Input adaptativo */
                .form-group input {
                    background: var(--grey) !important;
                    color: var(--dark) !important;
                    border-color: var(--dark-grey) !important;
                }

                /* Documentos adaptativos */
                .doc-link {
                    background: var(--grey) !important;
                }

                .doc-link:hover {
                    background: var(--dark-grey) !important;
                }

                @media (max-width: 768px) {
                    #contenedor-principal {
                        grid-template-columns: 1fr;
                    }
                }

                /* Estilos del editor de imagen */
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-content {
                    background: var(--light);
                    padding: 2rem;
                    border-radius: 15px;
                    max-width: 90%;
                    width: 500px;
                }

                .crop-container {
                    width: 100%;
                    height: 300px;
                    overflow: hidden;
                    position: relative;
                    background: #333;
                    margin-bottom: 1rem;
                }

                .crop-container img {
                    max-width: 100%;
                    display: block;
                }

                .editor-controls {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                #zoomSlider {
                    flex: 1;
                }

                .editor-controls button {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 5px;
                    background: var(--blue);
                    color: white;
                    cursor: pointer;
                }

                /* Estilos adaptativos para los textos de documentos */
                .doc-text {
                    color: var(--light) !important;
                    transition: color 0.3s ease;
                }

                body.dark .doc-text {
                    color: var(--dark) !important;
                }
            </style>

            <script>
                document.getElementById('avatar-upload').addEventListener('change', function(e) {
                    if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        
                        reader.onload = function(e) {
                            // Mostrar editor
                            document.getElementById('imageToEdit').src = e.target.result;
                            document.getElementById('imageEditorModal').style.display = 'flex';
                            
                            // Inicializar Cropper.js
                            const image = document.getElementById('imageToEdit');
                            const cropper = new Cropper(image, {
                                aspectRatio: 1,
                                viewMode: 1,
                                guides: true,
                                autoCropArea: 1,
                            });

                            // Controles de zoom y rotación
                            document.getElementById('zoomSlider').addEventListener('input', function(e) {
                                cropper.zoomTo(e.target.value);
                            });

                            document.getElementById('rotateLeft').addEventListener('click', function() {
                                cropper.rotate(-90);
                            });

                            document.getElementById('rotateRight').addEventListener('click', function() {
                                cropper.rotate(90);
                            });

                            // Guardar imagen editada
                            document.getElementById('saveImage').addEventListener('click', function() {
                                const canvas = cropper.getCroppedCanvas({
                                    width: 300,
                                    height: 300
                                });

                                const avatar = document.querySelector('.profile-avatar');
                                avatar.innerHTML = \`
                                    <img src="\${canvas.toDataURL()}" style="width: 100%; height: 100%; object-fit: cover;">
                                    <label for="avatar-upload" class="hover-text">
                                        <i class='bx bxs-camera'></i>
                                    </label>
                                \`;

                                // Guardar en localStorage
                                localStorage.setItem('user_avatar', canvas.toDataURL());

                                // Cerrar modal
                                document.getElementById('imageEditorModal').style.display = 'none';
                                cropper.destroy();
                            });

                            // Cancelar edición
                            document.getElementById('cancelEdit').addEventListener('click', function() {
                                document.getElementById('imageEditorModal').style.display = 'none';
                                cropper.destroy();
                            });
                        };
                        
                        reader.readAsDataURL(file);
                    }
                });
            </script>
            <style>
                /* Solo estos estilos son necesarios para el cambio de color */
                .doc-text {
                    color: var(--light) !important;
                }

                body.dark .doc-text {
                    color: #000000 !important;
                }
            </style>
        `
    }
};

// Define API base URL (similar a admin-mode)
const API_BASE_URL = 'http://localhost/InstrumentosLLaneros'; // Asegurar que la base URL es correcta

// --- Funciones para cargar y mostrar productos ---

async function loadProducts() {
    console.log("Iniciando carga de productos para la página principal...");
    const productGrid = document.getElementById('product-grid-main');
    if (!productGrid) {
        console.error("Elemento #product-grid-main no encontrado.");
        return;
    }

    productGrid.innerHTML = '<p>Cargando productos...</p>'; // Mensaje de carga

    try {
        const response = await fetch(`${API_BASE_URL}/php/cargar_productos.php`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
        }
        const data = await response.json();

        if (data.status === 'success' && Array.isArray(data.productos)) {
            console.log("Productos recibidos de BD:", data.productos);
            let productsHTML = '';
            if (data.productos.length > 0) {
                data.productos.forEach(producto => {
                    // Asegurarse de que el estado sea 'activo' para mostrar
                    if (producto.estado === '1' || producto.estado === 1 || producto.estado === 'activo') {
                         // Formatear precio
                         const formattedPrice = parseFloat(producto.precio_prod).toLocaleString('es-CO', {
                             style: 'currency',
                             currency: 'COP', // O la moneda que uses
                             minimumFractionDigits: 0, // Ajusta si necesitas decimales
                             maximumFractionDigits: 0,
                         });

                        productsHTML += `
                            <div class="product-card" data-id="${producto.cod_prod}">
                                ${producto.imagen_prod ?
                                    `<div class="product-image-container"><img src="${producto.imagen_prod.startsWith('http') ? producto.imagen_prod : `${API_BASE_URL}/${producto.imagen_prod}`}" alt="${producto.nom_prod}"></div>` :
                                    `<div class="product-image-container placeholder"><span>300 x 300</span></div>`
                                }
                                <h3>${producto.nom_prod}</h3>
                                <p class="price">${formattedPrice}</p>
                                <p class="stock">Stock: <span>${producto.stock_prod}</span></p>
                                <button class="add-to-cart">Añadir al Carrito</button>
                            </div>
                        `;
                    }
                });
            } else {
                productsHTML = '<p>No hay productos disponibles en este momento.</p>';
            }
            productGrid.innerHTML = productsHTML;
            // Re-adjuntar listeners de "Añadir al Carrito" si es necesario,
            // aunque el listener global en el documento ya debería manejarlos.

        } else {
            throw new Error(data.message || 'Formato de respuesta inesperado al cargar productos.');
        }
    } catch (err) {
        console.error('Error al cargar productos para la página principal:', err);
        productGrid.innerHTML = `<p style="color: red;">Error al cargar productos: ${err instanceof Error ? err.message : String(err)}</p>`;
    }
}

// --- Fin Funciones para cargar y mostrar productos ---

// Get all menu items
const menuItems = document.querySelectorAll('.side-menu.top li a');
const mainContent = document.querySelector('main');

// Store initial dashboard content
menuContent['productos'].content = mainContent.innerHTML;

// Global variable for cart items
let cartItems = [];

// --- Funciones para interactuar con el backend del carrito ---

/**
 * Carga el carrito pendiente del usuario desde la base de datos.
 * Guarda el estado actual del carrito local en la base de datos.
 * Usa un debounce para evitar envíos demasiado frecuentes.
 */
const saveCartToDB = debounce(async () => {
    console.log('Intentando guardar carrito en BD...', cartItems);
    // Crear FormData para enviar como POST normal, ya que PHP espera $_POST['carrito']
    const formData = new FormData();
    formData.append('carrito', JSON.stringify(cartItems)); // Enviar el array como JSON string

    try {
        // Usar URL absoluta
        const response = await fetch('http://localhost/InstrumentosLLaneros/php/guardar_carrito.php', {
            method: 'POST',
            // No establecer Content-Type manualmente cuando se usa FormData, el navegador lo hace.
            // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // Incorrecto para FormData
            body: formData
        });

        if (!response.ok) {
            // Mejor manejo de errores
            const errorText = await response.text(); // Leer respuesta como texto para depurar
            console.error(`Error HTTP ${response.status} al guardar carrito. Respuesta: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Intentar parsear como JSON
        if (data.success) {
            console.log('Carrito guardado en BD exitosamente.');
        } else {
            console.error('Error reportado por el servidor al guardar carrito:', data.message || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error en fetch al guardar carrito:', error);
        // Si el error es por parseo JSON, puede que la respuesta no fuera JSON (ej. error PHP)
        if (error instanceof SyntaxError) {
            console.error("La respuesta del servidor no fue JSON válido. Verifica el script PHP 'guardar_carrito.php' en busca de errores.");
        }
    }
}, 1000); // Aumentar un poco el debounce a 1 segundo

// --- Función loadCartFromDB (ÚNICA DEFINICIÓN) ---
async function loadCartFromDB() {
    console.log("Iniciando carga de carrito desde BD...");
    try {
        // Usar URL absoluta y añadir credenciales para la sesión
        const response = await fetch('http://localhost/InstrumentosLLaneros/php/cargar_carrito.php', {
             method: 'GET', // GET es el default, pero explícito es mejor
             headers: {
                 'Accept': 'application/json'
             },
             credentials: 'include' // *** IMPORTANTE para enviar cookies de sesión ***
        });

        if (!response.ok) {
             const errorText = await response.text();
             console.error(`Error HTTP ${response.status} al cargar carrito. Respuesta: ${errorText}`);
             throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'success') {
            console.log("Carrito recibido de BD:", data.carrito);
            // Mapeo cuidadoso para asegurar tipos correctos
            cartItems = data.carrito.map(item => ({
                id: String(item.cod_prod), // Asegurar que ID sea string
                name: item.nombre,
                price: parseFloat(item.precio_unitario),
                quantity: parseInt(item.cantidad, 10), // Asegurar que cantidad sea entero
                stock: parseInt(item.stock_disponible, 10), // Asegurar que stock sea entero
                imagen_prod: item.imagen_prod, // Añadir la URL de la imagen
                // Añadir priceFormatted si no viene del backend
                priceFormatted: item.priceFormatted || '$' + parseFloat(item.precio_unitario).toLocaleString('es-CO')
            }));
            console.log("Carrito local actualizado:", cartItems);
        } else if (data.message === 'Usuario no autenticado') {
             console.log('Usuario no autenticado, carrito local permanecerá vacío.');
             cartItems = [];
        } else {
            console.error('Error reportado por el servidor al cargar carrito:', data.message || 'Error desconocido');
            cartItems = []; // Vaciar carrito si hay error
        }
    } catch (error) {
        console.error('Error en fetch al cargar carrito desde BD:', error);
        // Reemplazar showErrorModal con console.error o alert
        console.error('No se pudo cargar el carrito. Verifica tu conexión y si has iniciado sesión.');
        // alert('No se pudo cargar el carrito. Verifica tu conexión y si has iniciado sesión.');
        cartItems = []; // Asegurar carrito vacío en caso de error
    } finally {
         console.log("Actualizando UI del carrito...");
         updateCart(); // Actualizar la UI independientemente del resultado
    }
}

// --- Función Debounce (ÚNICA DEFINICIÓN) ---
/**
 * Función Debounce: Retrasa la ejecución de una función hasta que haya pasado
 * un cierto tiempo sin que se llame de nuevo. Incluye método .flush()
 */
function debounce(func, wait) {
    let timeout;
    function debounced(...args) {
        // Guardar contexto y argumentos
        const context = this; 
        const later = () => {
            timeout = null; // Limpiar timeout antes de ejecutar
            func.apply(context, args); // Ejecutar con contexto y args correctos
        };
        clearTimeout(timeout); // Limpiar timeout anterior
        timeout = setTimeout(later, wait); // Establecer nuevo timeout
    };
    // Añadir método flush manualmente a la instancia devuelta
    debounced.flush = () => {
        clearTimeout(timeout);
        // Ejecutar inmediatamente si hay una llamada pendiente
        if (timeout) { 
             func.apply(this, Array.from(arguments).slice(2)); // Ejecutar inmediatamente
             timeout = null;
        }
    };
    return debounced;
}

// Add click event listeners to menu items
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all items
        menuItems.forEach(i => i.parentElement.classList.remove('active'));
        
        // Add active class to clicked item
        item.parentElement.classList.add('active');
        
        // Get the content key from the menu text
        const menuText = item.querySelector('.text').textContent.toLowerCase();
        
        // Update main content if content exists for this menu item
        if (menuContent[menuText]) {
            mainContent.innerHTML = menuContent[menuText].content;

            // Si cambiamos a la página de productos, cargar los productos dinámicamente
            if (menuText === 'productos') {
                loadProducts();
            }
            
            // Si cambiamos a cualquier página que *no sea* el carrito, guardar el estado actual
            if (menuText !== 'compras') {
                 saveCartToDB();
            }
            
            // If we're on the compras page, initialize cart display
            if (menuText === 'compras') {
                updateCart();
                
                // Add event listener for checkout button
                const checkoutBtn = document.getElementById('checkout-btn');
                if (checkoutBtn) {
                    checkoutBtn.addEventListener('click', function() {
                        if (cartItems.length > 0) {
                            // Preparar datos para enviar al backend
                            const purchaseData = {
                                items: cartItems.map(item => ({
                                    id_prod: item.id,
                                    cantidad_com: item.quantity,
                                    // Asegurarse de enviar el precio numérico
                                    precio_com: item.price
                                }))
                            };

                            // Enviar datos al backend
                            fetch('php/guardar_compra.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(purchaseData),
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    alert('¡Gracias por su compra! Su pedido ha sido procesado.');
                                    cartItems = []; // Limpiar carrito local
                                    updateCart(); // Actualizar visualización
                                    saveCartToDB.flush(); // Forzar guardado inmediato del carrito vacío
                                } else {
                                    alert('Error al procesar la compra: ' + (data.message || 'Intente nuevamente.'));
                                    console.error('Error del backend al comprar:', data.error || data.message);
                                }
                            })
                            .catch(error => {
                                console.error('Error en la petición fetch al comprar:', error);
                                alert('Hubo un error de conexión al procesar su compra. Por favor, intente más tarde.');
                            });

                        } else {
                            alert('Su carrito está vacío. Por favor añada productos antes de proceder al pago.');
                        }
                    });
                }
            }
            
            // If we're on the perfil page, initialize profile form and fetch user data
            if (menuText === 'perfil') {
                // Fetch user data and populate the form
                fetch('../php/get_user_data.php', { credentials: 'include' }) // Asegúrate que la ruta sea correcta
                    .then(response => {
                        if (!response.ok) {
                            // Si no está autorizado (401) o hay otro error, no lanzar excepción aquí
                            // Simplemente no se llenará el campo o se mostrará un mensaje
                            console.warn(`Error fetching user data: ${response.status}`);
                            return null; // Devolver null para indicar que no se obtuvieron datos
                        }
                        return response.json();
                    })
                    .then(data => {
                        const emailInput = document.querySelector('#perfilFormInline input[type="email"]');
                        if (emailInput && data && data.status === 'success' && data.email) {
                            emailInput.value = data.email;
                            emailInput.readOnly = true; // Hacer el campo de solo lectura
                            emailInput.style.backgroundColor = 'var(--grey-disabled, #e9ecef)'; // Estilo visual para indicar que está deshabilitado
                            emailInput.style.cursor = 'not-allowed';
                        } else if (emailInput) {
                            emailInput.placeholder = "No se pudo cargar el correo";
                            emailInput.readOnly = true;
                             emailInput.style.backgroundColor = 'var(--grey-disabled, #e9ecef)';
                             emailInput.style.cursor = 'not-allowed';
                        }
                        if (data && data.status === 'error') {
                             console.error("Error from get_user_data.php:", data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Fetch error loading user data:', error);
                        const emailInput = document.querySelector('#perfilFormInline input[type="email"]');
                        if (emailInput) {
                             emailInput.placeholder = "Error al cargar correo";
                             emailInput.readOnly = true;
                             emailInput.style.backgroundColor = 'var(--grey-disabled, #e9ecef)';
                             emailInput.style.cursor = 'not-allowed';
                        }
                    });

                // Setup form submission (currently just an alert)
                const profileForm = document.getElementById('perfilFormInline'); // ID corregido
                if (profileForm) {
                    profileForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        // Aquí iría la lógica para actualizar la contraseña si se implementa
                        alert('Funcionalidad para guardar cambios (ej. contraseña) no implementada.');
                    });
                }

                // Setup avatar change functionality (if needed)
                const changePhotoBtn = document.querySelector('.change-photo'); // Este selector podría no existir
                if (changePhotoBtn) {
                    changePhotoBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        alert('Funcionalidad para cambiar foto se implementará próximamente.');
                    });
                }
            }
            
            // If we're on the categorias page, add 'Add to Cart' buttons functionality
            if (menuText === 'categorias') {
                const addToCartButtons = document.querySelectorAll('.detail-card .add-to-cart');
                if (addToCartButtons.length === 0) {
                    // Add the buttons if they don't exist
                    document.querySelectorAll('.detail-card .detail-info').forEach(info => {
                        if (!info.querySelector('.add-to-cart')) {
                            const button = document.createElement('button');
                            button.className = 'add-to-cart';
                            button.textContent = 'Añadir al Carrito';
                            button.style.backgroundColor = 'var(--blue)';
                            button.style.color = 'var(--light)';
                            button.style.border = 'none';
                            button.style.padding = '0.8rem 1.5rem';
                            button.style.borderRadius = '25px';
                            button.style.cursor = 'pointer';
                            button.style.fontWeight = '500';
                            button.style.marginTop = '20px';
                            info.appendChild(button);
                        }
                    });
                }
            }

            if (menuText === 'categorias') {
                const categoryBtns = document.querySelectorAll('.category-btn');
                const detailCards = document.querySelectorAll('.detail-card');
                
                categoryBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        // Remover clase active de todos los botones
                        categoryBtns.forEach(b => b.classList.remove('active'));
                        // Añadir clase active al botón clickeado
                        btn.classList.add('active');
                        
                        // Actualizar estilos del botón activo
                        categoryBtns.forEach(b => {
                            if (b.classList.contains('active')) {
                                b.style.background = 'var(--blue)';
                                b.style.color = 'var(--light)';
                            } else {
                                b.style.background = 'var(--grey)';
                                b.style.color = 'var(--dark)';
                            }
                        });

                        const selected = btn.dataset.category;
                        
                        detailCards.forEach(card => {
                            if (selected === 'todos' || card.dataset.category === selected) {
                                card.style.display = 'flex';
                            } else {
                                card.style.display = 'none';
                            }
                        });
                    });
                });
            }

            if (menuText === 'productos') {
                document.body.setAttribute('data-page', 'productos');
                const searchInput = document.querySelector('#content nav form input');
                const productCards = document.querySelectorAll('.product-card');
                
                searchInput.addEventListener('input', function(e) {
                    const searchTerm = e.target.value.toLowerCase();
                    
                    productCards.forEach(card => {
                        const title = card.querySelector('h3').textContent.toLowerCase();
                        if (title.includes(searchTerm)) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            } else {
                document.body.removeAttribute('data-page');
            }

            if (menuText === 'reseñas') {
                // Inicializar componentes de reseñas después de cargar el contenido
                if (typeof initReviews === 'function') {
                    setTimeout(() => {
                        initReviews();
                    }, 100); // Pequeño delay por si acaso
                } else {
                    console.error('La función initReviews no está definida.');
                }
            }
        }
    });
});

// Initialize sidebar and settings toggle functionality
const allSideDivider = document.querySelectorAll('#sidebar .divider');
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
const settingsButton = document.getElementById('settingsButton');
const settingsMenu = document.querySelector('.settings-menu');

menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');

    if (allSideDivider.length) {
        allSideDivider.forEach(item=> {
            item.textContent = item.textContent === '→' ? '←' : '→';
        });
    }
});

// Settings menu toggle
settingsButton.addEventListener('click', function(e) {
    e.preventDefault();
    settingsMenu.classList.toggle('show');
});

// Close settings menu when clicking outside
document.addEventListener('click', function(e) {
    if (!settingsButton.contains(e.target) && !settingsMenu.contains(e.target)) {
        settingsMenu.classList.remove('show');
    }
});

// Initialize dark mode toggle
const switchMode = document.getElementById('switch-mode');
const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.classList.toggle('dark');
    });
}

// Initialize notification and profile menu toggles
const notificationIcon = document.getElementById('notificationIcon');
const notificationMenu = document.getElementById('notificationMenu');
const profileIcon = document.getElementById('profileIcon');
const profileMenu = document.getElementById('profileMenu');

if (profileIcon) {
    profileIcon.addEventListener('click', (e) => {
        e.preventDefault();
        profileMenu.classList.toggle('show');
        if (notificationMenu) {
            notificationMenu.classList.remove('show');
        }
    });
}

// Close menus when clicking outside & Handle header menu clicks
document.addEventListener('click', (e) => {
    // Close notification menu
    if (notificationIcon && notificationMenu) {
        if (!notificationIcon.contains(e.target) && !notificationMenu.contains(e.target)) {
            notificationMenu.classList.remove('show');
        }
    }

    // Close profile menu OR handle clicks within it
    if (profileIcon && profileMenu) {
        if (!profileIcon.contains(e.target) && !profileMenu.contains(e.target)) {
            profileMenu.classList.remove('show');
        } else if (profileMenu.contains(e.target)) {
            // Check if a link inside the profile menu was clicked
            const clickedLink = e.target.closest('a');
            if (clickedLink) {
                // Check if it's the "Mi Perfil" link
                const profileLinkIcon = clickedLink.querySelector('i.bxs-user');
                if (profileLinkIcon) {
                    e.preventDefault(); // Prevent default link behavior
                    // Find the corresponding sidebar link and click it
                    const sidebarProfileLink = document.querySelector('.side-menu.top a .text');
                    let profileSidebarItem = null;
                    document.querySelectorAll('.side-menu.top li a .text').forEach(textSpan => {
                         if (textSpan.textContent.toLowerCase() === 'perfil') {
                              profileSidebarItem = textSpan.closest('a');
                         }
                    });
                    if (profileSidebarItem) {
                        profileSidebarItem.click(); // Simulate click on sidebar item
                    }
                    profileMenu.classList.remove('show'); // Close the menu
                }
                // Add else if for "Configuración" or other links if needed later
                 else if (clickedLink.id === 'logoutButton') {
                     // Logout logic is handled by the DOMContentLoaded listener
                     // No need to do anything here, just don't close the menu immediately
                 } else {
                      // For other links like "Configuración", let them behave normally or add specific logic
                      // For now, just close the menu
                      profileMenu.classList.remove('show');
                 }
            }
        }
    }
});


// Add to cart functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const productCard = e.target.closest('.product-card') || e.target.closest('.detail-card');
        if (productCard) {
            let productName, productPrice, productImage, productId;

            // Verificar si estamos en la vista de productos o categorías
            if (productCard.classList.contains('product-card')) {
                productName = productCard.querySelector('h3').textContent;
                productPrice = productCard.querySelector('.price').textContent;
                productImage = productCard.querySelector('img').src;
                productId = productCard.dataset.id;
            } else if (productCard.classList.contains('detail-card')) {
                productName = productCard.querySelector('h2').textContent;
                productPrice = productCard.querySelector('.price').textContent;
                productImage = productCard.querySelector('img').src;
                productId = productCard.dataset.id || productCard.closest('[data-id]')?.dataset.id;
                if (!productId) {
                    console.error('No se pudo encontrar el ID del producto para:', productName);
                }
            } else {
                console.error('Tarjeta de producto no reconocida');
                return;
            }

            // Asignar un stock por defecto para productos sin indicador de stock
            const stockElement = productCard.querySelector('.stock span');
            const productStock = stockElement ? parseInt(stockElement.textContent) : 99;

            const cleanedPrice = parseInt(productPrice.replace(/[^0-9]/g, ''));
            if (isNaN(cleanedPrice)) {
                console.error('Precio inválido para el producto:', productName, productPrice);
                return;
            }

            const product = {
                id: productId,
                name: productName,
                price: cleanedPrice,
                priceFormatted: productPrice,
                image: productImage,
                stock: productStock,
                quantity: 1
            };

            const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

            if (existingItemIndex > -1) {
                if (cartItems[existingItemIndex].quantity < cartItems[existingItemIndex].stock) {
                    cartItems[existingItemIndex].quantity++;
                    alert(`Se añadió otra unidad de ${productName} al carrito.`);
                } else {
                    alert(`No puedes añadir más unidades de ${productName}. Stock máximo alcanzado.`);
                }
            } else {
                if (product.stock > 0) {
                    cartItems.push(product);
                    alert(`¡${productName} ha sido añadido a tu carrito!`);
                } else {
                    alert(`Lo sentimos, ${productName} está agotado.`);
                }
            }

            updateCart();
            saveCartToDB();
        }
    }
});

// Update cart display
function updateCart() {
    const cartContent = document.querySelector('.cart-content');
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cartContent) {
        if (!cartItems || cartItems.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart-container" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    text-align: center;
                ">
                    <i class='bx bx-cart' style="
                        font-size: 3rem;
                        color: var(--blue);
                        margin-bottom: 1rem;
                    "></i>
                    <div class="empty-cart-icon" style="
                        width: 80px;
                        height: 80px;
                        background: var(--grey);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 1rem;
                    ">
                        <i class='bx bx-shopping-bag' style="
                            font-size: 2.5rem;
                            color: var(--blue);
                        "></i>
                    </div>
                </div>`;
        } else {
            let cartHTML = '<div class="cart-items">';
            let total = 0;
            
            cartItems.forEach((item, index) => {
                const itemTotal = item.price * (item.quantity || 1);
                total += itemTotal;
                
                cartHTML += `
                    <div class="cart-item" style="display:flex; margin-bottom:10px; align-items:center;">
                        <img src="${API_BASE_URL}/${item.imagen_prod}" alt="${item.name}" style="width:40px; height:40px; margin-right:10px;">
                        <div class="item-details" style="flex-grow:1;">
                            <p style="margin:0; font-size:0.9em; color: var(--dark);">${item.name}</p>
                            <p style="margin:0; color:var(--blue); font-weight:bold;">${item.priceFormatted || '$' + item.price.toLocaleString()}</p>
                        </div>
                        <button class="remove-item" data-index="${index}" style="background:none; border:none; color:red; cursor:pointer;">×</button>
                    </div>
                `;
            });
            cartHTML += '</div>';
            cartHTML += `<a href="#" class="view-cart" style="display:block; text-align:center; margin-top:10px; padding:8px; background:var(--blue); color:var(--light); border-radius:5px; text-decoration:none;">Ver Carrito</a>`;
            cartContent.innerHTML = cartHTML;
            
            const viewCartBtn = cartContent.querySelector('.view-cart');
            if (viewCartBtn) {
                viewCartBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.querySelector('.side-menu.top li a .text[textContent="Compras"]').parentElement.click();
                });
            }
        }
    }
    
    if (cartItemsContainer) {
        if (!cartItems || cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-container" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem;
                    text-align: center;
                    background: var(--light);
                    border-radius: 15px;
                ">
                    <div class="empty-cart-icon" style="
                        width: 120px;
                        height: 120px;
                        background: var(--grey);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 1.5rem;
                        transition: all 0.3s ease;
                    ">
                        <i class='bx bx-shopping-bag' style="
                            font-size: 4rem;
                            color: var(--blue);
                        "></i>
                    </div>
                    <span style="
                        color: var(--blue);
                        font-size: 1.2rem;
                        font-weight: 500;
                    ">Tu carrito está vacío</span>
                </div>`;
            document.getElementById('subtotal').textContent = '$0';
            document.getElementById('tax').textContent = '$0';
            document.getElementById('total').textContent = '$0';
        } else {
            let cartHTML = '';
            let total = 0;
            
            cartItems.forEach((item, index) => {
                const itemTotal = item.price * (item.quantity || 1);
                total += itemTotal;
                
                cartHTML += `
                    <div class="cart-item" style="display:flex; margin-bottom:20px; padding:15px; background:var(--grey); border-radius:10px; align-items:center;">
                        <img src="${API_BASE_URL}/${item.imagen_prod}" alt="${item.name}" style="width:80px; height:80px; margin-right:20px; border-radius:5px;">
                        <div class="item-details" style="flex-grow:1;">
                            <h4 style="margin:0 0 10px 0; color: var(--dark);">${item.name}</h4>
                            <p style="margin:0; color:var(--blue); font-weight:bold; font-size:1.1em;">${item.priceFormatted || '$' + item.price.toLocaleString()}</p>
                            <div class="quantity-controls" style="margin-top:10px;">
                                <button class="qty-btn minus" data-index="${index}">-</button>
                                <input type="number" value="${item.quantity || 1}" min="1" max="${item.stock}" 
                                    class="qty-input" data-index="${index}" style="width:50px; text-align:center; color: var(--dark);">
                                <button class="qty-btn plus" data-index="${index}">+</button>
                                <span class="stock-info" style="color: #000000;">(Stock: ${item.stock})</span>
                            </div>
                        </div>
                        <button class="remove-item" data-index="${index}" style="background:none; border:none; color:var(--dark); font-size:24px; cursor:pointer;">×</button>
                    </div>
                `;
            });
            
            cartItemsContainer.innerHTML = cartHTML;
            document.getElementById('subtotal').textContent = `$${total.toLocaleString()}`;
            document.getElementById('tax').textContent = `$${Math.round(total * 0.19).toLocaleString()}`;
            document.getElementById('total').textContent = `$${Math.round(total * 1.19).toLocaleString()}`;
        }
    }
}

// Remove item from cart
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-item')) {
        const index = e.target.dataset.index;
        if (cartItems[index]) {
            cartItems.splice(index, 1);
            updateCart();
            saveCartToDB();
        }
    }
});

// Agregar event listeners para controles de cantidad
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('qty-btn')) {
        const index = e.target.dataset.index;
        const item = cartItems[index];
        const input = e.target.closest('.quantity-controls').querySelector('.qty-input');
        
        if (!item || !input) return;

        let changed = false;
        if (e.target.classList.contains('plus') && item.quantity < item.stock) {
            item.quantity++;
            changed = true;
        } else if (e.target.classList.contains('minus') && item.quantity > 1) {
            item.quantity--;
            changed = true;
        } else if (e.target.classList.contains('plus') && item.quantity >= item.stock) {
            alert(`No puedes añadir más unidades de ${item.name}. Stock máximo (${item.stock}) alcanzado.`);
        }

        if (changed) {
            input.value = item.quantity;
            updateCart();
            saveCartToDB();
        }
    }
});

document.addEventListener('change', function(e) {
    if (e.target.classList.contains('qty-input')) {
        const index = e.target.dataset.index;
        const item = cartItems[index];
        if (!item) return;

        let newQty = parseInt(e.target.value);

        if (isNaN(newQty) || newQty < 1) {
            newQty = 1;
        }

        if (newQty > item.stock) {
            alert(`La cantidad (${newQty}) no puede exceder el stock disponible (${item.stock}).`);
            newQty = item.stock;
        }

        if (item.quantity !== newQty) {
            item.quantity = newQty;
            e.target.value = newQty;
            updateCart();
            saveCartToDB();
        }
    }
});

// Cart menu toggle
const cartIcon = document.getElementById('cartIcon');
const cartMenu = document.getElementById('cartMenu');

if (cartIcon && cartMenu) {
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!cartIcon.contains(e.target) && !cartMenu.contains(e.target)) {
            cartMenu.classList.remove('show');
        }
    });
}

// Al inicio del archivo, después de las definiciones
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM completamente cargado. Iniciando...');

    // 1. Cargar el carrito pendiente desde la BD
    await loadCartFromDB();

    // 2. Cargar y mostrar los productos en la página inicial
    await loadProducts(); // Llamar a la nueva función aquí

    // 3. Marcar la página inicial (Productos) como activa
    // Selector más robusto
    const menuLinks = document.querySelectorAll('.side-menu.top li a .text');
    let productosMenuItemLi = null;
    menuLinks.forEach(linkText => {
        if (linkText.textContent.trim().toLowerCase() === 'productos') {
            // Subir dos niveles para obtener el <li>
            if(linkText.parentElement && linkText.parentElement.parentElement){
                productosMenuItemLi = linkText.parentElement.parentElement;
            }
        }
    });

    if (productosMenuItemLi) {
        // Quitar active de otros por si acaso
        document.querySelectorAll('.side-menu.top li.active').forEach(li => li.classList.remove('active'));
        // Añadir active al correcto
        productosMenuItemLi.classList.add('active');
        document.body.setAttribute('data-page', 'productos');
    } else {
         console.warn('No se pudo encontrar el item de menú Productos para marcarlo como activo.');
    }

    // 4. Inicializar el buscador (si existe en la página inicial)
    const searchInput = document.querySelector('#content nav form input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // 5. Inicializar otros componentes si es necesario (ej. perfil si se carga por defecto)
    // updateCart(); // Ya se llama dentro de loadCartFromDB

     // 6. Adjuntar listener al evento beforeunload para un último intento de guardado
     // ¡OJO! Esto no garantiza el guardado, especialmente en móviles.
     window.addEventListener('beforeunload', (event) => {
         // No podemos hacer llamadas async aquí de forma fiable.
         // La mejor estrategia es guardar frecuentemente con debounce.
         console.log('Página a punto de cerrarse.');
         // Podríamos intentar un envío síncrono, pero está obsoleto y bloquea.
         // navigator.sendBeacon() es una opción moderna pero solo para datos pequeños.
         // Lo mejor es confiar en el guardado frecuente con debounce.
         // saveCartToDB.flush(); // Podría no completarse
     });

    // --- Configurar Botón Logout AHORA que el DOM está listo ---
    const profileMenuContainer = document.getElementById('profileMenu');
    let logoutButton = null;
    if (profileMenuContainer) {
        // Usar el ID específico del enlace
        logoutButton = document.getElementById('logoutButton');
    }
    const confirmLogoutButton = document.getElementById('confirmLogout');
    const cancelLogoutButton = document.getElementById('cancelLogout');
    const logoutModal = document.getElementById('logoutModal');

    // Listener para el botón de logout en el menú de perfil
    if (logoutButton) {
        console.log('Botón de logout encontrado, añadiendo listener.'); // Log de verificación
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botón de logout clickeado.'); // Log de verificación
            if (logoutModal) {
                logoutModal.style.display = 'block';
                // Resetear estado del botón de confirmar por si se canceló antes
                 if(confirmLogoutButton) confirmLogoutButton.textContent = 'Sí';
                 if(confirmLogoutButton) confirmLogoutButton.disabled = false;
            } else {
                // Si no hay modal, preguntar directamente
                 if (confirm('¿Estás seguro que quieres cerrar sesión?')) {
                     handleLogout();
                 }
            }
        });
    } else {
         console.error('¡El botón de logout con id="logoutButton" NO fue encontrado!');
    }

    // Listener para el botón de confirmar en el modal
    if (confirmLogoutButton) {
        confirmLogoutButton.addEventListener('click', handleLogout);
    }

    // Listener para el botón de cancelar en el modal
    if (cancelLogoutButton && logoutModal) {
        cancelLogoutButton.addEventListener('click', function() {
            logoutModal.style.display = 'none';
        });
    }

    // Listener para cerrar modal al hacer clic fuera
    if (logoutModal) {
        window.addEventListener('click', function(e) {
            if (e.target == logoutModal) {
                logoutModal.style.display = 'none';
            }
        });
    }
    // --- Fin Configurar Botón Logout ---

    console.log('Inicialización completada.');
});

// La función handleLogout se mantiene igual (fuera de DOMContentLoaded)
async function handleLogout() {
    console.log('Iniciando proceso de cierre de sesión...');
    const confirmLogoutButton = document.getElementById('confirmLogout'); // Re-obtener por si acaso
    try {
        if(confirmLogoutButton) confirmLogoutButton.textContent = 'Guardando...';
        if(confirmLogoutButton) confirmLogoutButton.disabled = true;

        console.log('Guardando carrito antes de cerrar sesión...');
        // Asegurarse que saveCartToDB y su método flush estén definidos
        if (typeof saveCartToDB !== 'undefined' && typeof saveCartToDB.flush === 'function') {
             await saveCartToDB.flush(); 
             console.log('Llamada a saveCartToDB.flush() completada.');
        } else {
             console.warn('saveCartToDB o saveCartToDB.flush no están definidos al intentar cerrar sesión.');
        }
       
        console.log('Redirigiendo para cerrar sesión...');
        window.location.href = "http://localhost/InstrumentosLLaneros/index.php"; 

    } catch (error) {
        console.error('Error durante el cierre de sesión:', error);
        alert('Error al guardar el carrito antes de cerrar sesión. Intenta de nuevo.');
         if(confirmLogoutButton) confirmLogoutButton.textContent = 'Sí';
         if(confirmLogoutButton) confirmLogoutButton.disabled = false;
    }
}

// (Se eliminó la segunda definición de debounce que estaba aquí)

// Lógica para el modal de configuración
document.addEventListener('DOMContentLoaded', () => {
    const headerSettingsButton = document.getElementById('headerSettingsButton');
    const settingsModal = document.getElementById('settingsModal');
    const closeButton = document.getElementById('closeSettingsModal');
    const toggleThemeButton = document.getElementById('toggleTheme');

    if (headerSettingsButton && settingsModal && closeButton) {
        headerSettingsButton.addEventListener('click', (e) => {
            e.preventDefault();
            settingsModal.style.display = 'block';
        });

        closeButton.addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });
    }

    // Lógica para cambiar el tema (ejemplo simple)
    if (toggleThemeButton) {
        toggleThemeButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            alert('Tema cambiado (funcionalidad básica)');
        });
    }
});