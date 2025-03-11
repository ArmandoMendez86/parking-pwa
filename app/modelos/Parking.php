<?php
require_once '../config/Conexion.php';

class Parking
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }

    public function obtenerTodos()
    {
        $query = "SELECT * FROM registros";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($concepto, $informacion)
    {
        $fecha = date('Y-m-d');
        $query = "INSERT INTO backup (concepto, informacion, fecha) VALUES (?, ?, ?)";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$concepto, $informacion, $fecha]);
        //return $this->db->lastInsertId();
    }

  /*   public function editar($id, $nombre, $telefono, $email, $direccion, $fecha_cumple, $ocupacion, $enfermedades_c, $antecedentes_p, $alergias, $medicacion)
    {
        $query = "UPDATE pacientes SET nombre = ?, telefono = ?, email = ?, direccion = ?, fecha_cumple = ?, ocupacion = ?, enfermedades_c = ?, antecedentes_p = ?, alergias = ?, medicacion = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$nombre, $telefono, $email, $direccion, $fecha_cumple, $ocupacion, $enfermedades_c, $antecedentes_p, $alergias, $medicacion, $id]);
    }

    public function eliminar($id)
    {
        $query = "DELETE FROM pacientes WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id]);
    } */
}
