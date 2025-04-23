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
    $nombre = $data['nombre_usuario'] ?? '';
    $correo = $data['correo_electronico'] ?? '';
    $contrasena = $data['contrasena'] ?? '';
    $rol = $data['rol'] ?? 'cliente';
    
    // Validar datos
    if (empty($nombre) || empty($correo) || empty($contrasena)) {
        $response['message'] = 'Todos los campos son obligatorios';
        echo json_encode($response);
        exit;
    }
    
    // Hashear contraseña
    $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);
    
    // Insertar en la base de datos
    $query = "INSERT INTO clientes (nom_cli, ape_cli, email_cli, contrasena_cli, rol, estado) VALUES (?, ?, ?, ?, ?, 'activo')";
    $stmt = $conexion->prepare($query);
    
    // Separar nombre y apellido (asumiendo formato "Nombre Apellido")
    $partes = explode(' ', $nombre, 2);
    $nom_cli = $partes[0] ?? '';
    $ape_cli = $partes[1] ?? '';
    
    if ($stmt) {
        $stmt->bind_param("sssss", $nom_cli, $ape_cli, $correo, $contrasena_hash, $rol);
        
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