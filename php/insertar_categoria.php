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
// Considera configurar una ruta específica para error_log en producción
// ini_set('error_log', '/ruta/a/tu/php-error.log');

require_once __DIR__ . '/../conexion.php'; // Conexión a la BD

// --- Validar Conexión ---
if ($conexion === null) {
    error_log("Error de conexión en insertar_categoria.php: Objeto mysqli nulo.");
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor (conexión BD nula).']);
    exit;
} 
if ($conexion->connect_error) {
    error_log("Error de conexión en insertar_categoria.php: " . $conexion->connect_error);
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
$input = json_decode(file_get_contents('php://input'), true);

$nom_cat = isset($input['nom_cat']) ? trim($input['nom_cat']) : null;
$desc_cat = isset($input['desc_cat']) ? trim($input['desc_cat']) : ''; // Descripción es opcional

if (empty($nom_cat)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'El nombre de la categoría es obligatorio.']);
    exit;
}

// --- Preparar y Ejecutar Inserción ---
$sql = "INSERT INTO categorias (nom_cat, desc_cat) VALUES (?, ?)";
$stmt = $conexion->prepare($sql);

if ($stmt === false) {
    error_log("Error preparando la consulta INSERT categorias: " . $conexion->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al preparar la inserción en la base de datos.']);
    $conexion->close();
    exit;
}

// Vincular parámetros
$stmt->bind_param("ss", $nom_cat, $desc_cat);

// Ejecutar la consulta
if ($stmt->execute()) {
    $new_category_id = $stmt->insert_id; // Obtener el ID de la categoría insertada
    http_response_code(201); // Created
    echo json_encode(['status' => 'success', 'message' => 'Categoría añadida correctamente.', 'cod_cat' => $new_category_id]);
} else {
    error_log("Error ejecutando INSERT categorias: " . $stmt->error);
    http_response_code(500);
    // Verificar si es un error de duplicado (código 1062)
    if ($conexion->errno === 1062) {
         echo json_encode(['status' => 'error', 'message' => 'Error: Ya existe una categoría con ese nombre.']);
    } else {
         echo json_encode(['status' => 'error', 'message' => 'Error al añadir la categoría a la base de datos.']);
    }
}

// Cerrar statement y conexión
$stmt->close();
$conexion->close();
?>