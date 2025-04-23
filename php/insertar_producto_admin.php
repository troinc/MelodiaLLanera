<?php
// TODO: Implementar verificación de sesión de administrador si es necesario
// session_start();
// if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
//     http_response_code(403); // Forbidden
//     echo json_encode(['status' => 'error', 'message' => 'Acceso no autorizado.']);
//     exit;
// }

header("Content-Type: application/json; charset=UTF-8");
error_reporting(0); // Desactivar reportes directos en producción
ini_set('log_errors', 1); // Asegurar registro de errores

require_once __DIR__ . '/../conexion.php'; // Conexión a la BD

// Verificar la conexión inmediatamente después de incluir el archivo
if ($conexion === null || $conexion->connect_error) {
    error_log("Error de conexión en insertar_producto_admin.php: " . ($conexion ? $conexion->connect_error : 'No se pudo crear objeto mysqli'));
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor (conexión BD): ' . ($conexion ? $conexion->connect_error : 'No se pudo crear objeto mysqli')]);
    exit;
}

// Registrar los datos recibidos
error_log("Datos \$_POST recibidos: " . print_r($_POST, true));
error_log("Datos \$_FILES recibidos: " . print_r($_FILES, true));

// --- Validar Método HTTP ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido. Se esperaba POST.']);
    exit;
}

// --- Recibir y Validar Datos del Formulario ---
$nom_prod = $_POST['nom_prod'] ?? null;
$desc_prod = $_POST['desc_prod'] ?? ''; // Descripción puede ser opcional
$precio_prod = $_POST['precio_prod'] ?? null;
$stock_prod = $_POST['stock_prod'] ?? null;
$cod_cat = $_POST['cod_cat'] ?? null; // Categoría puede ser opcional

$errors = [];
if (empty($nom_prod)) $errors[] = "El nombre del producto es obligatorio.";
if ($precio_prod === null || !is_numeric($precio_prod) || $precio_prod < 0) $errors[] = "El precio debe ser un número válido y no negativo.";
if ($stock_prod === null || !ctype_digit($stock_prod) || $stock_prod < 0) $errors[] = "El stock debe ser un número entero no negativo.";
// Podrías añadir validación para cod_cat si es obligatorio o si debe existir en la tabla categorias

// --- Validar Método HTTP ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido. Se esperaba POST.']);
    exit;
}

// --- Recibir y Validar Datos del Formulario ---
$nom_prod = $_POST['nom_prod'] ?? null;
$desc_prod = $_POST['desc_prod'] ?? ''; // Descripción puede ser opcional
$precio_prod = $_POST['precio_prod'] ?? null;
$stock_prod = $_POST['stock_prod'] ?? null;
$cod_cat = $_POST['cod_cat'] ?? null; // Categoría puede ser opcional

$errors = [];
if (empty($nom_prod)) $errors[] = "El nombre del producto es obligatorio.";
if ($precio_prod === null || !is_numeric($precio_prod) || $precio_prod < 0) $errors[] = "El precio debe ser un número válido y no negativo.";
if ($stock_prod === null || !ctype_digit($stock_prod) || $stock_prod < 0) $errors[] = "El stock debe ser un número entero no negativo.";
// Podrías añadir validación para cod_cat si es obligatorio o si debe existir en la tabla categorias

// --- Si hay errores, devolverlos ANTES de procesar la imagen ---
if (!empty($errors)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Errores de validación.', 'errors' => $errors]);
    exit;
}

// --- Validar Imagen ---
$imagen_path_db = null; // Variable para guardar la ruta de la imagen en la BD
$imagen_subida = isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK;

if ($imagen_subida) {
    $imagen_info = $_FILES['imagen'];
    $nombre_temporal = $imagen_info['tmp_name'];
    $nombre_original = $imagen_info['name'];
    $tamaño_archivo = $imagen_info['size'];
    $tipo_archivo = $imagen_info['type'];
    $error_archivo = $imagen_info['error'];

    // Validaciones básicas de imagen
    $tipos_permitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $tamaño_maximo = 5 * 1024 * 1024; // 5 MB

    if (!in_array($tipo_archivo, $tipos_permitidos)) {
        $errors[] = "Tipo de archivo de imagen no permitido. Solo JPG, PNG, GIF, WEBP.";
    }
    if ($tamaño_archivo > $tamaño_maximo) {
        $errors[] = "El tamaño de la imagen excede el límite de 5 MB.";
    }

} // No añadir error si no se sube imagen, podría ser opcional

// --- Si hay errores, devolverlos ---
if (!empty($errors)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Errores de validación.', 'errors' => $errors]);
    exit;
}

// --- Procesar Imagen (si se subió) ---
if ($imagen_subida) {
    $directorio_subidas = __DIR__ . '/../uploads/products/'; // Directorio relativo al script actual
    $nombre_archivo_unico = 'prod_' . uniqid() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "_", basename($nombre_original));
    $ruta_destino_servidor = $directorio_subidas . $nombre_archivo_unico;
    // Ruta relativa para guardar en la BD (accesible desde la raíz web)
    $imagen_path_db = 'uploads/products/' . $nombre_archivo_unico;

    // Crear directorio si no existe
    if (!is_dir($directorio_subidas)) {
        if (!mkdir($directorio_subidas, 0777, true)) {
            error_log("Error: No se pudo crear el directorio de subidas: " . $directorio_subidas);
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor al crear directorio.']);
            exit;
        }
    }

    // Mover archivo
    if (!move_uploaded_file($nombre_temporal, $ruta_destino_servidor)) {
        error_log("Error al mover el archivo subido a: " . $ruta_destino_servidor);
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor al guardar la imagen.']);
        exit;
    }
}

// --- Generar Código de Producto Único ---
$cod_prod = uniqid('prod_');

// --- Preparar y Ejecutar Inserción en BD ---
// !! IMPORTANTE: Asegúrate de que la columna 'imagen_prod' exista en tu tabla 'productos' !!
$sql = "INSERT INTO productos (cod_prod, nom_prod, desc_prod, precio_prod, stock_prod, cod_cat, imagen_prod) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    error_log("Error preparando INSERT productos: " . $conexion->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor al preparar consulta.']);
    // Si hubo imagen, intentar borrarla para no dejar archivos huérfanos
    if ($imagen_subida && file_exists($ruta_destino_servidor)) {
        unlink($ruta_destino_servidor);
    }
    exit;
}

// Ajustar tipos: s (cod_prod), s (nom_prod), s (desc_prod), d (precio), i (stock), s (cod_cat), s (imagen_path_db)
$stmt->bind_param("sssdisss",
    $cod_prod,
    $nom_prod,
    $desc_prod,
    $precio_prod,
    $stock_prod,
    $cod_cat,
    $imagen_path_db // Será NULL si no se subió imagen y la columna lo permite
);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        // Éxito: Devolver el producto insertado (opcional pero útil)
        echo json_encode([
            'status' => 'success',
            'message' => 'Producto añadido exitosamente.',
            'producto' => [ // Devolver datos para actualizar UI si es necesario
                 'cod_prod' => $cod_prod,
                 'nom_prod' => $nom_prod,
                 'desc_prod' => $desc_prod,
                 'precio_prod' => $precio_prod,
                 'stock_prod' => $stock_prod,
                 'cod_cat' => $cod_cat,
                 'imagen_prod' => $imagen_path_db // Ruta relativa guardada
            ]
        ]);
    } else {
        // Raro en INSERT, pero posible
        error_log("INSERT en productos no afectó filas para cod_prod: $cod_prod");
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'No se pudo guardar el producto (affected_rows = 0).']);
         if ($imagen_subida && file_exists($ruta_destino_servidor)) unlink($ruta_destino_servidor);
    }
} else {
    // Error al ejecutar
    error_log("Error ejecutando INSERT productos: " . $stmt->error);
    http_response_code(500);
    // Podrías verificar errores específicos como duplicados si cod_prod no fuera único
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor al guardar el producto en BD.']);
    if ($imagen_subida && file_exists($ruta_destino_servidor)) unlink($ruta_destino_servidor);
}

$stmt->close();
$conexion->close();
?>
