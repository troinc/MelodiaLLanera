<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
error_reporting(0); // Desactivar reportes de errores directos en producción
ini_set('log_errors', 1); // Asegurar que los errores se registren

require_once __DIR__ . '/../conexion.php'; // Usar ruta más robusta

// Verificar conexión
if ($conexion === null || $conexion->connect_error) {
    error_log("Error de conexión en get_user_data.php: " . ($conexion ? $conexion->connect_error : 'No se pudo crear el objeto mysqli'));
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor.']);
    exit;
}

// Verificar que el usuario esté autenticado
if (!isset($_SESSION['cod_cli'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["status" => "error", "message" => "Usuario no autenticado"]);
    exit();
}

$cod_cli = $_SESSION['cod_cli'];

// Consultar el email del cliente
$sql = "SELECT email_cli FROM clientes WHERE cod_cli = ?";
$stmt = $conexion->prepare($sql);

if (!$stmt) {
    error_log("Error preparando consulta SELECT email_cli: " . $conexion->error);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error al procesar la solicitud."]);
    exit();
}

$stmt->bind_param("s", $cod_cli);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    if ($user = $result->fetch_assoc()) {
        // Éxito, devolver el email
        echo json_encode(["status" => "success", "email" => $user['email_cli']]);
    } else {
        // Usuario no encontrado (raro si la sesión existe)
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado."]);
    }
} else {
    // Error al ejecutar la consulta
    error_log("Error ejecutando SELECT email_cli para cod_cli $cod_cli: " . $stmt->error);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "No se pudo obtener la información del usuario."]);
}

$stmt->close();
$conexion->close();
?>
