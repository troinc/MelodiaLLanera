<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // Ajusta en producción
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Usar POST para eliminar por seguridad
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar solicitud OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

error_reporting(0);
ini_set('log_errors', 1);
// ini_set('error_log', '/ruta/a/tu/php-error.log');

require_once __DIR__ . '/../conexion.php'; // Conexión a la BD

// --- Validar Conexión ---
if ($conexion === null) {
    error_log("Error de conexión en eliminar_categoria.php: Objeto mysqli nulo.");
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor (conexión BD nula).']);
    exit;
}
if ($conexion->connect_error) {
    error_log("Error de conexión en eliminar_categoria.php: " . $conexion->connect_error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor (conexión BD).']);
    exit;
}

// --- Validar Método HTTP ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido. Se esperaba POST.']);
    exit;
}

// --- Obtener y Validar Datos de Entrada ---
// Leer el cuerpo de la solicitud JSON si Content-Type es application/json
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
$cod_cat = null;

if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $cod_cat = isset($input['cod_cat']) ? filter_var($input['cod_cat'], FILTER_VALIDATE_INT) : null;
} else {
    // Intentar obtener de POST si no es JSON (aunque se recomienda JSON para DELETE vía POST)
    $cod_cat = isset($_POST['cod_cat']) ? filter_var($_POST['cod_cat'], FILTER_VALIDATE_INT) : null;
}


if ($cod_cat === false || $cod_cat === null) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'El ID de la categoría para eliminar no es válido o falta.']);
    exit;
}

// --- Lógica de Eliminación (Considerar Productos Asociados) ---
// OPCIÓN 1: Eliminar categoría y poner productos asociados a NULL o categoría por defecto
// OPCIÓN 2: Impedir eliminación si hay productos asociados
// Implementaremos la OPCIÓN 2 por seguridad inicial.

// Verificar si hay productos asociados
$check_sql = "SELECT COUNT(*) as count FROM productos WHERE cod_cat = ?";
$check_stmt = $conexion->prepare($check_sql);
if ($check_stmt === false) {
    error_log("Error preparando la consulta CHECK productos: " . $conexion->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al verificar productos asociados.']);
    $conexion->close();
    exit;
}
$check_stmt->bind_param("i", $cod_cat);
$check_stmt->execute();
$check_result = $check_stmt->get_result();
$row = $check_result->fetch_assoc();
$product_count = $row['count'];
$check_stmt->close();

if ($product_count > 0) {
    http_response_code(409); // Conflict
    echo json_encode(['status' => 'error', 'message' => 'No se puede eliminar la categoría porque tiene productos asociados ('. $product_count .').']);
    $conexion->close();
    exit;
}

// --- Preparar y Ejecutar Eliminación ---
$sql = "DELETE FROM categorias WHERE cod_cat = ?";
$stmt = $conexion->prepare($sql);

if ($stmt === false) {
    error_log("Error preparando la consulta DELETE categorias: " . $conexion->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al preparar la eliminación en la base de datos.']);
    $conexion->close();
    exit;
}

// Vincular parámetros
$stmt->bind_param("i", $cod_cat);

// Ejecutar la consulta
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        http_response_code(200); // OK
        echo json_encode(['status' => 'success', 'message' => 'Categoría eliminada correctamente.']);
    } else {
        // No rows affected - category ID likely didn't exist
        http_response_code(404); // Not Found
        echo json_encode(['status' => 'error', 'message' => 'Error: No se encontró la categoría con el ID proporcionado para eliminar.']);
    }
} else {
    error_log("Error ejecutando DELETE categorias: " . $stmt->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar la categoría de la base de datos.']);
}

// Cerrar statement y conexión
$stmt->close();
$conexion->close();
?>