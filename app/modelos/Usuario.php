<?php
require_once '../config/Conexion.php';

class Usuario
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }


    public function obtenerTodos()
    {
        $query = "SELECT * FROM usuarios ORDER BY login DESC";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($usuario, $password, $perfil)
    {
        $query = "INSERT INTO usuarios (usuario, password, perfil) VALUES (?, ?, ?)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$usuario, $password, $perfil]);
    }

    public function editar($id, $usuario, $password, $perfil)
    {
        if ($password !== "") {
            $query = "UPDATE usuarios SET  usuario = ?, password = ?, perfil = ? WHERE id = ?";
            $stmt = $this->db->prepare($query);
            return $stmt->execute([$usuario, $password, $perfil, $id]);
        } else {
            $query = "UPDATE usuarios SET  usuario = ?, password = ?, perfil = ? WHERE id = ?";
            $stmt = $this->db->prepare($query);
            return $stmt->execute([$usuario, $perfil, $password, $id]);
        }
    }

    public function eliminar($id)
    {
        $query = "DELETE FROM usuarios WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id]);
    }
}
