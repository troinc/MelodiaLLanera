<?php
session_start();
header('Content-Type: application/json');
// Asegúrate que la ruta a conexion.php sea correcta desde la carpeta php
include '../conexion.php';

// Verificar autenticación
if (!isset($_SESSION['cod_cli'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado.']);
    exit;
}
$cod_cli = $_SESSION['cod_cli'];

// Verificar la conexión después de incluir
if ($conexion->connect_error) {
    error_log("Error de conexión en guardar_compra.php: " . $conexion->connect_error);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor (conexión DB).']);
    exit;
}

// Obtener datos del carrito desde el cuerpo de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['items']) || !is_array($data['items']) || empty($data['items'])) {
    echo json_encode(['success' => false, 'message' => 'Datos del carrito inválidos o vacíos.']);
    exit;
}

$items_comprados = $data['items']; // Items que se están comprando
$estado_pendiente = 'PENDIENTE';
$estado_completado = 'COMPLETADO'; // O el estado que uses para compras reales

// Iniciar transacción
$conexion->begin_transaction();

try {
    // 1. Borrar el carrito pendiente existente del usuario en la tabla 'compras'
    $sql_delete_pending = "DELETE FROM compras WHERE cod_cli = ? AND estado_ped = ?";
    $stmt_delete = $conexion->prepare($sql_delete_pending);
    if (!$stmt_delete) {
        throw new Exception("Error al preparar borrado de carrito pendiente: " . $conexion->error);
    }
    $stmt_delete->bind_param('ss', $cod_cli, $estado_pendiente);
    if (!$stmt_delete->execute()) {
        throw new Exception("Error al borrar carrito pendiente: " . $stmt_delete->error);
    }
    $stmt_delete->close();

    // 2. Insertar los items comprados como compras reales en la tabla 'compras'
    // Asegúrate que los nombres de columna coincidan EXACTAMENTE con tu tabla `compras`
    $sql_insert_compra = "INSERT INTO compras (num_ped, fec_compra, estado_ped, cod_cli, cod_prod, cantidad, precio_unitario) VALUES (?, CURDATE(), ?, ?, ?, ?, ?)";
    $stmt_insert = $conexion->prepare($sql_insert_compra);
    if (!$stmt_insert) {
        throw new Exception("Error al preparar inserción de compra: " . $conexion->error);
    }

    // Generar un número de pedido único para esta compra
    $num_ped_compra = uniqid('order_' . $cod_cli . '_');

    foreach ($items_comprados as $item) {
        // Ajustar claves según lo enviado por script.js: id_prod, cantidad_com, precio_com
        if (!isset($item['id_prod']) || !isset($item['cantidad_com']) || !isset($item['precio_com']) || !is_numeric($item['cantidad_com']) || $item['cantidad_com'] <= 0 || !is_numeric($item['precio_com'])) {
             error_log("Item de compra inválido omitido para $cod_cli: " . json_encode($item));
             continue; // Omitir item inválido
        }
        $cod_prod = $item['id_prod'];
        $cantidad = intval($item['cantidad_com']);
        $precio_unitario = floatval($item['precio_com']); // Precio que viene del frontend

        // Insertar con el estado "COMPLETADO"
        $stmt_insert->bind_param('ssssid', $num_ped_compra, $estado_completado, $cod_cli, $cod_prod, $cantidad, $precio_unitario);
        if (!$stmt_insert->execute()) {
             if ($conexion->errno == 1062) {
                 throw new Exception("Error de clave duplicada al generar num_ped para compra (prod: $cod_prod): " . $stmt_insert->error);
             } else {
                throw new Exception("Error al insertar item de compra (prod: $cod_prod): " . $stmt_insert->error);
             }
        }
    }
    $stmt_insert->close();

    // Si todo fue bien, confirmar transacción
    $conexion->commit();
    echo json_encode(['success' => true, 'message' => 'Compra guardada correctamente.', 'num_ped' => $num_ped_compra]);

} catch (Exception $e) {
    // Si hubo algún error, revertir transacción
    $conexion->rollback();
    error_log("Error al guardar compra para $cod_cli: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error al procesar la compra.', 'error' => $e->getMessage()]);

} finally {
    // Cerrar la conexión
    if (isset($conexion) && $conexion->ping()) {
        $conexion->close();
    }
}
?>
