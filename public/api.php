<?php

header('Content-Type: application/json');

require_once dirname(__DIR__) . '/src/Controllers/FormController.php';

use Src\Controllers\FormController;

$controller = new FormController();
$action = $_GET['action'] ?? null;

if ($action === 'buscar') {
    echo $controller->buscarEndereco();
    exit;
}

if ($action === 'buscar_endereco') {
    echo $controller->buscarEndereco();
    exit;
}

if ($action === 'buscar_planos') {
    echo $controller->buscarPlanos();
    exit;
}

if ($action === 'enviar') {
    echo $controller->enviar();
    exit;
}

http_response_code(404);
echo json_encode(['status' => 'error', 'msg' => 'Rota inválida']);
