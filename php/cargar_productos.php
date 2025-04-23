<?php
// Script para cargar todos los productos para el panel de administración

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
include __DIR__ . '/../conexion.php'; // Usar ruta basada en __DIR__

if ($conexion === null || $conexion->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión a la base de datos.']);
    exit;
}

$productos = [];
$sql = "SELECT cod_prod, nom_prod, desc_prod, precio_prod, stock_prod, cod_cat FROM productos ORDER BY nom_prod ASC";
$result = $conexion->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        // Mapear nombres de columnas a los esperados por admin.js
        $productos[] = [
            'id' => $row['cod_prod'],       // cod_prod -> id
            'name' => $row['nom_prod'],     // nom_prod -> name
            'description' => $row['desc_prod'], // desc_prod -> description (añadido por si se usa)
            'price' => floatval($row['precio_prod']), // precio_prod -> price (convertir a número)
            'stock' => intval($row['stock_prod']),   // stock_prod -> stock (convertir a entero)
            'category' => $row['cod_cat']   // cod_cat -> category
        ];
    }
    $result->free();
    echo json_encode($productos); // Devolver el array de productos como JSON
} else {
    http_response_code(500); // Internal Server Error
    error_log("Error al ejecutar consulta en cargar_productos.php: " . $conexion->error);
    echo json_encode(['status' => 'error', 'message' => 'Error al obtener los productos.']);
}

$conexion->close();
?>
