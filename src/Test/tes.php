<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: text/html; charset=utf-8');

$ceps = [
    'mania' => '68030590',
    'amazonet' => '68030590'
];

function chamarApi($empresa, $acao, $params = [])
{
    $url = 'http://localhost/public/api.php?acao=' . $acao . '&empresa=' . $empresa;
    if (!empty($params)) {
        $url .= '&' . http_build_query($params);
    }
    $res = file_get_contents($url);
    return json_decode($res, true);
}

$empresas = ['mania', 'amazonet'];

foreach ($empresas as $empresa):
    $cep = $ceps[$empresa];

    // Buscar vendedores
    $vendedoresResp = chamarApi($empresa, 'vendedores');
    $vendedores = $vendedoresResp['data']['vendedores'] ?? [];

    // Buscar serviços pelo CEP
    $servicosResp = chamarApi($empresa, 'servicos', ['cep' => $cep]);
    $servicos = $servicosResp['data']['servicos'] ?? [];
?>
    <h2>Empresa: <?= ucfirst($empresa) ?></h2>

    <h3>Vendedores</h3>
    <select>
        <option value="">Selecione o vendedor</option>
        <?php foreach ($vendedores as $v): ?>
            <option value="<?= $v['id'] ?>"><?= htmlspecialchars($v['name']) ?></option>
        <?php endforeach; ?>
    </select>

    <h3>Planos / Serviços</h3>
    <select>
        <option value="">Selecione o plano</option>
        <?php foreach ($servicos as $s): ?>
            <option value="<?= $s['id_servico'] ?>">
                <?= htmlspecialchars($s['descricao']) ?> - R$ <?= number_format($s['valor'], 2, ',', '.') ?>
            </option>
        <?php endforeach; ?>
    </select>
    <hr>
<?php endforeach; ?>