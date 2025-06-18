<?php
// Habilitar reporte de errores para depuración (eliminar en producción)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
// Permitir explícitamente el origen del frontend
header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// Permitir credenciales si fueran necesarias en el futuro
// header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../conexion.php';

$response = ['status' => 'error', 'message' => 'Error inicial al cargar usuarios.'];

// Verificar la conexión a la base de datos
if ($conexion->connect_error) {
    $response['message'] = 'Error de conexión: ' . $conexion->connect_error;
} else {
    // La conexión es exitosa, proceder con la consulta
    // Seleccionar solo las columnas existentes en la tabla clientes
    $query = "SELECT cod_cli, nom_cli, ape_cli, email_cli FROM clientes";
    $result = $conexion->query($query);

    if ($result) {
        $usuarios = [];
        while ($row = $result->fetch_assoc()) {
            $usuarios[] = $row;
        }
        $response = ['status' => 'success', 'usuarios' => $usuarios];
    } else {
        $response['message'] = 'Error en la consulta: ' . $conexion->error;
    }
    $conexion->close(); // Cerrar la conexión
}

echo json_encode($response);
?>