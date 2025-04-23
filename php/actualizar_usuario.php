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

$response = ['status' => 'error', 'message' => 'Error al actualizar usuario.'];

$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    $id = $data['id_usuario'] ?? '';
    $nombre = $data['nombre_usuario'] ?? '';
    $correo = $data['correo_electronico'] ?? '';
    $contrasena = $data['contrasena'] ?? '';
    $rol = $data['rol'] ?? 'cliente';
    $estado = $data['estado'] ?? 'activo';
    
    // Validar datos
    if (empty($id) || empty($nombre) || empty($correo)) {
        $response['message'] = 'ID, nombre y correo son obligatorios';
        echo json_encode($response);
        exit;
    }
    
    // Separar nombre y apellido (asumiendo formato "Nombre Apellido")
    $partes = explode(' ', $nombre, 2);
    $nom_cli = $partes[0] ?? '';
    $ape_cli = $partes[1] ?? '';
    
    // Preparar consulta SQL
    $query = "UPDATE clientes SET nom_cli = ?, ape_cli = ?, email_cli = ?, rol = ?, estado = ?";
    $params = [$nom_cli, $ape_cli, $correo, $rol, $estado];
    
    // Si hay contraseña, actualizarla
    if (!empty($contrasena)) {
        $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);
        $query .= ", contrasena_cli = ?";
        $params[] = $contrasena_hash;
    }
    
    $query .= " WHERE cod_cli = ?";
    $params[] = $id;
    
    $stmt = $conexion->prepare($query);
    
    if ($stmt) {
        $types = str_repeat('s', count($params));
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
            $response = ['status' => 'success', 'message' => 'Usuario actualizado correctamente'];
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