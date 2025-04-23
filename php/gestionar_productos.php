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
            $query = "SELECT p.*, c.nom_cat FROM productos p
                     LEFT JOIN categorias c ON p.cod_cat = c.cod_cat";
            $stmt = $conexion->prepare($query);
            $stmt->execute();
            $result = $stmt->get_result();
            echo json_encode($result->fetch_all(MYSQLI_ASSOC));
            break;

        case 'POST':
            $stmt = $conexion->prepare("INSERT INTO productos (nom_prod, desc_prod, precio_prod, stock_prod, cod_cat) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("ssdii", 
                $input['nombre'],
                $input['descripcion'],
                $input['precio'],
                $input['stock'],
                $input['categoria_id']
            );
            $stmt->execute();
            echo json_encode(['id' => $stmt->insert_id]);
            break;

        case 'PUT':
            $stmt = $conexion->prepare("UPDATE productos SET 
                nom_prod = ?, 
                desc_prod = ?, 
                precio_prod = ?, 
                stock_prod = ?, 
                cod_cat = ? 
                WHERE cod_prod = ?");
            $stmt->bind_param("ssdiii",
                $input['nombre'],
                $input['descripcion'],
                $input['precio'],
                $input['stock'],
                $input['categoria_id'],
                $input['id']
            );
            $stmt->execute();
            echo json_encode(['success' => true]);
            break;

        case 'DELETE':
            $stmt = $conexion->prepare("DELETE FROM productos WHERE cod_prod = ?");
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