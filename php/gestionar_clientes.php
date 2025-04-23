<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

include __DIR__ . '/../conexion.php';

if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $stmt = $conexion->prepare("SELECT cod_cli, nom_cli, email_cli, tlf_cli, dir_cli, fecha_registro FROM clientes");
            $stmt->execute();
            $result = $stmt->get_result();
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
            break;

        case 'POST':
            $stmt = $conexion->prepare("INSERT INTO clientes (nom_cli, email_cli, tlf_cli, dir_cli) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", 
                $input['nombre'],
                $input['email'],
                $input['telefono'],
                $input['direccion']
            );
            $stmt->execute();
            echo json_encode(['id' => $stmt->insert_id]);
            break;

        case 'PUT':
            $stmt = $conexion->prepare("UPDATE clientes SET nom_cli = ?, email_cli = ?, tlf_cli = ?, dir_cli = ? WHERE cod_cli = ?");
            $stmt->bind_param("ssssi",
                $input['nombre'],
                $input['email'],
                $input['telefono'],
                $input['direccion'],
                $input['id']
            );
            $stmt->execute();
            echo json_encode(['success' => true]);
            break;

        case 'DELETE':
            $stmt = $conexion->prepare("DELETE FROM clientes WHERE cod_cli = ?");
            $stmt->bind_param("i", $input['id']);
            $stmt->execute();
            echo json_encode(['success' => true]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error: ' . $e->getMessage()]);
}

$conexion->close();
?>