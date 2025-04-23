<?php
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
