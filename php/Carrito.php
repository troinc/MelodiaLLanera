<?php
// No incluir 'conexion.php' aquí, se pasa por el constructor.

class Carrito {
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    // Método para añadir un item (se utiliza solo si se requiere agregar individualmente)
    public function addItem($cod_cli, $cod_prod, $cantidad, $precio_unitario) {
        $num_ped = uniqid('cart_');
        $estado_ped = 'EN_CARRITO';
        $fec_compra = date('Y-m-d H:i:s');
        $sql_insert = "INSERT INTO compras (num_ped, fec_compra, estado_ped, cod_cli, cod_prod, cantidad, precio_unitario) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt_insert = $this->conexion->prepare($sql_insert);
        if (!$stmt_insert) {
            error_log("Error al preparar inserción en Carrito::addItem: " . $this->conexion->error);
            return "Error al preparar la consulta de inserción.";
        }
        $precio_unitario_limpio = preg_replace('/[^0-9.]/', '', $precio_unitario);
        $stmt_insert->bind_param("ssssisd", $num_ped, $fec_compra, $estado_ped, $cod_cli, $cod_prod, $cantidad, $precio_unitario_limpio);
        if ($stmt_insert->execute()) {
            $stmt_insert->close();
            return true;
        } else {
            $error_msg = $stmt_insert->error;
            $stmt_insert->close();
            error_log("Error al ejecutar inserción en Carrito::addItem: " . $error_msg);
            return "No se pudo registrar el producto en el carrito: " . $error_msg;
        }
    }

    // Obtener ítems del carrito con estado 'EN_CARRITO' y el nombre del producto
    public function getItems($cod_cli) {
        $sql = "SELECT c.num_ped, c.cod_prod, c.cantidad, c.precio_unitario, p.nom_prod, p.imagen_prod
                FROM compras c
                JOIN productos p ON c.cod_prod = p.cod_prod
                WHERE c.cod_cli = ? AND c.estado_ped = 'EN_CARRITO'";
        $stmt = $this->conexion->prepare($sql);
        if (!$stmt) {
            error_log("Error al preparar consulta en Carrito::getItems: " . $this->conexion->error);
            return "Error al preparar la consulta.";
        }
        $stmt->bind_param("s", $cod_cli);
        $stmt->execute();
        $result = $stmt->get_result();
        if (!$result) {
             $stmt->close();
             error_log("Error al obtener resultados en Carrito::getItems: " . $this->conexion->error);
             return "Error al obtener los ítems del carrito.";
        }
        $items = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return $items;
    }

    // Guardar el carrito completo: borra los existentes 'EN_CARRITO' y guarda el nuevo array de items
    public function saveCart($cod_cli, $cartData) {
        $this->conexion->begin_transaction();
        try {
            $sql_delete = "DELETE FROM compras WHERE cod_cli = ? AND estado_ped = 'EN_CARRITO'";
            $stmt_delete = $this->conexion->prepare($sql_delete);
            if (!$stmt_delete) {
                throw new Exception("Error al preparar borrado: " . $this->conexion->error);
            }
            $stmt_delete->bind_param("s", $cod_cli);
            if (!$stmt_delete->execute()) {
                 throw new Exception("Error al borrar carrito antiguo: " . $stmt_delete->error);
            }
            $stmt_delete->close();
            $sql_insert = "INSERT INTO compras (num_ped, fec_compra, estado_ped, cod_cli, cod_prod, cantidad, precio_unitario) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt_insert = $this->conexion->prepare($sql_insert);
            if (!$stmt_insert) {
                throw new Exception("Error al preparar inserción: " . $this->conexion->error);
            }
            $estado_insert = 'EN_CARRITO';
            $fec_compra = date('Y-m-d H:i:s');
            foreach ($cartData as $item) {
                 // *** CORRECCIÓN: Usar las claves enviadas por JavaScript ('id', 'quantity', 'price') ***
                 if (!isset($item['id'], $item['quantity'], $item['price'])) {
                     error_log("Item inválido en saveCart para $cod_cli: " . print_r($item, true));
                     continue; // Saltar item inválido
                 }

                 // Generar num_ped único para cada línea de item (según diseño actual)
                 // Nota: Si num_ped debe agrupar items, generarlo *antes* del loop.
                 $num_ped = uniqid('cart_'); 
                 
                 $cod_prod = $item['id']; // Usar 'id' de JS
                 $cantidad = intval($item['quantity']); // Usar 'quantity' de JS
                 // *** CORRECCIÓN: Usar directamente floatval del precio enviado por JS ***
                 $precio_unitario = floatval($item['price']); // Usar 'price' de JS

                 if ($cantidad <= 0) {
                     error_log("Cantidad inválida ($cantidad) para item $cod_prod en saveCart para $cod_cli.");
                     continue; // Saltar items con cantidad 0 o negativa
                 }

                 // Asegurarse que los tipos coincidan con bind_param ("ssssisd")
                 // num_ped (s), fec_compra (s), estado_insert (s), cod_cli (s), cod_prod (i - ¿o es string?), cantidad (i), precio_unitario (d)
                 // ¡CORREGIDO! cod_prod es VARCHAR, así que usamos 's' para él.
                 $stmt_insert->bind_param("ssssssd", $num_ped, $fec_compra, $estado_insert, $cod_cli, $cod_prod, $cantidad, $precio_unitario);
                 
                 if (!$stmt_insert->execute()) {
                     // Proveer más contexto en el error
                     throw new Exception("Error al insertar item con cod_prod '$cod_prod' (num_ped: $num_ped): " . $stmt_insert->error);
                 }
            }
            $stmt_insert->close();
            $this->conexion->commit();
            return true;
        } catch (Exception $e) {
            $this->conexion->rollback();
            error_log("Error en Carrito::saveCart para $cod_cli: " . $e->getMessage());
            return "Error al guardar el carrito: " . $e->getMessage();
        }
    }

    // Eliminar un item específico del carrito (usando num_ped)
    public function removeItem($num_ped, $cod_cli) {
        $sql = "DELETE FROM compras WHERE num_ped = ? AND cod_cli = ? AND estado_ped = 'EN_CARRITO'";
        $stmt = $this->conexion->prepare($sql);
        if (!$stmt) {
            error_log("Error al preparar consulta en Carrito::removeItem: " . $this->conexion->error);
            return "Error al preparar la consulta de eliminación.";
        }
        $stmt->bind_param("ss", $num_ped, $cod_cli);
        if ($stmt->execute()) {
            $affected_rows = $stmt->affected_rows;
            $stmt->close();
            if ($affected_rows > 0) {
                return true;
            } else {
                return "No se encontró el ítem en el carrito o no pertenece al usuario.";
            }
        } else {
            $error_msg = $stmt->error;
            $stmt->close();
            error_log("Error al ejecutar eliminación en Carrito::removeItem: " . $error_msg);
            return "No se pudo eliminar el producto del carrito: " . $error_msg;
        }
    }

    // Actualizar la cantidad de un item; si la cantidad es 0 o menor, elimina el item
    public function updateItemQuantity($num_ped, $cod_cli, $nueva_cantidad) {
         if ($nueva_cantidad <= 0) {
             return $this->removeItem($num_ped, $cod_cli);
         }
         $sql = "UPDATE compras SET cantidad = ? WHERE num_ped = ? AND cod_cli = ? AND estado_ped = 'EN_CARRITO'";
         $stmt = $this->conexion->prepare($sql);
         if (!$stmt) {
             error_log("Error al preparar actualización en Carrito::updateItemQuantity: " . $this->conexion->error);
             return "Error al preparar la consulta de actualización.";
         }
         $stmt->bind_param("iss", $nueva_cantidad, $num_ped, $cod_cli);
         if ($stmt->execute()) {
             $stmt->close();
             return true;
         } else {
             $error_msg = $stmt->error;
             $stmt->close();
             error_log("Error al ejecutar actualización en Carrito::updateItemQuantity: " . $error_msg);
             return "No se pudo actualizar la cantidad: " . $error_msg;
         }
    }
}
?>
