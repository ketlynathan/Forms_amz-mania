<?php

/* =====================================================
   1️⃣ CARREGAR .ENV
===================================================== */
function loadEnv($path)
{
    if (!file_exists($path)) {
        die(".env não encontrado");
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        $line = trim($line);
        if (str_starts_with($line, '#') || !str_contains($line, '=')) continue;

        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

loadEnv(__DIR__ . '/../../.env');

/* =====================================================
   2️⃣ GERAR TOKEN
===================================================== */
function getToken()
{
    $host = rtrim($_ENV['HOST'], '/');
    $url  = $host . "/oauth/token";

    echo "<h2>🔎 Testando URL Token:</h2>";
    echo $url . "<br><br>";

    $data = [
        "client_id"     => $_ENV['CLIENT_ID'],
        "client_secret" => $_ENV['CLIENT_SECRET'],
        "username"      => $_ENV['USERNAME'],
        "password"      => $_ENV['PASSWORD'],
        "grant_type"    => $_ENV['GRANT_TYPE']
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($data),
        CURLOPT_HTTPHEADER => ["Content-Type: application/x-www-form-urlencoded"],
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    echo "<h3>📡 HTTP CODE TOKEN:</h3> $httpCode <br>";
    echo "<pre>$response</pre>";

    $json = json_decode($response, true);

    return $json['access_token'] ?? null;
}

/* =====================================================
   3️⃣ TESTAR PLANOS POR CEP
===================================================== */
function testarPlanos($token, $cep)
{
    $host = rtrim($_ENV['HOST'], '/');
    $url  = $host . "/api/v1/integracao/prospecto/create?cep=" . urlencode($cep);

    echo "<h2>🔎 Testando Endpoint Planos:</h2>";
    echo $url . "<br><br>";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $token",
            "Accept: application/json"
        ],
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    echo "<h3>📡 HTTP CODE PLANOS:</h3> $httpCode <br>";

    $json = json_decode($response, true);
    echo "<pre>";
    print_r($json);
    echo "</pre>";

    return $json;
}

/* =====================================================
   4️⃣ EXECUÇÃO
===================================================== */
$token = getToken();

if ($token) {
    echo "<h2>✅ TOKEN GERADO COM SUCESSO</h2><br>";
    $planos = testarPlanos($token, "69099239"); // coloque CEP válido
} else {
    echo "<h2>❌ Token não gerado</h2>";
}
