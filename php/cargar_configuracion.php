<?php
// Suprimir errores de PHP en la salida, pero permitir logging si está configurado
error_reporting(0);
ini_set('display_errors', 0);

// Establecer cabeceras JSON y CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Ajustar en producción

// --- Detalles de conexión a la base de datos ---
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "instrumentos_llaneros_db";

$conn = null; // Inicializar conexión fuera del try

try {
    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verificar conexión
    if ($conn->connect_error) {
        // Lanzar una excepción para ser capturada por el bloque catch
        throw new Exception('Error de conexión a la base de datos: ' . $conn->connect_error);
    }

    // Establecer el juego de caracteres a UTF-8
    if (!$conn->set_charset("utf8")) {
        // Podrías loggear este error si es importante, pero no detener la ejecución
        // error_log("Error cargando el conjunto de caracteres utf8: " . $conn->error);
    }

    // --- Consulta para obtener la configuración ---
    $sql = "SELECT 
                nombre_tienda, 
                descripcion_tienda, 
                contacto_email, 
                contacto_telefono, 
                contacto_direccion, 
                redes_sociales, 
                moneda, 
                impuestos_activos, 
                porcentaje_impuesto, 
                metodos_pago, 
                opciones_envio, 
                costo_envio_estandar, 
                envio_gratis_desde 
            FROM configuracion 
            LIMIT 1";

    $result = $conn->query($sql);

    if ($result === false) {
        // Error en la consulta SQL
        throw new Exception('Error al ejecutar la consulta: ' . $conn->error);
    }

    $config = null;

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        // Procesar campos JSON de forma segura
        $metodos_pago = json_decode($row['metodos_pago'] ?? '[]', true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            // Loggear error si es necesario, pero devolver array vacío
            // error_log('Error decodificando metodos_pago JSON: ' . json_last_error_msg());
            $metodos_pago = [];
        }

        $opciones_envio = json_decode($row['opciones_envio'] ?? '[]', true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            // error_log('Error decodificando opciones_envio JSON: ' . json_last_error_msg());
            $opciones_envio = [];
        }

        // Construir el objeto de configuración con valores por defecto seguros
        $config = [
            'nombre_tienda' => $row['nombre_tienda'] ?? '',
            'descripcion_tienda' => $row['descripcion_tienda'] ?? '',
            'contacto_email' => $row['contacto_email'] ?? '',
            'contacto_telefono' => $row['contacto_telefono'] ?? '',
            'contacto_direccion' => $row['contacto_direccion'] ?? '',
            'redes_sociales' => $row['redes_sociales'] ?? '',
            'moneda' => $row['moneda'] ?? 'USD',
            'impuestos_activos' => isset($row['impuestos_activos']) ? (bool)$row['impuestos_activos'] : false,
            'porcentaje_impuesto' => isset($row['porcentaje_impuesto']) ? (float)$row['porcentaje_impuesto'] : null,
            'metodos_pago' => is_array($metodos_pago) ? $metodos_pago : [], // Asegurar que sea array
            'opciones_envio' => is_array($opciones_envio) ? $opciones_envio : [], // Asegurar que sea array
            'costo_envio_estandar' => isset($row['costo_envio_estandar']) ? (float)$row['costo_envio_estandar'] : null,
            'envio_gratis_desde' => isset($row['envio_gratis_desde']) ? (float)$row['envio_gratis_desde'] : null,
        ];
    } else {
        // No se encontró configuración, devolver valores por defecto
         $config = [
            'nombre_tienda' => '',
            'descripcion_tienda' => '',
            'contacto_email' => '',
            'contacto_telefono' => '',
            'contacto_direccion' => '',
            'redes_sociales' => '',
            'moneda' => 'USD',
            'impuestos_activos' => false,
            'porcentaje_impuesto' => null,
            'metodos_pago' => [],
            'opciones_envio' => [],
            'costo_envio_estandar' => null,
            'envio_gratis_desde' => null,
        ];
    }
    $result->free();

    // Cerrar conexión si está abierta
    if ($conn) {
        $conn->close();
    }

    // Devolver la configuración en formato JSON
    echo json_encode($config);

} catch (Exception $e) {
    // Capturar cualquier excepción (conexión, consulta, etc.)
    http_response_code(500); // Internal Server Error
    echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor: ' . $e->getMessage()]);
    
    // Asegurarse de cerrar la conexión si se abrió
    if ($conn && $conn->ping()) { // Verificar si la conexión sigue activa antes de cerrar
        $conn->close();
    }
    exit(); // Detener ejecución después de enviar el error JSON
}

?>