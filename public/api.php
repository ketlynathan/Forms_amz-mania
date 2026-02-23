<?php
// api.php

// Configura resposta JSON e permite CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Carrega funções auxiliares (getToken, testarPlanos, etc.)
require 'funcoes.php';

// --- Captura parâmetros da query ---
$cep = $_GET['cep'] ?? null;
$rota = $_GET['rota'] ?? null;

// --- Validação básica ---
if (!$cep) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'CEP não informado'
    ]);
    exit;
}

// --- Geração do token ---
$token = getToken();
if (!$token) {
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Token não gerado'
    ]);
    exit;
}

// --- Função auxiliar para responder JSON com status ---
function responder($dados, $codigoHttp = 200) {
    http_response_code($codigoHttp);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

// --- Roteamento simples ---
switch ($rota) {

    case 'planos':
        $planos = testarPlanos($token, $cep);
        responder($planos);
        break;

    default:
        // Se não houver rota específica, também retorna os planos
        $planos = testarPlanos($token, $cep);
        responder($planos);
        break;
}
