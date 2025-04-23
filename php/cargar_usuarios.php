<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../conexion.php';

$response = ['status' => 'error', 'message' => 'Error al cargar usuarios.'];

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
} else {
    $response['message'] = 'Error al conectar con la base de datos.';
}

echo json_encode($response);
?>