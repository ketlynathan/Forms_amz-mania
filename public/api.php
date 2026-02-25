<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once __DIR__ . '/../src/Config/ApiHubsoft.php';
require_once __DIR__ . '/../src/Config/ApiHubsoftMania.php';

use Src\Config\ApiHubsoft;
use Src\Config\ApiHubsoftMania;

// ================= COBERTURA POR EMPRESA =================

function getCoberturaEmpresa($empresa)
{
    return [
        'amazonet' => [
            'PA' => [
                'SANTAREM',
                'ALENQUER',
                'MARABA',
                'PRAINHA',
                'MONTE ALEGRE',
                'OBIDOS',
                'ORIXIMINA',
                'BELTERRA',
                'MOJUI DOS CAMPOS',
                'ITAITUBA',
                'CURUA',
                'URUARA',
                'ALTER DO CHAO'
            ],
            'AM' => [
                'MANAUS',
                'PRESIDENTE FIGUEIREDO',
                'MANACAPURU',
                'RIO PRETO DA EVA',
                'IRANDUBA',
                'PARINTINS',
                'ITACOATIARA'
            ]
        ],

        'mania' => [
            'AM' => [
                'MANAUS',
                'MANACAPURU'
            ],
            'PA' => [
                'SANTAREM'
            ]
        ]
    ][$empresa] ?? null;
}

function validarCobertura($cep, $empresa)
{
    $cep = preg_replace('/\D/', '', $cep);

    if (strlen($cep) !== 8) {
        throw new Exception("CEP inválido");
    }

    $response = file_get_contents("https://viacep.com.br/ws/{$cep}/json/");
    if (!$response) {
        throw new Exception("Erro ao consultar CEP");
    }

    $dados = json_decode($response, true);

    if (isset($dados['erro'])) {
        throw new Exception("CEP não encontrado");
    }

    $uf = strtoupper($dados['uf']);
    $cidade = strtoupper(
        iconv('UTF-8', 'ASCII//TRANSLIT', $dados['localidade'])
    );

    $cobertura = getCoberturaEmpresa($empresa);

    if (!$cobertura || !isset($cobertura[$uf])) {
        throw new Exception("Empresa não atende o estado {$uf}");
    }

    if (!in_array($cidade, $cobertura[$uf])) {
        throw new Exception("Empresa não possui cobertura em {$dados['localidade']} - {$uf}");
    }

    return true;
}

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

            validarCobertura($cep, $empresa);

            $result = ($empresa === 'amazonet')
                ? ApiHubsoft::getServicos($cep)
                : ApiHubsoftMania::getServicos($cep);
            break;

        case 'createProspect':

            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                throw new Exception("Método inválido. Use POST.");
            }

            // 🔥 LER JSON CORRETAMENTE
            $input = json_decode(file_get_contents("php://input"), true);

            if (empty($input)) {
                throw new Exception("Dados do prospect são obrigatórios");
            }

            $result = ($empresa === 'amazonet')
                ? ApiHubsoft::createProspect($input)
                : ApiHubsoftMania::createProspect($input);

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
