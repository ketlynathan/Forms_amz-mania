<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once __DIR__ . '/../src/Config/ApiHubsoft.php';
require_once __DIR__ . '/../src/Config/ApiHubsoftMania.php';

use Src\Config\ApiHubsoft;
use Src\Config\ApiHubsoftMania;

try {
    $acao = $_GET['acao'] ?? null;
    $empresa = $_GET['empresa'] ?? null; // mania ou amazonet

    if (!$acao) throw new Exception("Ação não informada");
    if (!$empresa) throw new Exception("Empresa não informada");

    // Define a empresa para Amazonet (ApiHubsoft) ou Mania (ApiHubsoftMania)
    if ($empresa === 'amazonet') {
        ApiHubsoft::setEmpresa('amazonet');
    } elseif ($empresa === 'mania') {
        // Mania não precisa setEmpresa, a classe já usa o env.ini
    } else {
        throw new Exception("Empresa inválida");
    }

    $result = null;
    switch ($acao) {
        case 'vendedores':
            $result = ($empresa === 'amazonet')
                ? ApiHubsoft::getVendedores()
                : ApiHubsoftMania::getVendedores();
            break;

        case 'servicos':
            $cep = $_GET['cep'] ?? null;
            if (!$cep) throw new Exception("CEP é obrigatório");
            $result = ($empresa === 'amazonet')
                ? ApiHubsoft::getServicos($cep)
                : ApiHubsoftMania::getServicos($cep);
            break;

        case 'createProspect':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!$data) throw new Exception("Dados do prospect são obrigatórios");
            $result = ($empresa === 'amazonet')
                ? ApiHubsoft::createProspect($data)
                : ApiHubsoftMania::createProspect($data);
            break;

        default:
            throw new Exception("Ação inválida");
    }

    echo json_encode([
        'success' => true,
        'empresa' => $empresa,
        'data' => $result
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
