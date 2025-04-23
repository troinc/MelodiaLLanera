<?php
session_start();
include '../conexion.php';

header('Content-Type: application/json');

$reviews = [];
$status = 'success';
$message = 'Reseñas cargadas correctamente.';
$current_cod_cli = isset($_SESSION['cod_cli']) ? $_SESSION['cod_cli'] : null;

// Consulta para obtener reseñas con información del cliente y producto
$sql = "SELECT 
            r.cod_res AS id, 
            r.cod_prod AS productId, 
            p.nom_prod AS productName, 
            r.cod_cli, 
            c.nom_cli AS userName, 
            r.calif_res AS rating, 
            r.desc_res AS content 
            -- No hay columna de fecha en la tabla resenas
        FROM resenas r
        JOIN clientes c ON r.cod_cli = c.cod_cli
        LEFT JOIN productos p ON r.cod_prod = p.cod_prod -- LEFT JOIN por si cod_prod es NULL
        ORDER BY r.cod_res DESC"; // Ordenar por ID de reseña (o quitar ORDER BY)

// Ejecutar la consulta
$result = $conexion->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        // Determinar si la reseña es del usuario actual
        $row['isCurrentUser'] = ($current_cod_cli !== null && $row['cod_cli'] === $current_cod_cli);
        
        // Añadir un avatar placeholder
        $row['userAvatar'] = 'https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg'; // Placeholder

        // Convertir rating a número
        $row['rating'] = (int)$row['rating'];

        // Añadir fecha actual como placeholder ya que no hay fecha en BD
        $row['date'] = date('d M Y'); 

        $reviews[] = $row;
    }
    $result->free();
} else {
    $status = 'error';
    $message = 'Error al ejecutar la consulta: ' . $conexion->error;
}

$conexion->close();

// Devolver el resultado como JSON
echo json_encode(['status' => $status, 'message' => $message, 'reviews' => $reviews]);
?> 