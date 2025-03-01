<?php
require_once '../config/Conexion.php';

class Login
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }

    public function loguearse($usuario)
    {
        $sql = "SELECT * FROM usuarios WHERE usuario = '$usuario'";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
