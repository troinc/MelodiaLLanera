<?php
// Script para cargar todos los productos para el panel de administración

// Desactivar la visualización de errores y activar el registro de errores
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// --- CORS Headers ---
// Ajusta el origen si tu admin panel corre en un puerto diferente o dominio
header("Access-Control-Allow-Origin: *"); // Permite cualquier origen (ajusta en producción)
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}
// --- Fin CORS ---

header('Content-Type: application/json');

try {
    include __DIR__ . '/../conexion.php'; // Usar ruta basada en __DIR__

    if ($conexion === null || $conexion->connect_error) {
        error_log("Error de conexión a la base de datos en cargar_productos.php: " . ($conexion ? $conexion->connect_error : 'Conexión es null'));
        http_response_code(500); // Internal Server Error
        echo json_encode(['status' => 'error', 'message' => 'Error de conexión a la base de datos.']);
        exit;
    }
    error_log("Conexión a BD exitosa en cargar_productos.php."); // Log de conexión exitosa

    $productos = [];
    $sql = "SELECT p.cod_prod, p.nom_prod, p.desc_prod, p.precio_prod, p.stock_prod, p.cod_cat, c.nom_cat, p.imagen_prod, p.estado FROM productos p LEFT JOIN categorias c ON p.cod_cat = c.cod_cat ORDER BY p.nom_prod ASC";
    $result = $conexion->query($sql);

    if (!$result) {
        error_log("Error al ejecutar consulta SQL en cargar_productos.php: " . $conexion->error);
        http_response_code(500); // Internal Server Error
        echo json_encode(['status' => 'error', 'message' => 'Error al ejecutar la consulta SQL: ' . $conexion->error]);
        exit;
    }

    while ($row = $result->fetch_assoc()) {
        $productos[] = [
            'cod_prod' => $row['cod_prod'],
            'nom_prod' => $row['nom_prod'],
            'desc_prod' => $row['desc_prod'],
            'precio_prod' => $row['precio_prod'],
            'stock_prod' => $row['stock_prod'],
            'nom_cat' => $row['nom_cat'],
            'cod_cat' => $row['cod_cat'],
            // Devolver una URL de Placehold.co para visualizar el diseño con imágenes
            // Devolver una URL de via.placeholder.com para visualizar el diseño con imágenes
            'imagen_prod' => $row['imagen_prod'],
            'estado' => $row['estado']
        ];
    }
    $result->free();

    echo json_encode(['status' => 'success', 'productos' => $productos]);

} catch (Throwable $e) {
    // Capturar cualquier excepción o error Throwable
    error_log("Error Throwable en cargar_productos.php: " . $e->getMessage() . " en " . $e->getFile() . " línea " . $e->getLine());
    http_response_code(500); // Internal Server Error
    echo json_encode(['status' => 'error', 'message' => 'Ocurrió un error inesperado en el servidor.']);
} finally {
    // Asegurarse de cerrar la conexión si existe
    if (isset($conexion) && $conexion !== null) {
        $conexion->close();
    }
}
?>

