<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<pre>";

$baseUrl = "http://localhost/public/api.php"; // ajuste para seu caminho real

// ================== FUNÇÃO AUXILIAR ==================
function callApi($url, $method = 'GET', $data = null)
{
    $curl = curl_init();

    $options = [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    ];

    if ($method === 'POST' && $data) {
        $options[CURLOPT_POST] = true;
        $options[CURLOPT_POSTFIELDS] = json_encode($data);
    }

    curl_setopt_array($curl, $options);

    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    if (curl_errno($curl)) {
        echo "Erro CURL: " . curl_error($curl) . "\n";
        return null;
    }

    curl_close($curl);

    echo "HTTP Code: $httpCode\n";
    return json_decode($response, true);
}

// ================== TESTE VENDEDORES ==================
echo "=== Teste Vendedores Mania ===\n";
$vendedoresMania = callApi($baseUrl . "?acao=vendedores&empresa=mania");
print_r($vendedoresMania);

echo "=== Teste Vendedores Amazonet ===\n";
$vendedoresAmazonet = callApi($baseUrl . "?acao=vendedores&empresa=amazonet");
print_r($vendedoresAmazonet);

// ================== TESTE SERVIÇOS ==================
$cepTeste = "68030590"; // seu CEP de teste

echo "=== Teste Serviços Mania ===\n";
$servicosMania = callApi($baseUrl . "?acao=servicos&empresa=mania&cep=$cepTeste");
print_r($servicosMania);

echo "=== Teste Serviços Amazonet ===\n";
$servicosAmazonet = callApi($baseUrl . "?acao=servicos&empresa=amazonet&cep=$cepTeste");
print_r($servicosAmazonet);

// ================== TESTE CREATE PROSPECT ==================
$prospectTeste = [
    "nome" => "João da Silva",
    "cpf" => "12345678901",
    "cep" => $cepTeste,
    "telefone" => "91999999999",
    "email" => "joao@teste.com"
];

echo "=== Teste Create Prospect Mania ===\n";
$prospectMania = callApi($baseUrl . "?acao=createProspect&empresa=mania", 'POST', $prospectTeste);
print_r($prospectMania);

echo "=== Teste Create Prospect Amazonet ===\n";
$prospectAmazonet = callApi($baseUrl . "?acao=createProspect&empresa=amazonet", 'POST', $prospectTeste);
print_r($prospectAmazonet);

echo "</pre>";
