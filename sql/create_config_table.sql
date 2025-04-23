-- Script para crear la tabla 'configuracion'

CREATE TABLE IF NOT EXISTS `configuracion` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre_tienda` VARCHAR(255) DEFAULT NULL,
  `descripcion_tienda` TEXT DEFAULT NULL,
  `contacto_email` VARCHAR(255) DEFAULT NULL,
  `contacto_telefono` VARCHAR(50) DEFAULT NULL,
  `contacto_direccion` TEXT DEFAULT NULL,
  `redes_sociales` TEXT DEFAULT NULL, -- Puede ser JSON o texto simple
  `moneda` VARCHAR(10) DEFAULT 'USD',
  `impuestos_activos` BOOLEAN DEFAULT FALSE,
  `porcentaje_impuesto` DECIMAL(5, 2) DEFAULT NULL,
  `metodos_pago` JSON DEFAULT NULL, -- Almacenar como JSON
  `opciones_envio` JSON DEFAULT NULL, -- Almacenar como JSON
  `costo_envio_estandar` DECIMAL(10, 2) DEFAULT NULL,
  `envio_gratis_desde` DECIMAL(10, 2) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar una fila de configuración inicial (opcional, puedes ajustarla)
INSERT INTO `configuracion` (
    `nombre_tienda`, 
    `descripcion_tienda`, 
    `contacto_email`, 
    `contacto_telefono`, 
    `contacto_direccion`, 
    `redes_sociales`, 
    `moneda`, 
    `impuestos_activos`, 
    `porcentaje_impuesto`, 
    `metodos_pago`, 
    `opciones_envio`, 
    `costo_envio_estandar`, 
    `envio_gratis_desde`
) VALUES (
    'Instrumentos Llaneros',
    'Tu tienda de instrumentos musicales llaneros.',
    'contacto@instrumentosllaneros.com',
    '+1234567890',
    'Calle Falsa 123, Ciudad Ejemplo',
    '{"facebook": "https://facebook.com/tienda", "instagram": "https://instagram.com/tienda"}',
    'COP', -- Cambiado a COP como ejemplo
    TRUE,
    19.00,
    '["Tarjeta de crédito", "PSE", "Efecty"]',
    '["Envío estándar", "Recogida en tienda"]',
    15000.00,
    200000.00
) ON DUPLICATE KEY UPDATE id=id; -- Evita inserción duplicada si ya existe una fila