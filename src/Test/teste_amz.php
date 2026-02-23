<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/src/Config/ApiHubsoft.php';

use Src\Config\ApiHubsoft;

$erro = null;
$vendedores = [];
$servicos = [];
$cep = $_POST['cep'] ?? null;

try {

    // Define empresa AMAZONET
    ApiHubsoft::setEmpresa('amazonet');

    // Busca vendedores
    $vendedores = ApiHubsoft::getVendedores();

    // Busca planos se informou CEP
    if (!empty($cep)) {
        $servicos = ApiHubsoft::getServicos($cep);
    }
} catch (Exception $e) {
    $erro = $e->getMessage();
}
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Teste API Amazonet</title>
    <style>
        body {
            font-family: Arial;
            padding: 40px;
            background: #f4f6f9;
        }

        select,
        input,
        button {
            padding: 8px;
            margin: 5px 0;
            width: 320px;
        }

        .erro {
            color: red;
            font-weight: bold;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>

    <h1>Teste API Amazonet</h1>

    <?php if ($erro): ?>
        <div class="erro">ERRO: <?= $erro ?></div>
    <?php endif; ?>

    <form method="POST">

        <h2>1️⃣ Vendedores</h2>

        <select name="vendedor_id" required>
            <option value="">Selecione vendedor</option>

            <?php if (!empty($vendedores['vendedores'])): ?>
                <?php foreach ($vendedores['vendedores'] as $vendedor): ?>
                    <option value="<?= $vendedor['id']; ?>">
                        <?= htmlspecialchars($vendedor['name']); ?>
                    </option>
                <?php endforeach; ?>
            <?php endif; ?>
        </select>

        <h2>2️⃣ Buscar Planos por CEP</h2>

        <input
            type="text"
            name="cep"
            placeholder="Digite o CEP"
            value="<?= htmlspecialchars($cep ?? '') ?>"
            required>

        <br>
        <button type="submit">Buscar Planos</button>

    </form>

    <?php if (!empty($cep) && !empty($servicos['servicos'])): ?>

        <h2>Planos disponíveis</h2>

        <select name="plano_id" required>
            <option value="">Selecione um plano</option>

            <?php foreach ($servicos['servicos'] as $plano): ?>
                <option value="<?= $plano['id_servico']; ?>">
                    <?= htmlspecialchars($plano['descricao']); ?>
                    - R$ <?= number_format($plano['valor'], 2, ',', '.'); ?>
                </option>
            <?php endforeach; ?>

        </select>

    <?php endif; ?>

</body>

</html>