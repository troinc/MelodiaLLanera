<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // Ajusta en producción
header("Access-Control-Allow-Methods: POST, OPTIONS");
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
    error_log("Error de conexión en actualizar_categoria.php: Objeto mysqli nulo.");
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor (conexión BD nula).']);
    exit;
}
if ($conexion->connect_error) {
    error_log("Error de conexión en actualizar_categoria.php: " . $conexion->connect_error);
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
$cod_cat = isset($_POST['cod_cat_edit']) ? filter_var($_POST['cod_cat_edit'], FILTER_VALIDATE_INT) : null;
$nom_cat = isset($_POST['nom_cat']) ? trim($_POST['nom_cat']) : null;
$desc_cat = isset($_POST['desc_cat']) ? trim($_POST['desc_cat']) : ''; // Descripción es opcional

if ($cod_cat === false || $cod_cat === null) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'El ID de la categoría para editar no es válido o falta.']);
    exit;
}

if (empty($nom_cat)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'El nombre de la categoría es obligatorio.']);
    exit;
}

// --- Preparar y Ejecutar Actualización ---
$sql = "UPDATE categorias SET nom_cat = ?, desc_cat = ? WHERE cod_cat = ?";
$stmt = $conexion->prepare($sql);

if ($stmt === false) {
    error_log("Error preparando la consulta UPDATE categorias: " . $conexion->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al preparar la actualización en la base de datos.']);
    $conexion->close();
    exit;
}

// Vincular parámetros
$stmt->bind_param("ssi", $nom_cat, $desc_cat, $cod_cat);

// Ejecutar la consulta
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        http_response_code(200); // OK
        echo json_encode(['status' => 'success', 'message' => 'Categoría actualizada correctamente.']);
    } else {
        // No rows affected - could mean the data was the same or category ID didn't exist
        // Check if category exists to differentiate
        $check_sql = "SELECT cod_cat FROM categorias WHERE cod_cat = ?";
        $check_stmt = $conexion->prepare($check_sql);
        $check_stmt->bind_param("i", $cod_cat);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        if ($check_result->num_rows === 0) {
             http_response_code(404); // Not Found
             echo json_encode(['status' => 'error', 'message' => 'Error: No se encontró la categoría con el ID proporcionado.']);
        } else {
             http_response_code(200); // OK (even if no change, the request was valid)
             echo json_encode(['status' => 'success', 'message' => 'Categoría no modificada (datos iguales) o ya actualizada.']);
        }
        $check_stmt->close();
    }
} else {
    error_log("Error ejecutando UPDATE categorias: " . $stmt->error);
    http_response_code(500);
     // Verificar si es un error de duplicado (código 1062)
    if ($conexion->errno === 1062) {
         echo json_encode(['status' => 'error', 'message' => 'Error: Ya existe otra categoría con ese nombre.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al actualizar la categoría en la base de datos.']);
    }
}

// Cerrar statement y conexión
$stmt->close();
$conexion->close();
?>