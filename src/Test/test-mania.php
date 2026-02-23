<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../Config/ApiHubsoftMania.php';
//require_once __DIR__ . '/../Config/ApiHubsoft.php';
use Src\Config\ApiHubsoftMania;

$erro = null;
$token = null;
$vendedores = [];
$servicos = [];
$cep = $_POST['cep'] ?? null;

try {

    // 1️⃣ Token
    $token = ApiHubsoftMania::getToken();

    // 2️⃣ Vendedores
    $vendedores = ApiHubsoftMania::getVendedores();

    // 3️⃣ Planos por CEP
    if (!empty($cep)) {
        $servicos = ApiHubsoftMania::getServicos($cep);
    }
} catch (Exception $e) {
    $erro = $e->getMessage();
}
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Teste API Mania</title>
    <style>
        body {
            font-family: Arial;
            padding: 40px;
            background: #f4f6f9;
        }

        h2 {
            margin-top: 40px;
        }

        select,
        input,
        button {
            padding: 8px;
            margin: 5px 0;
            width: 320px;
        }

        button {
            cursor: pointer;
        }

        .erro {
            color: red;
            font-weight: bold;
            margin-bottom: 20px;
        }

        pre {
            background: #111;
            color: #0f0;
            padding: 15px;
            overflow: auto;
        }
    </style>
</head>

<body>

    <h1>Teste API Mania</h1>

    <?php if ($erro): ?>
        <div class="erro">ERRO: <?= $erro ?></div>
    <?php endif; ?>

    <h2>1️⃣ Token</h2>

    <pre>
<?php
if (!empty($token)) {
    echo "TOKEN OK\n";
    echo substr($token, 0, 50) . "...";
}
?>
</pre>

    <h2>2️⃣ Vendedores</h2>

    <form method="POST">

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

        <h2>3️⃣ Buscar Planos por CEP</h2>

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

                <?php
                $id = $plano['id_servico'];
                $descricao = $plano['descricao'];
                $valor = number_format($plano['valor'], 2, ',', '.');
                ?>

                <option value="<?= $id ?>">
                    <?= htmlspecialchars($descricao) ?> - R$ <?= $valor ?>
                </option>

            <?php endforeach; ?>

        </select>

    <?php endif; ?>

</body>

</html>