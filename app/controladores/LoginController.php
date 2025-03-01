<?php

require_once '../modelos/Login.php';

class LoginController
{
    private $login;

    public function __construct()
    {
        $this->login = new Login();
    }

    public function ingresar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $respuesta = $this->login->loguearse($data['usuario']);

        if ($respuesta && password_verify($data['password'], $respuesta[0]["password"])) {
            session_start();
            $_SESSION["iniciarSesion"] = "ok";
            $_SESSION["id"] = $respuesta[0]["id"];
            $_SESSION["usuario"] = $respuesta[0]["usuario"];
            $_SESSION["perfil"] = $respuesta[0]["perfil"];

            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
    }
}


// Manejo de peticiones
$action = $_GET['action'] ?? '';
$controller = new LoginController();

if ($action == "login") {
    $controller->ingresar();
}
