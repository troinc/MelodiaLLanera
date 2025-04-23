<?php
header('Content-Type: application/json');

// Incluir archivo de conexión a la base de datos
require_once 'conexion.php';

// Obtener datos del POST
$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? null;

// Validar entrada
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Correo electrónico inválido o no proporcionado.']);
    exit;
}

// Crear conexión
$conexion = conectarBD();

if (!$conexion) {
    echo json_encode(['status' => 'error', 'message' => 'Error al conectar con la base de datos.']);
    exit;
}

// Preparar la consulta SQL para actualizar el rol del usuario
// Asegúrate de que la tabla y las columnas ('usuarios', 'email_usu', 'rol_usu') sean correctas
$sql = "UPDATE usuarios SET rol_usu = 'admin' WHERE email_usu = ?";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Error al preparar la consulta: ' . $conexion->error]);
    $conexion->close();
    exit;
}

// Vincular parámetros
$stmt->bind_param("s", $email);

// Ejecutar la consulta
if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Rol de administrador otorgado correctamente a ' . $email]);
    } else {
        // Verificar si el usuario existe
        $checkSql = "SELECT cod_usu FROM usuarios WHERE email_usu = ?";
        $checkStmt = $conexion->prepare($checkSql);
        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        if ($checkResult->num_rows === 0) {
            echo json_encode(['status' => 'error', 'message' => 'Usuario con el correo ' . $email . ' no encontrado.']);
        } else {
             // El usuario existe pero ya podría ser admin o hubo otro problema
            echo json_encode(['status' => 'warning', 'message' => 'No se realizaron cambios. El usuario ya podría ser administrador o no se encontró.']);
        }
        $checkStmt->close();
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al ejecutar la consulta: ' . $stmt->error]);
}

// Cerrar statement y conexión
$stmt->close();
$conexion->close();

?>