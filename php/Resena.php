<?php
class Resena {
    private $conexion;
    
    public function __construct($conexion) {
        $this->conexion = $conexion;
    }
    
    public function addReview($cod_cli, $cod_prod, $desc_res, $calif_res) {
        // Generar código de reseña único
        $cod_res = uniqid('res_', true);
        $sql = "INSERT INTO resenas (cod_res, desc_res, calif_res, cod_prod, cod_cli) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conexion->prepare($sql);
        if (!$stmt) {
            return "Error en la consulta: " . $this->conexion->error;
        }
        // Bind de parámetros: s: string, s: string, i: integer, s: string, s: string
        $stmt->bind_param("ssiss", $cod_res, $desc_res, $calif_res, $cod_prod, $cod_cli);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $stmt->close();
            return true;
        } else {
            $stmt->close();
            return "No se pudo registrar la reseña.";
        }
    }
}
?>
