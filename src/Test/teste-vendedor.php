<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/src/Config/ApiHubsoftMania.php';

use Src\Config\ApiHubsoftMania;

try {
    $vendedores = ApiHubsoftMania::getVendedores();
    echo "<pre>";
    print_r($vendedores);
    echo "</pre>";
} catch (Exception $e) {
    echo "ERRO: " . $e->getMessage();
}
