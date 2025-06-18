<?php
// --- CORS Headers ---
// Ajusta el origen si tu admin panel corre en un puerto diferente o dominio
header("Access-Control-Allow-Origin: http://localhost:3001"); // Permitir solicitudes desde el frontend de admin en puerto 3001
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}
// --- Fin CORS ---

header("Content-Type: application/json; charset=UTF-8");
error_reporting(0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../conexion.php'; // Conexión a la BD

// --- Validar Conexión ---
if ($conexion === null || $conexion->connect_error) {
    error_log("Error de conexión en cargar_categorias.php: " . ($conexion ? $conexion->connect_error : 'No se pudo crear objeto mysqli'));
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor (conexión BD).']);
    exit;
}

// --- Consultar Categorías ---
$categorias = [];
$sql = "SELECT cod_cat, nom_cat, desc_cat FROM categorias ORDER BY nom_cat ASC"; // Incluir desc_cat y ordenar alfabéticamente
$result = $conexion->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $categorias[] = $row;
    }
    $result->free();
    echo json_encode(['status' => 'success', 'categorias' => $categorias]);
} else {
    error_log("Error ejecutando SELECT categorias: " . $conexion->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error al obtener las categorías de la base de datos.']);
}

$conexion->close();
?>
