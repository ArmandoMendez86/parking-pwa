<?php
require_once '../modelos/Usuario.php';

class UsuarioController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new Usuario();
    }

    public function listar()
    {
        echo json_encode($this->modelo->obtenerTodos());
    }

    public function guardar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
        $resultado = $this->modelo->agregar(
            $data['usuario'],
            $password_hash,
            $data['perfil'],
        );
        echo json_encode(["success" => $resultado]);
    }

    public function editar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
        $resultado = $this->modelo->editar(
            $data['id'],
            $data['usuario'],
            $password_hash,
            $data['perfil'],

        );
        echo json_encode(["success" => $resultado]);
    }

    public function eliminar()
    {
        $id = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->eliminar($id);
        echo json_encode(["success" => $resultado]);
    }
}

// Manejo de peticiones
$action = $_GET['action'] ?? '';
$controller = new UsuarioController();

if ($action == "listar") {
    $controller->listar();
} elseif ($action == "guardar") {
    $controller->guardar();
} elseif ($action == "editar") {
    $controller->editar();
} elseif ($action == "eliminar") {
    $controller->eliminar();
}
