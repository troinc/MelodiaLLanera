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
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // OK
    exit;
}
// --- Fin CORS ---

ob_start(); // Iniciar buffer para evitar salida accidental
session_start();
header("Content-Type: application/json; charset=UTF-8"); // Asegúrate que esta línea esté DESPUÉS de session_start si usas sesiones
error_reporting(E_ALL);
ini_set('display_errors', 0); // Correcto para producción
ini_set('log_errors', 1); // Correcto para producción

include '../conexion.php';
require_once 'Carrito.php'; // Cambiado a require_once por buena práctica

// --- DEBUG: Log de sesión ---
$session_status = session_status();
$session_id = session_id();
$session_cod_cli = isset($_SESSION['cod_cli']) ? $_SESSION['cod_cli'] : 'NO DEFINIDO';
error_log("[cargar_carrito] Estado Sesión: $session_status, ID Sesión: $session_id, cod_cli: $session_cod_cli");
// --- Fin DEBUG ---

// Verificar autenticación
if (!isset($_SESSION['cod_cli'])) {
    ob_clean();
    error_log("[cargar_carrito] Intento de carga sin autenticación."); // Log adicional
    echo json_encode(["status" => "error", "message" => "Usuario no autenticado"]);
    exit();
}

$cod_cli = $_SESSION['cod_cli']; // Obtener cod_cli DESPUÉS de verificar que existe
error_log("[cargar_carrito] Usuario autenticado: $cod_cli. Cargando carrito..."); // Log

$carrito = new Carrito($conexion);

// Obtener los ítems con estado 'EN_CARRITO'
$items = $carrito->getItems($cod_cli);

// --- DEBUG: Log de items obtenidos ---
if (is_array($items)) {
    error_log("[cargar_carrito] Items obtenidos para $cod_cli: " . count($items));
} else {
    error_log("[cargar_carrito] Error al obtener items para $cod_cli: " . $items); // $items contendrá el mensaje de error
}
// --- Fin DEBUG ---


// Obtener stock disponible para cada producto (Consulta preparada UNA SOLA VEZ)
$sql_stock = "SELECT cod_prod, stock_prod FROM productos WHERE cod_prod = ?";
$stmt_stock = $conexion->prepare($sql_stock);
if (!$stmt_stock) {
    ob_clean();
    // *** MEJORA: No exponer error de BD directamente ***
    error_log("Error DB preparando consulta stock en cargar_carrito.php: " . $conexion->error); // Loguear error real
    echo json_encode(["status" => "error", "message" => "Error al consultar disponibilidad del producto."]); // Mensaje genérico
    exit();
}

// Obtener stock disponible para cada producto
$sql_stock = "SELECT cod_prod, stock_prod FROM productos WHERE cod_prod = ?";
$stmt_stock = $conexion->prepare($sql_stock);
if (!$stmt_stock) {
    ob_clean();
    echo json_encode(["status" => "error", "message" => "Error al preparar consulta de stock: " . $conexion->error]);
    exit();
}

// Formatear los datos para el frontend
$carrito_data = array_map(function($item) use ($conexion, $stmt_stock) {
    // Obtener stock disponible del producto
    $stmt_stock->bind_param("s", $item["cod_prod"]);
    $stmt_stock->execute();
    $result_stock = $stmt_stock->get_result();
    $stock_disponible = 0; // Valor por defecto
    
    if ($row_stock = $result_stock->fetch_assoc()) {
        $stock_disponible = intval($row_stock["stock_prod"]);
    }
    
    return [
        "cod_prod" => $item["cod_prod"],
        "nombre" => $item["nom_prod"],
        "precio_unitario" => floatval($item["precio_unitario"]),
        "cantidad" => intval($item["cantidad"]),
        "stock_disponible" => $stock_disponible
    ];
}, $items);

// Cerrar el statement de stock
if (isset($stmt_stock)) {
    $stmt_stock->close();
}

ob_clean();
echo json_encode(["status" => "success", "carrito" => $carrito_data]);
exit;
?>
