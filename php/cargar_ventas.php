<?php
// Habilitar reporte de errores para depuración (eliminar en producción)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// --- CORS Headers ---
header("Access-Control-Allow-Origin: http://localhost:3001"); // Permitir solicitudes desde el frontend de admin en puerto 3001
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}
// --- Fin CORS ---

header('Content-Type: application/json');
require_once '../conexion.php'; // Asegúrate de que la ruta a conexion.php sea correcta

$response = ['status' => 'error', 'message' => 'Error al cargar ventas.'];

$conn = CConexion::ConexionBD();

if ($conn) {
    try {
        // Consulta para obtener ventas con nombres de cliente y producto
        $sql = "SELECT 
                    c.num_ped, 
                    c.fec_compra, 
                    c.estado_ped, 
                    cl.nom_cli, 
                    cl.ape_cli, 
                    p.nom_prod, 
                    c.cantidad, 
                    c.precio_unitario, 
                    (c.cantidad * c.precio_unitario) AS total_venta
                FROM compras c
                LEFT JOIN clientes cl ON c.cod_cli = cl.cod_cli
                LEFT JOIN productos p ON c.cod_prod = p.cod_prod
                ORDER BY c.fec_compra DESC"; // Ordenar por fecha descendente
        
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($ventas !== false) {
            $response = ['status' => 'success', 'ventas' => $ventas];
        } else {
            // No se encontraron ventas, devolver éxito con array vacío
            $response = ['status' => 'success', 'ventas' => []]; 
        }
    } catch (PDOException $e) {
        $response['message'] = 'Error de base de datos: ' . $e->getMessage();
    } finally {
        $conn = null; // Cerrar la conexión
    }
} else {
    $response['message'] = 'Error al conectar con la base de datos.';
}

echo json_encode($response);
?>