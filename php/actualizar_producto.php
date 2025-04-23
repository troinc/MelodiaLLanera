<?php
// TODO: Implementar verificación de sesión de administrador si es necesario
// session_start();
// if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
//     http_response_code(403); // Forbidden
//     echo json_encode(['status' => 'error', 'message' => 'Acceso no autorizado.']);
//     exit;
// }

header("Content-Type: application/json; charset=UTF-8");
error_reporting(0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../conexion.php'; // Conexión a la BD

// --- Validar Conexión ---
if ($conexion === null || $conexion->connect_error) {
    error_log("Error de conexión en actualizar_producto.php: " . ($conexion ? $conexion->connect_error : 'No se pudo crear objeto mysqli'));
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor (conexión BD).']);
    exit;
}

// --- Validar Método HTTP ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { // Usamos POST aunque sea update por FormData
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido. Se esperaba POST.']);
    exit;
}

// --- Recibir y Validar Datos del Formulario ---
$cod_prod = $_POST['cod_prod'] ?? null; // ID del producto a actualizar es OBLIGATORIO
$nom_prod = $_POST['nom_prod'] ?? null;
$desc_prod = $_POST['desc_prod'] ?? '';
$precio_prod = $_POST['precio_prod'] ?? null;
$stock_prod = $_POST['stock_prod'] ?? null;
$cod_cat = $_POST['cod_cat'] ?? null;

$errors = [];
if (empty($cod_prod)) $errors[] = "El código del producto a actualizar es obligatorio.";
if (empty($nom_prod)) $errors[] = "El nombre del producto es obligatorio.";
if ($precio_prod === null || !is_numeric($precio_prod) || $precio_prod < 0) $errors[] = "El precio debe ser un número válido y no negativo.";
if ($stock_prod === null || !ctype_digit($stock_prod) || $stock_prod < 0) $errors[] = "El stock debe ser un número entero no negativo.";

// --- Validar Imagen (si se envió una nueva) ---
$imagen_path_db = null; // Por defecto, no actualizamos la imagen
$imagen_subida = isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK;
$ruta_destino_servidor = null; // Para posible borrado en caso de error
$ruta_imagen_antigua = null; // Para borrar la imagen anterior si se sube una nueva

if ($imagen_subida) {
    $imagen_info = $_FILES['imagen'];
    $nombre_temporal = $imagen_info['tmp_name'];
    $nombre_original = $imagen_info['name'];
    $tamaño_archivo = $imagen_info['size'];
    $tipo_archivo = $imagen_info['type'];

    $tipos_permitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $tamaño_maximo = 5 * 1024 * 1024; // 5 MB

    if (!in_array($tipo_archivo, $tipos_permitidos)) $errors[] = "Tipo de archivo de imagen no permitido.";
    if ($tamaño_archivo > $tamaño_maximo) $errors[] = "El tamaño de la imagen excede el límite de 5 MB.";
}

// --- Si hay errores, devolverlos ---
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Errores de validación.', 'errors' => $errors]);
    exit;
}

// --- Obtener ruta de imagen antigua ANTES de procesar la nueva ---
// Necesitamos consultar la BD para saber si hay una imagen antigua que borrar
// !! Asume que la columna se llama 'imagen_prod' !!
$sql_get_old_image = "SELECT imagen_prod FROM productos WHERE cod_prod = ?";
$stmt_old_image = $conexion->prepare($sql_get_old_image);
if ($stmt_old_image) {
    $stmt_old_image->bind_param("s", $cod_prod);
    if ($stmt_old_image->execute()) {
        $result_old_image = $stmt_old_image->get_result();
        if ($row = $result_old_image->fetch_assoc()) {
            if (!empty($row['imagen_prod'])) {
                $ruta_imagen_antigua = __DIR__ . '/../' . $row['imagen_prod']; // Ruta completa en servidor
            }
        }
    } else {
         error_log("Error ejecutando SELECT imagen_prod: " . $stmt_old_image->error);
         // No es fatal, continuamos pero podríamos no borrar la imagen vieja
    }
    $stmt_old_image->close();
} else {
     error_log("Error preparando SELECT imagen_prod: " . $conexion->error);
}


// --- Procesar Nueva Imagen (si se subió) ---
if ($imagen_subida) {
    $directorio_subidas = __DIR__ . '/../uploads/products/';
    $nombre_archivo_unico = 'prod_' . $cod_prod . '_' . uniqid() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "_", basename($nombre_original)); // Incluir cod_prod puede ayudar
    $ruta_destino_servidor = $directorio_subidas . $nombre_archivo_unico;
    $imagen_path_db = 'uploads/products/' . $nombre_archivo_unico; // Ruta relativa para BD

    if (!is_dir($directorio_subidas)) {
        if (!mkdir($directorio_subidas, 0777, true)) {
            error_log("Error: No se pudo crear el directorio de subidas: " . $directorio_subidas);
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor al crear directorio.']);
            exit;
        }
    }

    if (!move_uploaded_file($nombre_temporal, $ruta_destino_servidor)) {
        error_log("Error al mover el archivo subido a: " . $ruta_destino_servidor);
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor al guardar la imagen.']);
        exit;
    }
}

// --- Preparar y Ejecutar Actualización en BD ---
// Construir la consulta dinámicamente para actualizar la imagen solo si se subió una nueva
$sql_update = "UPDATE productos SET nom_prod = ?, desc_prod = ?, precio_prod = ?, stock_prod = ?, cod_cat = ?";
$params = [$nom_prod, $desc_prod, $precio_prod, $stock_prod, $cod_cat];
$types = "ssdiss"; // Tipos base: s, s, d, i, s

if ($imagen_subida) {
    $sql_update .= ", imagen_prod = ?";
    $params[] = $imagen_path_db; // Añadir la nueva ruta de imagen
    $types .= "s"; // Añadir tipo string para imagen_prod
}

$sql_update .= " WHERE cod_prod = ?";
$params[] = $cod_prod; // Añadir el cod_prod para el WHERE
$types .= "s"; // Añadir tipo string para cod_prod

$stmt = $conexion->prepare($sql_update);

if (!$stmt) {
    error_log("Error preparando UPDATE productos: " . $conexion->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor al preparar consulta.']);
    if ($imagen_subida && file_exists($ruta_destino_servidor)) unlink($ruta_destino_servidor); // Borrar nueva imagen si falla la preparación
    exit;
}

// Enlazar parámetros dinámicamente
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    // Éxito al ejecutar la consulta
    // Borrar imagen antigua SOLO si se subió una nueva y la actualización fue exitosa
    if ($imagen_subida && $ruta_imagen_antigua && file_exists($ruta_imagen_antigua)) {
        if (!unlink($ruta_imagen_antigua)) {
            error_log("Advertencia: No se pudo borrar la imagen antigua: " . $ruta_imagen_antigua);
            // No consideramos esto un error fatal para la respuesta al cliente
        }
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Producto actualizado exitosamente.',
        'producto' => [ // Devolver datos actualizados
             'cod_prod' => $cod_prod,
             'nom_prod' => $nom_prod,
             'desc_prod' => $desc_prod,
             'precio_prod' => $precio_prod,
             'stock_prod' => $stock_prod,
             'cod_cat' => $cod_cat,
             'imagen_prod' => $imagen_subida ? $imagen_path_db : ($ruta_imagen_antigua ? basename($ruta_imagen_antigua) : null) // Devolver nueva ruta o la antigua si no se cambió
        ]
    ]);

} else {
    // Error al ejecutar
    error_log("Error ejecutando UPDATE productos para cod_prod $cod_prod: " . $stmt->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor al actualizar el producto en BD.']);
    // Si se subió una nueva imagen pero falló el UPDATE, borrar la nueva imagen
    if ($imagen_subida && file_exists($ruta_destino_servidor)) unlink($ruta_destino_servidor);
}

$stmt->close();
$conexion->close();
?>
