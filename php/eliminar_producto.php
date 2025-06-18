<?php
// TODO: Implementar verificación de sesión de administrador si es necesario
// session_start();
// if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
//     http_response_code(403); // Forbidden
//     echo json_encode(['status' => 'error', 'message' => 'Acceso no autorizado.']);
//     exit;
// }

// --- CORS Headers ---
// Ajusta el origen si tu admin panel corre en un puerto diferente o dominio
header("Access-Control-Allow-Origin: *"); // Permite cualquier origen (ajusta en producción)
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Permitir POST y OPTIONS
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
    error_log("Error de conexión en eliminar_producto.php: " . ($conexion ? $conexion->connect_error : 'No se pudo crear objeto mysqli'));
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor (conexión BD).']);
    exit;
}

// --- Validar Método HTTP ---
// Esperar método POST con cuerpo JSON, como se envía desde admin_script.js
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    $cod_prod = $data['cod_prod'] ?? null;
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido. Se esperaba POST.']);
    exit;
}


// --- Validar ID del Producto ---
if (empty($cod_prod)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Falta el código del producto a eliminar.']);
    exit;
}

// --- Obtener ruta de imagen ANTES de eliminar el registro ---
$ruta_imagen_a_borrar = null;
$sql_get_image = "SELECT imagen_prod FROM productos WHERE cod_prod = ?";
$stmt_get = $conexion->prepare($sql_get_image);
if ($stmt_get) {
    $stmt_get->bind_param("s", $cod_prod);
    if ($stmt_get->execute()) {
        $result_get = $stmt_get->get_result();
        if ($row = $result_get->fetch_assoc()) {
            if (!empty($row['imagen_prod'])) {
                $ruta_imagen_a_borrar = __DIR__ . '/../' . $row['imagen_prod']; // Ruta completa
            }
        }
    } else {
        error_log("Error ejecutando SELECT imagen_prod para eliminar: " . $stmt_get->error);
    }
    $stmt_get->close();
} else {
    error_log("Error preparando SELECT imagen_prod para eliminar: " . $conexion->error);
}

// --- Preparar y Ejecutar Eliminación en BD ---
$sql_delete = "DELETE FROM productos WHERE cod_prod = ?";
$stmt_delete = $conexion->prepare($sql_delete);

if (!$stmt_delete) {
    error_log("Error preparando DELETE productos: " . $conexion->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor al preparar consulta de eliminación.']);
    exit;
}

$stmt_delete->bind_param("s", $cod_prod);

if ($stmt_delete->execute()) {
    if ($stmt_delete->affected_rows > 0) {
        // Éxito al eliminar de la BD, ahora intentar borrar la imagen
        if ($ruta_imagen_a_borrar && file_exists($ruta_imagen_a_borrar)) {
            if (!unlink($ruta_imagen_a_borrar)) {
                error_log("Advertencia: Producto eliminado de BD, pero no se pudo borrar archivo de imagen: " . $ruta_imagen_a_borrar);
                // No fallar la respuesta por esto, pero registrarlo
            }
        }
        echo json_encode(['status' => 'success', 'message' => 'Producto eliminado exitosamente.']);
    } else {
        // No se encontró el producto o no se eliminó
        http_response_code(404); // Not Found
        echo json_encode(['status' => 'error', 'message' => 'Producto no encontrado o ya eliminado.']);
    }
} else {
    // Error al ejecutar DELETE (podría ser por restricciones FOREIGN KEY si hay compras asociadas)
    error_log("Error ejecutando DELETE productos para cod_prod $cod_prod: " . $stmt_delete->error);
    // Verificar si es error de FK
     if ($conexion->errno === 1451) { // Código de error común para FK constraint fails
         http_response_code(409); // Conflict
         echo json_encode(['status' => 'error', 'message' => 'No se puede eliminar el producto porque tiene compras asociadas.']);
     } else {
         http_response_code(500);
         echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor al eliminar el producto de la BD.']);
     }
}

$stmt_delete->close();
$conexion->close();
?>
