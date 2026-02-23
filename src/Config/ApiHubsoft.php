<?php

namespace Src\Config;

use Exception;

class ApiHubsoft
{
    private static $empresa;
    private static $baseUrl;
    private static $env;

    private static function loadEnv()
    {
        $envPath = realpath(dirname(__FILE__) . '/../../env.ini');
        if (!$envPath) throw new Exception("env.ini não encontrado.");
        self::$env = parse_ini_file($envPath);
    }

    public static function setEmpresa($empresa)
    {
        self::loadEnv();

        if ($empresa === 'amazonet') {
            self::$baseUrl = "https://api.amazonet.hubsoft.com.br";
            self::$empresa = [
                'client_id' => self::$env['client_id'],
                'client_secret' => self::$env['client_secret'],
                'username' => self::$env['username'],
                'password' => self::$env['password'],
                'grant_type' => self::$env['grant_type']
            ];
        } elseif ($empresa === 'mania') {
            self::$baseUrl = "https://api.mania.hubsoft.com.br";
            self::$empresa = [
                'client_id' => self::$env['client_id_mania'],
                'client_secret' => self::$env['client_secret_mania'],
                'username' => self::$env['username_mania'],
                'password' => self::$env['password_mania'],
                'grant_type' => self::$env['grant_type_mania']
            ];
        } else {
            throw new Exception("Empresa inválida.");
        }
    }

    private static function getToken()
    {
        $url = self::$baseUrl . "/oauth/token";

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query(self::$empresa),
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded']
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) throw new Exception("Erro OAuth: HTTP $httpCode");

        $json = json_decode($response, true);
        return $json['access_token'] ?? null;
    }

    private static function request($endpoint, $method = 'GET', $data = null)
    {
        $token = self::getToken();
        $url = self::$baseUrl . $endpoint;

        $ch = curl_init();
        $options = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer $token",
                "Accept: application/json"
            ]
        ];

        if ($method === 'POST') {
            $options[CURLOPT_POST] = true;
            $options[CURLOPT_POSTFIELDS] = json_encode($data);
            $options[CURLOPT_HTTPHEADER][] = "Content-Type: application/json";
        }

        curl_setopt_array($ch, $options);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 && $httpCode !== 201) throw new Exception("Erro API: HTTP $httpCode");

        return json_decode($response, true);
    }


    public static function getServicos($cep)
    {
        $cep = preg_replace('/\D/', '', $cep);
        return self::request("/api/v1/integracao/prospecto/create?cep={$cep}");
    }

    public static function getVendedores()
    {
        return self::request("/api/v1/integracao/configuracao/vendedor");
    }

    public static function createProspect($data)
    {
        return self::request("/api/v1/integracao/prospecto", "POST", $data);
    }
}
