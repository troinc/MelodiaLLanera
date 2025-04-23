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
            $query = "SELECT r.*, c.nom_cli, p.nom_prod 
                     FROM resenas r
                     LEFT JOIN clientes c ON r.cod_cli = c.cod_cli
                     LEFT JOIN productos p ON r.cod_prod = p.cod_prod";
            $stmt = $conexion->prepare($query);
            $stmt->execute();
            $result = $stmt->get_result();
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
            break;

        case 'POST':
            $stmt = $conexion->prepare("INSERT INTO resenas (cod_cli, cod_prod, texto_res, calificacion) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("iisi", 
                $input['cliente_id'],
                $input['producto_id'],
                $input['texto'],
                $input['calificacion']
            );
            $stmt->execute();
            echo json_encode(['id' => $stmt->insert_id]);
            break;

        case 'PUT':
            $stmt = $conexion->prepare("UPDATE resenas SET texto_res = ?, calificacion = ? WHERE cod_res = ?");
            $stmt->bind_param("sii",
                $input['texto'],
                $input['calificacion'],
                $input['id']
            );
            $stmt->execute();
            echo json_encode(['success' => true]);
            break;

        case 'DELETE':
            $stmt = $conexion->prepare("DELETE FROM resenas WHERE cod_res = ?");
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