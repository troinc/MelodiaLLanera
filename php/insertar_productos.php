<?php
include 'conexion.php'; // Uso correcto de la conexión a la BD

header('Content-Type: application/json; charset=UTF-8');

// Obtener JSON enviado
$input = file_get_contents('php://input');
$productos = json_decode($input, true);
if (json_last_error() !== JSON_ERROR_NONE || !is_array($productos)) {
    echo json_encode(['status' => 'error', 'message' => 'JSON inválido.']);
    exit();
}

// Preparar la consulta (se inserta cada atributo: código, nombre, descripción, precio, stock y categoría)
// Procesar cada producto del JSON
// Recibir datos JSON del cuerpo de la petición
$json = file_get_contents('php://input');
$productos = json_decode($json, true);

// Validar que se recibieron datos JSON válidos
if (json_last_error() !== JSON_ERROR_NONE || !is_array($productos)) {
    echo json_encode(['status' => 'error', 'message' => 'Datos JSON inválidos.']);
    exit();
}

foreach ($productos as $producto) {
    // Validar que todos los campos requeridos estén presentes
    if (!isset($producto['cod_prod'], $producto['nom_prod'], $producto['desc_prod'], 
              $producto['precio_prod'], $producto['stock_prod'], $producto['cod_cat'])) {
        echo json_encode(['status' => 'error', 'message' => 'Faltan campos requeridos en el JSON.']);
        exit();
    }

    $sql = "INSERT INTO productos (cod_prod, nom_prod, desc_prod, precio_prod, stock_prod, cod_cat) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Error preparando la consulta: ' . $conexion->error]);
        exit();
    }

    // Bind de parámetros
    $stmt->bind_param("sssdis", 
        $producto['cod_prod'], 
        $producto['nom_prod'], 
        $producto['desc_prod'], 
        $producto['precio_prod'], 
        $producto['stock_prod'], 
        $producto['cod_cat']
    );

    if (!$stmt->execute()) {
        echo json_encode(['status' => 'error', 'message' => 'Error al insertar producto: ' . $stmt->error]);
        $stmt->close();
        exit();
    }
    $stmt->close();
}

echo json_encode(['status' => 'success', 'message' => 'Productos insertados correctamente.']);

foreach ($productos as $prod) {
    // Se valida que existan todos los datos requeridos
    if (!isset($prod['nom_prod'], $prod['desc_prod'], $prod['precio_prod'], $prod['cod_cat'])) {
        continue; // Se omite el registro incompleto
    }
    $cod_prod    = uniqid('prod_');            // Genera un identificador único para el producto
    $nom_prod    = trim($prod['nom_prod']);
    $desc_prod   = trim($prod['desc_prod']);
    $precio_prod = floatval($prod['precio_prod']);
    $stock_prod  = rand(10, 100);               // Genera stock aleatorio entre 10 y 100
    $cod_cat     = trim($prod['cod_cat']);
    
    $stmt->bind_param("sssdis", $cod_prod, $nom_prod, $desc_prod, $precio_prod, $stock_prod, $cod_cat);
    if (!$stmt->execute()) {
        error_log("Error insertando producto ($nom_prod): " . $stmt->error);
        continue;
    }
}
$stmt->close();
$conexion->close();

echo json_encode(['status' => 'success', 'message' => 'Productos insertados correctamente.']);
?>
