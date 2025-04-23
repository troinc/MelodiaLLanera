<?php
header('Content-Type: application/json');
require_once '../conexion.php'; // Asegúrate de que la ruta a conexion.php sea correcta

$response = ['status' => 'error', 'message' => 'ID de producto no proporcionado.'];

if (isset($_GET['id'])) {
    $productId = $_GET['id'];
    $conn = CConexion::ConexionBD();

    if ($conn) {
        try {
            $sql = "SELECT cod_prod, nom_prod, desc_prod, precio_prod, stock_prod, cod_cat FROM productos WHERE cod_prod = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $productId, PDO::PARAM_STR);
            $stmt->execute();

            $product = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($product) {
                // Devolver todos los campos necesarios para el formulario
                $response = $product; // Devuelve directamente el array asociativo del producto
                // No establezcas 'status' aquí si devuelves directamente el producto
            } else {
                $response = ['status' => 'error', 'message' => 'Producto no encontrado.'];
            }
        } catch (PDOException $e) {
            $response = ['status' => 'error', 'message' => 'Error de base de datos: ' . $e->getMessage()];
        } finally {
            $conn = null; // Cerrar la conexión
        }
    } else {
        $response = ['status' => 'error', 'message' => 'Error al conectar con la base de datos.'];
    }
} else {
     $response = ['status' => 'error', 'message' => 'ID de producto no proporcionado en la solicitud GET.'];
}

echo json_encode($response);
?>