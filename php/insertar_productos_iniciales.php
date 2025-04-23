<?php
// Script para insertar los productos iniciales desde el HTML a la BD

// Usar __DIR__ para una ruta más robusta al archivo de conexión
include __DIR__ . '/../conexion.php'; 

// Array con los datos de los productos extraídos del HTML/JS
$productos_iniciales = [
    // Cuerdas
    ['cod_prod' => '1', 'nom_prod' => 'Arpa Llanera Profesional', 'desc_prod' => 'El arpa llanera es uno de los instrumentos más emblemáticos...', 'precio_prod' => 2500000, 'stock_prod' => 10, 'cod_cat' => 'CUE'],
    ['cod_prod' => '2', 'nom_prod' => 'Cuatro Llanero', 'desc_prod' => 'El cuatro llanero es un instrumento tradicional...', 'precio_prod' => 800000, 'stock_prod' => 15, 'cod_cat' => 'CUE'],
    ['cod_prod' => '4', 'nom_prod' => 'Bandola Llanera', 'desc_prod' => 'La bandola llanera es un instrumento tradicional...', 'precio_prod' => 1200000, 'stock_prod' => 8, 'cod_cat' => 'CUE'],
    ['cod_prod' => '9', 'nom_prod' => 'Guitarra Criolla', 'desc_prod' => 'La guitarra criolla es un instrumento tradicional...', 'precio_prod' => 900000, 'stock_prod' => 10, 'cod_cat' => 'CUE'],
    ['cod_prod' => '10', 'nom_prod' => 'Bajo Quinto Tradicional', 'desc_prod' => 'El bajo quinto es un instrumento tradicional...', 'precio_prod' => 1800000, 'stock_prod' => 6, 'cod_cat' => 'CUE'],
    ['cod_prod' => '11', 'nom_prod' => 'Requinto Llanero', 'desc_prod' => 'El requinto llanero es un instrumento tradicional...', 'precio_prod' => 750000, 'stock_prod' => 9, 'cod_cat' => 'CUE'],
    ['cod_prod' => '14', 'nom_prod' => 'Tiple Colombiano', 'desc_prod' => 'El tiple es fundamental en la música andina colombiana...', 'precio_prod' => 650000, 'stock_prod' => 7, 'cod_cat' => 'CUE'],
    ['cod_prod' => '15', 'nom_prod' => 'Mandolina Artesanal', 'desc_prod' => 'Ideal para música folclórica y clásica...', 'precio_prod' => 950000, 'stock_prod' => 5, 'cod_cat' => 'CUE'],
    // Percusión
    ['cod_prod' => '3', 'nom_prod' => 'Maracas Artesanales', 'desc_prod' => 'Las maracas son instrumentos de percusión...', 'precio_prod' => 150000, 'stock_prod' => 20, 'cod_cat' => 'PER'],
    ['cod_prod' => '5', 'nom_prod' => 'Capachos Tradicionales', 'desc_prod' => 'Los capachos son instrumentos de percusión...', 'precio_prod' => 180000, 'stock_prod' => 12, 'cod_cat' => 'PER'],
    ['cod_prod' => '6', 'nom_prod' => 'Furruco Artesanal', 'desc_prod' => 'El furruco es un instrumento de percusión...', 'precio_prod' => 450000, 'stock_prod' => 5, 'cod_cat' => 'PER'],
    ['cod_prod' => '7', 'nom_prod' => 'Tambora Llanera', 'desc_prod' => 'La tambora llanera es un instrumento de percusión...', 'precio_prod' => 350000, 'stock_prod' => 7, 'cod_cat' => 'PER'],
    ['cod_prod' => '8', 'nom_prod' => 'Charrasca de Metal', 'desc_prod' => 'La charrasca es un instrumento de percusión...', 'precio_prod' => 120000, 'stock_prod' => 18, 'cod_cat' => 'PER'],
    ['cod_prod' => '12', 'nom_prod' => 'Cajón Peruano', 'desc_prod' => 'El cajón peruano es un instrumento de percusión...', 'precio_prod' => 280000, 'stock_prod' => 14, 'cod_cat' => 'PER'],
    ['cod_prod' => '13', 'nom_prod' => 'Güiro Profesional', 'desc_prod' => 'Esencial en ritmos latinos como salsa y cumbia...', 'precio_prod' => 95000, 'stock_prod' => 25, 'cod_cat' => 'PER'],
    // Viento
    ['cod_prod' => '16', 'nom_prod' => 'Flauta Llanera Tradicional', 'desc_prod' => 'La flauta llanera es un instrumento de viento...', 'precio_prod' => 350000, 'stock_prod' => 11, 'cod_cat' => 'VIE'],
    ['cod_prod' => '17', 'nom_prod' => 'Quena Tradicional', 'desc_prod' => 'La quena es una flauta tradicional de los Andes...', 'precio_prod' => 280000, 'stock_prod' => 8, 'cod_cat' => 'VIE'],
    // Tradicionales
    ['cod_prod' => '18', 'nom_prod' => 'Sistro del Llano', 'desc_prod' => 'Instrumento de percusión tradicional del llano...', 'precio_prod' => 90000, 'stock_prod' => 15, 'cod_cat' => 'TRA'],
    ['cod_prod' => '19', 'nom_prod' => 'Quitiplas Tradicionales', 'desc_prod' => 'Instrumento de percusión formado por tubos de bambú...', 'precio_prod' => 200000, 'stock_prod' => 10, 'cod_cat' => 'TRA'],
];

// Preparar consulta para verificar existencia
$sql_check = "SELECT cod_prod FROM productos WHERE cod_prod = ?";
$stmt_check = $conexion->prepare($sql_check);
if (!$stmt_check) {
    die("Error preparando consulta de verificación: " . $conexion->error);
}

// Preparar consulta para insertar
$sql_insert = "INSERT INTO productos (cod_prod, nom_prod, desc_prod, precio_prod, stock_prod, cod_cat) VALUES (?, ?, ?, ?, ?, ?)";
$stmt_insert = $conexion->prepare($sql_insert);
if (!$stmt_insert) {
    die("Error preparando consulta de inserción: " . $conexion->error);
}

$insertados = 0;
$existentes = 0;
$errores = 0;

echo "Iniciando inserción de productos...\n";

foreach ($productos_iniciales as $producto) {
    // Verificar si el producto ya existe
    $stmt_check->bind_param("s", $producto['cod_prod']);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows === 0) {
        // No existe, intentar insertar
        $stmt_insert->bind_param(
            "sssdis", // s: cod_prod, s: nom_prod, s: desc_prod, d: precio_prod, i: stock_prod, s: cod_cat
            $producto['cod_prod'],
            $producto['nom_prod'],
            $producto['desc_prod'],
            $producto['precio_prod'],
            $producto['stock_prod'],
            $producto['cod_cat']
        );

        if ($stmt_insert->execute()) {
            echo "Producto insertado: " . $producto['nom_prod'] . " (ID: " . $producto['cod_prod'] . ")\n";
            $insertados++;
        } else {
            echo "ERROR al insertar " . $producto['nom_prod'] . ": " . $stmt_insert->error . "\n";
            $errores++;
        }
    } else {
        echo "Producto ya existe: " . $producto['nom_prod'] . " (ID: " . $producto['cod_prod'] . ")\n";
        $existentes++;
    }
    $result_check->free(); // Liberar resultado
}

$stmt_check->close();
$stmt_insert->close();
$conexion->close();

echo "\n--- Resumen ---\n";
echo "Productos insertados: " . $insertados . "\n";
echo "Productos que ya existían: " . $existentes . "\n";
echo "Errores durante la inserción: " . $errores . "\n";
echo "Proceso completado.\n";

?>
