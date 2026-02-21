<?php

namespace Src\Services;

use Src\Config\ApiHubsoft;

class FormService
{
    /* =========================================
       🔎 Buscar endereço (ViaCEP)
    ========================================== */
    public function buscarEndereco($cep)
    {
        $cep = preg_replace('/\D/', '', $cep);

        if (strlen($cep) !== 8) {
            return ["status" => "error", "msg" => "CEP inválido"];
        }

        $url = "https://viacep.com.br/ws/{$cep}/json/";
        $response = file_get_contents($url);

        if (!$response) {
            return ["status" => "error", "msg" => "Erro ao consultar CEP"];
        }

        $data = json_decode($response, true);

        if (isset($data['erro'])) {
            return ["status" => "error", "msg" => "CEP não encontrado"];
        }

        return ["status" => "success", "msg" => "Endereço encontrado", "data" => $data];
    }

    /* =========================================
       📡 Buscar planos (Hubsoft)
    ========================================== */
    public function buscarPlanos($empresa, $cep)
    {
        ApiHubsoft::setEmpresa($empresa);
        $servicos = ApiHubsoft::getServicos($cep);

        return $servicos ?? [];
    }

    /* =========================================
       🚀 Enviar prospect
    ========================================== */
    public function enviar($data)
    {
        ApiHubsoft::setEmpresa($data['empresa']);
        return ApiHubsoft::createProspect($data);
    }
}
