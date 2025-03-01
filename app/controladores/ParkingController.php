<?php
require_once '../modelos/Parking.php';

class ParkingController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new Parking();
    }

    public function listar()
    {
        echo json_encode($this->modelo->obtenerTodos());
    }

    public function guardar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            echo json_encode(["error" => "No se recibió información"]);
            return;
        }
        foreach ($data as $concepto => $registros) {
            $informacionJSON = json_encode($registros);
            $this->modelo->agregar($concepto, $informacionJSON);
        }
        echo json_encode(["success" => true]);
    }



    /* public function editar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->editar(
            $data['id'],
            $data['nombre'],
            $data['telefono'],
            $data['email'],
            $data['direccion'],
            $data['fecha_cumple'],
            $data['ocupacion'],
            $data['enfermedadesC'],
            $data['antecedentesP'],
            $data['alergias'],
            $data['medicacion'],
        );
        echo json_encode(["success" => $resultado]);
    }

    public function eliminar()
    {
        $id = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->eliminar($id);
        echo json_encode(["success" => $resultado]);
    } */
}

// Manejo de peticiones
$action = $_GET['action'] ?? '';
$controller = new ParkingController();

if ($action == "listar") {
    $controller->listar();
} elseif ($action == "guardar") {
    $controller->guardar();
}
