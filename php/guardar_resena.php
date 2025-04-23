<?php
// include '../conexion.php'; // Eliminado - Duplicado
session_start();
header("Content-Type: application/json; charset=UTF-8");
error_reporting(E_ALL);
ini_set('display_errors', 0); // Mantener ocultos en producción
ini_set('log_errors', 1); // Asegurarse que los errores se registren

require_once __DIR__ . '/../conexion.php'; // Usar ruta más robusta

// Verificar conexión
if ($conexion === null || $conexion->connect_error) {
    error_log("Error de conexión en guardar_resena.php: " . ($conexion ? $conexion->connect_error : 'No se pudo crear el objeto mysqli'));
    http_response_code(500); // Internal Server Error
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor.']);
    exit;
}

// Verificar que el usuario esté autenticado
if (!isset($_SESSION['cod_cli'])) {
    echo json_encode(["status" => "error", "message" => "Usuario no autenticado"]);
    exit();
}

// Recibir los datos JSON de la reseña enviada desde el frontend
$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["status" => "error", "message" => "Datos de reseña inválidos."]);
    exit();
}

// Validar campos requeridos (por ejemplo, producto, rating, contenido, etc.)
if(!isset($data['productId'], $data['rating'], $data['content'])) {
    echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios para la reseña."]);
    exit();
}

$cod_cli = $_SESSION['cod_cli'];
$productId = $data['productId'] ?? null; // Permitir producto opcional (NULL)
$rating = intval($data['rating']); // Asegurar que sea entero
$content = $data['content'];
$cod_res = uniqid('res_'); // Generar ID único para la reseña

// *** CORRECCIÓN: Usar nombres de columna correctos (calif_res, desc_res) y ajustar parámetros ***
// Incluir cod_res en la inserción
$sql = "INSERT INTO resenas (cod_res, cod_cli, cod_prod, calif_res, desc_res) VALUES (?, ?, ?, ?, ?)";
$stmt = $conexion->prepare($sql);
if(!$stmt) {
    // *** MEJORA: No exponer error de BD ***
    error_log("Error preparando consulta INSERT resenas: " . $conexion->error);
    echo json_encode(["status" => "error", "message" => "Error al procesar la solicitud."]);
    exit();
}

// *** CORRECCIÓN: Ajustar tipos en bind_param (s para cod_res, s para cod_cli, s para cod_prod, i para calif_res, s para desc_res) ***
$stmt->bind_param("sssis", $cod_res, $cod_cli, $productId, $rating, $content);

if ($stmt->execute()) {
    // Éxito
    if($stmt->affected_rows > 0) {
        echo json_encode(["status" => "success", "message" => "Reseña guardada exitosamente."]);
    } else {
        // No hubo error, pero no se insertó (raro en INSERT, podría pasar en UPDATE)
        error_log("INSERT en resenas no afectó filas para cod_cli: $cod_cli");
        echo json_encode(["status" => "error", "message" => "No se pudo guardar la reseña (affected_rows = 0)."]);
    }
} else {
    // Error al ejecutar
    error_log("Error ejecutando INSERT resenas para cod_cli $cod_cli: " . $stmt->error);
    echo json_encode(["status" => "error", "message" => "No se pudo guardar la reseña."]);
}

$stmt->close();
$conexion->close();
?>
