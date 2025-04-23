<?php
// Script para insertar las categorías iniciales

include __DIR__ . '/../conexion.php'; 

$categorias = [
    ['cod_cat' => 'CUE', 'nom_cat' => 'Cuerdas'],
    ['cod_cat' => 'PER', 'nom_cat' => 'Percusión'],
    ['cod_cat' => 'VIE', 'nom_cat' => 'Viento'],
    ['cod_cat' => 'TRA', 'nom_cat' => 'Tradicionales'],
];

// Preparar consulta para verificar existencia
$sql_check = "SELECT cod_cat FROM categorias WHERE cod_cat = ?";
$stmt_check = $conexion->prepare($sql_check);
if (!$stmt_check) {
    // Añadir manejo de error si $conexion es null
    if ($conexion === null) {
        die("Error: La conexión a la base de datos no se estableció correctamente en conexion.php.");
    }
    die("Error preparando consulta de verificación de categorías: " . $conexion->error);
}

// Preparar consulta para insertar
$sql_insert = "INSERT INTO categorias (cod_cat, nom_cat) VALUES (?, ?)";
$stmt_insert = $conexion->prepare($sql_insert);
if (!$stmt_insert) {
    die("Error preparando consulta de inserción de categorías: " . $conexion->error);
}

$insertados = 0;
$existentes = 0;
$errores = 0;

echo "Iniciando inserción de categorías...\n<br>";

foreach ($categorias as $categoria) {
    // Verificar si la categoría ya existe
    $stmt_check->bind_param("s", $categoria['cod_cat']);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check === false) {
        echo "ERROR al verificar categoría " . $categoria['cod_cat'] . ": " . $stmt_check->error . "\n<br>";
        $errores++;
        continue; // Saltar a la siguiente categoría
    }

    if ($result_check->num_rows === 0) {
        // No existe, intentar insertar
        $stmt_insert->bind_param("ss", $categoria['cod_cat'], $categoria['nom_cat']);

        if ($stmt_insert->execute()) {
            echo "Categoría insertada: " . $categoria['nom_cat'] . " (ID: " . $categoria['cod_cat'] . ")\n<br>";
            $insertados++;
        } else {
            echo "ERROR al insertar categoría " . $categoria['nom_cat'] . ": " . $stmt_insert->error . "\n<br>";
            $errores++;
        }
    } else {
        echo "Categoría ya existe: " . $categoria['nom_cat'] . " (ID: " . $categoria['cod_cat'] . ")\n<br>";
        $existentes++;
    }
    $result_check->free(); 
}

$stmt_check->close();
$stmt_insert->close();
$conexion->close();

echo "\n<br>--- Resumen Categorías ---\n<br>";
echo "Categorías insertadas: " . $insertados . "\n<br>";
echo "Categorías que ya existían: " . $existentes . "\n<br>";
echo "Errores durante la inserción: " . $errores . "\n<br>";
echo "Proceso de categorías completado.\n<br>";

?>
