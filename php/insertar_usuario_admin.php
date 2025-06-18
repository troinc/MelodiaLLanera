<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../conexion.php';

$response = ['status' => 'error', 'message' => 'Error al insertar usuario.'];

$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    // $nombre = $data['nombre_usuario'] ?? ''; // Removed nombre
    $correo = $data['correo_electronico'] ?? '';
    $contrasena = $data['contrasena'] ?? '';
    $rol = $data['rol'] ?? 'cliente'; // Default to 'cliente' if not provided
    
    // Validar datos (removed nombre check)
    if (empty($correo) || empty($contrasena)) {
        $response['message'] = 'Correo electrónico y contraseña son obligatorios';
        echo json_encode($response);
        exit;
    }
    
    // Hashear contraseña
    $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);
    
    // Insertar en la base de datos (removed nom_cli, ape_cli)
    // Assuming nom_cli and ape_cli can be NULL or have default values in the DB
    $query = "INSERT INTO clientes (email_cli, contrasena_cli, rol, estado) VALUES (?, ?, ?, 'activo')";
    $stmt = $conexion->prepare($query);
    
    // Removed nombre/apellido separation
    
    if ($stmt) {
        // Adjusted bind_param types and variables
        $stmt->bind_param("sss", $correo, $contrasena_hash, $rol);
        
        if ($stmt->execute()) {
            $response = ['status' => 'success', 'message' => 'Usuario creado correctamente'];
        } else {
            $response['message'] = 'Error al ejecutar la consulta: ' . $stmt->error;
        }
        $stmt->close();
    } else {
        $response['message'] = 'Error al preparar la consulta: ' . $conexion->error;
    }
} else {
    $response['message'] = 'Datos no recibidos correctamente';
}

echo json_encode($response);
?>