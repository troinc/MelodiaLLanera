<?php
session_start();
include 'conexion.php';

// Verificar que la petición sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: http://localhost/InstrumentosLLaneros/Tienda_llanera/html/login.html");
    exit;
}

// Obtener y limpiar los datos enviados desde el formulario
$email_cli = trim($_POST['email_cli'] ?? '');
$password  = trim($_POST['password'] ?? '');

// Verificar que se hayan enviado ambos campos
if (empty($email_cli) || empty($password)) {
    echo "<script>
            alert('Debe ingresar correo y contraseña.');
            window.location.href = 'http://localhost/InstrumentosLLaneros/Tienda_llanera/html/login.html';
          </script>";
    exit;
}

// Preparar la consulta para obtener el usuario por correo
$sql = "SELECT cod_cli, password, rol FROM clientes WHERE email_cli = ?"; // Añadir 'rol' a la consulta
$stmt = $conexion->prepare($sql);
if (!$stmt) {
    echo "<script>
            alert('Error en la consulta: " . $conexion->error . "');
            window.location.href = 'http://localhost/InstrumentosLLaneros/Tienda_llanera/html/login.html';
          </script>";
    exit;
}
$stmt->bind_param("s", $email_cli);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    // Comparar el password ingresado con el encriptado en BD
    if (password_verify($password, $user['password'])) {
        // Guardar el id del cliente en sesión
        $_SESSION['cod_cli'] = $user['cod_cli'];
        $_SESSION['user_role'] = $user['rol']; // Guardar el rol en la sesión
        echo "<script>
                alert('Inicio de sesión exitoso.');
                window.location.href = 'http://localhost/InstrumentosLLaneros/home/home.htm';
              </script>";
    } else {
        echo "<script>
                alert('Correo o contraseña incorrectos.');
                window.location.href = 'http://localhost/InstrumentosLLaneros/Tienda_llanera/html/login.html';
              </script>";
    }
} else {
    echo "<script>
            alert('Correo o contraseña incorrectos.');
            window.location.href = 'http://localhost/InstrumentosLLaneros/Tienda_llanera/html/login.html';
          </script>";
}

$stmt->close();
$conexion->close();
?>
