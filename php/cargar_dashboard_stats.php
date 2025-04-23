<?php
// php/cargar_dashboard_stats.php
header('Content-Type: application/json');
// Permitir acceso desde el origen de tu frontend (ajusta si es necesario)
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../conexion.php'; // Usar ruta basada en __DIR__

$response = ['status' => 'error', 'message' => 'Error inicial al cargar estadísticas.'];
$stats = [
    'total_usuarios' => 0,
    'total_productos' => 0,
    'total_ventas_valor' => 0.00,
    'total_ventas_cantidad' => 0, // Número total de órdenes/items vendidos
    'ventas_mensuales' => array_fill(0, 12, 0.0), // Inicializar para 12 meses (índice 0-11)
    'usuarios_compradores' => 0 // Usuarios distintos que han comprado
    // Podríamos añadir más stats aquí, como productos más vendidos
];

// Usar la conexión mysqli existente de conexion.php
if ($conexion) {
    try {
        // Contar usuarios totales
        $sql_users = "SELECT COUNT(*) as total FROM clientes";
        $result_users = $conexion->query($sql_users);
        if ($result_users) {
            $row_users = $result_users->fetch_assoc();
            $stats['total_usuarios'] = (int)$row_users['total'];
            $result_users->free();
        } else {
             error_log("Error contando usuarios: " . $conexion->error);
        }

        // Contar productos totales
        $sql_products = "SELECT COUNT(*) as total FROM productos";
        $result_products = $conexion->query($sql_products);
        if ($result_products) {
            $row_products = $result_products->fetch_assoc();
            $stats['total_productos'] = (int)$row_products['total'];
            $result_products->free();
        } else {
             error_log("Error contando productos: " . $conexion->error);
        }

        // Sumar valor total de ventas (estado 'COMPLETADO' si existe, si no, todas)
        // Asumiendo que 'COMPLETADO' es el estado de una venta real. Ajusta si es diferente.
        // Si no usas estado_ped, quita la condición WHERE
        $sql_sales_total_valor = "SELECT SUM(cantidad * precio_unitario) as total FROM compras"; // WHERE estado_ped = 'COMPLETADO'"; 
        $result_sales_total_valor = $conexion->query($sql_sales_total_valor);
         if ($result_sales_total_valor) {
            $row_sales_valor = $result_sales_total_valor->fetch_assoc();
            $stats['total_ventas_valor'] = $row_sales_valor['total'] ? (float)$row_sales_valor['total'] : 0.00;
            $result_sales_total_valor->free();
        } else {
             error_log("Error sumando valor ventas: " . $conexion->error);
        }

        // Contar cantidad total de ventas (número de registros en compras)
        $sql_sales_total_cantidad = "SELECT COUNT(*) as total FROM compras"; // WHERE estado_ped = 'COMPLETADO'"; 
        $result_sales_total_cantidad = $conexion->query($sql_sales_total_cantidad);
         if ($result_sales_total_cantidad) {
            $row_sales_cantidad = $result_sales_total_cantidad->fetch_assoc();
            $stats['total_ventas_cantidad'] = (int)$row_sales_cantidad['total'];
            $result_sales_total_cantidad->free();
        } else {
             error_log("Error contando cantidad ventas: " . $conexion->error);
        }

        // Obtener ventas mensuales del año actual
        $ventas_por_mes = array_fill(0, 12, 0.0); // Índice 0 a 11
        $current_year = date('Y');
        $sql_ventas_mes = "SELECT MONTH(fec_compra) as mes, SUM(cantidad * precio_unitario) as total_mes
                           FROM compras
                           WHERE YEAR(fec_compra) = ? 
                           GROUP BY MONTH(fec_compra)"; // AND estado_ped = 'COMPLETADO'
        $stmt_ventas_mes = $conexion->prepare($sql_ventas_mes);
        if($stmt_ventas_mes) {
            $stmt_ventas_mes->bind_param("i", $current_year);
            $stmt_ventas_mes->execute();
            $result_ventas_mes = $stmt_ventas_mes->get_result();
            while ($row_mes = $result_ventas_mes->fetch_assoc()) {
                // Ajustar índice basado en mes (1-12) a índice de array (0-11)
                $month_index = (int)$row_mes['mes'] - 1; 
                if ($month_index >= 0 && $month_index < 12) {
                    $ventas_por_mes[$month_index] = (float)$row_mes['total_mes'];
                }
            }
            $stmt_ventas_mes->close();
            $stats['ventas_mensuales'] = $ventas_por_mes; // Asignar el array completo
        } else {
             error_log("Error preparando consulta ventas mensuales: " . $conexion->error);
        }


        // Contar usuarios distintos que han comprado
        $sql_users_buyers = "SELECT COUNT(DISTINCT cod_cli) as total FROM compras"; // WHERE estado_ped = 'COMPLETADO'"; 
        $result_users_buyers = $conexion->query($sql_users_buyers);
         if ($result_users_buyers) {
            $row_users_buyers = $result_users_buyers->fetch_assoc();
            $stats['usuarios_compradores'] = (int)$row_users_buyers['total'];
            $result_users_buyers->free();
        } else {
             error_log("Error contando usuarios compradores: " . $conexion->error);
        }


        $response = ['status' => 'success', 'stats' => $stats];

    } catch (Exception $e) { // Capturar excepciones generales también
        error_log("Excepción en cargar_dashboard_stats.php: " . $e->getMessage());
        $response['message'] = 'Error procesando estadísticas: ' . $e->getMessage();
        http_response_code(500);
    } finally {
        if (isset($conexion) && $conexion->ping()) {
            $conexion->close(); // Cerrar la conexión mysqli
        }
    }
} else {
    error_log("Fallo la conexión a la BD en cargar_dashboard_stats.php");
    $response['message'] = 'Error al conectar con la base de datos.';
    http_response_code(500);
}

echo json_encode($response);
?>