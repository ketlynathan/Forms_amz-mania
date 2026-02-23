<?php

namespace Src\Config;

use Exception;

class ApiHubsoftMania
{
    private static function getEnv()
    {
        $envPath = realpath(dirname(__FILE__) . '/../../env.ini');

        if (!$envPath) {
            throw new Exception("env.ini não encontrado.");
        }

        return parse_ini_file($envPath);
    }

    public static function getToken()
    {
        $env = self::getEnv();

        $url = "https://api.mania.hubsoft.com.br/oauth/token";

        $data = [
            'client_id' => $env['client_id_mania'],
            'client_secret' => $env['client_secret_mania'],
            'username' => $env['username_mania'],
            'password' => $env['password_mania'],
            'grant_type' => 'password'
        ];

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($data),
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded'
            ]
        ]);

        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if (curl_errno($curl)) {
            throw new Exception(curl_error($curl));
        }

        curl_close($curl);

        if ($httpCode !== 200) {
            throw new Exception("Erro token Mania: HTTP $httpCode - $response");
        }

        $json = json_decode($response, true);

        if (!isset($json['access_token'])) {
            throw new Exception("Token não retornado: $response");
        }

        return $json['access_token'];
    }

    public static function getVendedores()
    {
        $token = self::getToken();
        $url = "https://api.mania.hubsoft.com.br/api/v1/integracao/configuracao/vendedor";

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer $token",
                "Accept: application/json"
            ]
        ]);

        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if (curl_errno($curl)) {
            throw new Exception(curl_error($curl));
        }

        curl_close($curl);

        if ($httpCode !== 200) {
            throw new Exception("Erro vendedores: HTTP $httpCode - $response");
        }

        return json_decode($response, true);
    }
    public static function getServicos($cep)
    {
        $token = self::getToken();
        $cep = preg_replace('/[^0-9]/', '', $cep);

        $url = "https://api.mania.hubsoft.com.br/api/v1/integracao/prospecto/create?cep={$cep}";

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer $token",
                "Accept: application/json"
            ]
        ]);

        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if (curl_errno($curl)) {
            throw new Exception(curl_error($curl));
        }

        curl_close($curl);

        if ($httpCode !== 200) {
            throw new Exception("Erro serviços: HTTP $httpCode - $response");
        }

        return json_decode($response, true);
    }

    public static function createProspect($data)
    {
        $token = self::getToken();
        $url = "https://api.mania.hubsoft.com.br/api/v1/integracao/prospecto";

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer $token",
                "Content-Type: application/json",
                "Accept: application/json"
            ]
        ]);

        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if (curl_errno($curl)) {
            throw new Exception(curl_error($curl));
        }

        curl_close($curl);

        if ($httpCode !== 200 && $httpCode !== 201) {
            throw new Exception("Erro prospect: HTTP $httpCode - $response");
        }

        return json_decode($response, true);
    }
}
