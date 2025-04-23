<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
include '../conexion.php';

if (!isset($_SESSION['cod_cli'])) {
    echo json_encode(["status" => "error", "message" => "Usuario no autenticado"]);
    exit();
}

$cod_cli = $_SESSION['cod_cli'];
$sql = "SELECT c.id_compra, c.cod_prod, c.cantidad, c.precio, c.fec_compra, p.nom_prod, p.desc_prod 
        FROM compras c 
        INNER JOIN productos p ON c.cod_prod = p.cod_prod 
        WHERE c.cod_cli = ? 
        ORDER BY c.fec_compra DESC";
$stmt = $conexion->prepare($sql);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Error en la consulta: ".$conexion->error]);
    exit();
}
$stmt->bind_param("i", $cod_cli);
$stmt->execute();
$result = $stmt->get_result();
$compras = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(["status" => "success", "compras" => $compras]);
$stmt->close();
$conexion->close();
?>
