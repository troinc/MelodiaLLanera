<?php
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "tienda_llanera"; 

$conexion = new mysqli($servername, $username, $password, $dbname);

if ($conexion->connect_error) {
    // En lugar de die(), enviar una respuesta JSON y terminar el script
    header('Content-Type: application/json');
    http_response_code(500); // Internal Server Error
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión: ' . $conexion->connect_error]);
    exit; // Terminar el script para evitar más salida
}

?>