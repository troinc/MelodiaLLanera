<?php
// Asegurar que la respuesta sea siempre JSON
header('Content-Type: application/json');
// Suprimir errores HTML de PHP para evitar romper el JSON
ini_set('display_errors', 0);
error_reporting(0);

header("Access-Control-Allow-Origin: *"); // Considera restringir esto en producción
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$response = ['status' => 'error', 'message' => 'Error inicial al procesar la solicitud.'];

try {
    require_once __DIR__ . '/../conexion.php';

    // Verificar conexión después de incluir
    if ($conexion->connect_error) {
        throw new Exception('Error de conexión: ' . $conexion->connect_error);
    }

    $data = json_decode(file_get_contents('php://input'), true);

    if ($data) {
    $id = $data['id_usuario'] ?? '';
    // $nombre = $data['nombre_usuario'] ?? ''; // Removed nombre
    $correo = $data['correo_electronico'] ?? '';
    $contrasena = $data['contrasena'] ?? '';
    // $rol = $data['rol'] ?? 'cliente'; // Removed rol
    // $estado = $data['estado'] ?? 'activo'; // Removed estado
    
    // Validar datos (removed nombre check)
    if (empty($id) || empty($correo)) {
        $response['message'] = 'ID y correo son obligatorios';
        echo json_encode($response);
        exit;
    }
    
    // Removed nombre/apellido separation
    
    // Preparar consulta SQL (removed nom_cli, ape_cli, rol, estado)
    $query = "UPDATE clientes SET email_cli = ?";
    $params = [$correo];
    
    // Si hay contraseña, actualizarla
    if (!empty($contrasena)) {
        $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);
        $query .= ", password = ?";
        $params[] = $contrasena_hash;
    }
    
    $query .= " WHERE cod_cli = ?";
    $params[] = $id;
    
    $stmt = $conexion->prepare($query);
    
    if ($stmt) {
        // Adjust types string based on remaining params + potential password + id
        $types = 's'; // For email
        if (!empty($contrasena)) {
            $types .= 's'; // Add type for password
        }
        $types .= 's'; // Add type for id
        
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
    $conexion->close(); // Cerrar conexión
} else {
    $response['message'] = 'Datos no recibidos o incompletos.';
}

} catch (Exception $e) {
    // Capturar cualquier excepción (incluyendo errores de conexión o consulta)
    http_response_code(500); // Internal Server Error
    $response['status'] = 'error';
    $response['message'] = 'Error interno del servidor: ' . $e->getMessage();
}

echo json_encode($response);
?>