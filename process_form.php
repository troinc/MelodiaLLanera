<?php
include 'conexion.php';
$nom_cli   = $_POST['nom_cli'];
$ape_cli   = $_POST['ape_cli'];
$email_cli = $_POST['email_cli'];
$password  = $_POST['password'];

// Validar que la contraseña tenga al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo
if(!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/', $password)) {
    echo "<script>
            alert('La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y un símbolo.');
            window.location.href = 'http://localhost/InstrumentosLLaneros/register.php';
          </script>";
    exit;
}
// Validar que el correo tenga un formato correcto (aunque el pattern en el input ya ayuda)
if(!filter_var($email_cli, FILTER_VALIDATE_EMAIL)) {
    echo "<script>
            alert('El correo no es válido, intentelo de nuevo.');
            window.location.href = 'http://localhost/InstrumentosLLaneros/register.php';
          </script>";
    exit;
}

// Verifica si el correo ya existe
$query_check = "SELECT * FROM clientes WHERE email_cli = '$email_cli'";
$result = mysqli_query($conexion, $query_check);
if(mysqli_num_rows($result) > 0){
    echo "<script>
            alert('El correo ya está registrado.');
            window.location.href = 'http://localhost/InstrumentosLLaneros/register.php';
          </script>";
    exit;
}

// Genera un código único para el cliente
$cod_cli = uniqid('cli_');

// Encriptar la contraseña
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Inserta la nueva cuenta con la contraseña encriptada
$query = "INSERT INTO clientes (cod_cli, nom_cli, ape_cli, email_cli, password)
          VALUES ('$cod_cli', '$nom_cli', '$ape_cli', '$email_cli', '$hashed_password')";
$ejecutar = mysqli_query($conexion, $query);
if($ejecutar){
    echo "<script>
            alert('Cuenta creada exitosamente. Redirigiendo a Iniciar Sesión.');
            window.location.href = 'http://localhost/InstrumentosLLaneros/Tienda_llanera/html/login.html';
          </script>";
} else {
    echo "<script>
            alert('Error al crear la cuenta.');
            window.location.href = 'http://localhost/InstrumentosLLaneros/register.php';
          </script>";
}
?>
