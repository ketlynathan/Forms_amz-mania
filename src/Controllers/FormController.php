<?php

namespace Src\Controllers;

use Src\Services\FormService;

class FormController
{
    private function response($status, $msg, $data = null)
    {
        header('Content-Type: application/json');
        echo json_encode(['status' => $status, 'msg' => $msg, 'data' => $data]);
        exit;
    }

    /* =========================================
       🔎 Buscar endereço
    ========================================== */
    public function buscarEndereco()
    {
        $input = json_decode(file_get_contents("php://input"), true);
        $cep = $input['cep'] ?? $_GET['cep'] ?? '';

        $service = new FormService();
        $resultado = $service->buscarEndereco($cep);

        $this->response($resultado['status'], $resultado['msg'], $resultado['data'] ?? null);
    }

    /* =========================================
       📡 Buscar planos
    ========================================== */
    public function buscarPlanos()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (empty($input['empresa']) || empty($input['cep'])) {
            $this->response('error', 'Empresa e CEP são obrigatórios');
        }

        $service = new FormService();
        $planos = $service->buscarPlanos($input['empresa'], $input['cep']);

        $this->response('success', 'Planos carregados', $planos['servicos'] ?? []);
    }

    /* =========================================
       🚀 Enviar prospect
    ========================================== */
    public function enviar()
    {
        $service = new FormService();
        $resultado = $service->enviar($_POST);

        $this->response('success', 'Prospect enviado', $resultado);
    }
}
