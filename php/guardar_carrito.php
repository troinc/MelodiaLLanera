<?php
// --- CORS Headers ---
// Especifica el origen permitido. Cambia '*' por tu dominio específico en producción por seguridad.
// Para desarrollo con Live Server en 5500:
header("Access-Control-Allow-Origin: http://127.0.0.1:5500"); 
// O para cualquier origen (menos seguro, úsalo con precaución):
// header("Access-Control-Allow-Origin: *"); 

header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Cabeceras permitidas
header("Access-Control-Allow-Credentials: true"); // Permitir credenciales (cookies, sesiones)

// --- Manejo de solicitud OPTIONS (Preflight) ---
// El navegador envía una solicitud OPTIONS antes de POST/PUT/DELETE con ciertos headers o content-types
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // No procesar nada más, solo enviar las cabeceras CORS y salir.
    http_response_code(200); // OK
    exit;
}
// --- Fin CORS ---

include '../conexion.php';
require_once 'Carrito.php'; // *** AÑADIDO: Incluir la clase Carrito ***
ob_start();
session_start();
header('Content-Type: application/json'); // Asegúrate que esta línea esté DESPUÉS de session_start si usas sesiones
error_reporting(E_ALL);
ini_set('display_errors', 0); // Correcto para producción
ini_set('log_errors', 1); // Correcto para producción

// Verificar autenticación
if (!isset($_SESSION['cod_cli'])) {
    ob_clean();
    echo json_encode(['status' => 'error', 'message' => 'Usuario no autenticado.']);
    exit;
}

$cod_cli = $_SESSION['cod_cli'];

// Verificar que se envíe la información del carrito
if (!isset($_POST['carrito'])) {
    ob_clean();
    echo json_encode(['status' => 'error', 'message' => 'No se recibió la información del carrito.']);
    exit;
}

$cartData_json = $_POST['carrito'];
$cartData = json_decode($cartData_json, true);
if (json_last_error() !== JSON_ERROR_NONE || !is_array($cartData)) {
    ob_clean();
    error_log("Error decodificando JSON carrito para $cod_cli: " . json_last_error_msg());
    error_log("Datos recibidos: " . $cartData_json);
    echo json_encode(['status' => 'error', 'message' => 'Formato de carrito inválido. Error: ' . json_last_error_msg()]);
    exit;
}

$carrito = new Carrito($conexion);
$resultado = $carrito->saveCart($cod_cli, $cartData);

ob_clean();
if ($resultado === true) {
    echo json_encode(['success' => true, 'message' => 'Carrito guardado exitosamente']);
} else {
    echo json_encode(['success' => false, 'message' => $resultado]);
}
exit;
?>
