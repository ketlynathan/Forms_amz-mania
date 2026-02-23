<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulário Comercial Multiempresa</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>

    <!-- ================= SELEÇÃO EMPRESA ================= -->
    <section id="selecaoEmpresa" class="selecao active">
        <div class="selecao-box">
            <h1>Selecione a Empresa</h1>

            <div class="cards">
                <div class="card" data-empresa="amazonet">
                    <img src="assets/img/amazonet.png" alt="Logo Amazonet">
                    <span>Amazonet</span>
                </div>

                <div class="card" data-empresa="mania">
                    <img src="assets/img/mania.png" alt="Logo Mania">
                    <span>Mania</span>
                </div>
            </div>

            <button id="btnContinuar" disabled>CONTINUAR</button>
        </div>
    </section>




    <!-- ================= FORMULÁRIO ================= -->
    <main id="formContainer" class="hidden">

        <!-- LOGO TOPO -->
        <header class="topo">
            <img id="logoEmpresa" class="logo" alt="Logo Empresa">
        </header>

        <section class="form-wrapper">

            <!-- MASCOTE ESQUERDA -->
            <div class="mascote-area esquerda">
                <img id="mascoteEsquerda" alt="Mascote Esquerda">
            </div>

            <!-- CONTAINER CENTRAL -->
            <div class="container">
                <!-- ================= SELEÇÃO CEP ================= -->
                <section id="stepCep" class="step">
                    <div class="cep-overlay">
                        <h2>Informe seu CEP</h2>
                        <div class="form-group destaque">
                            <input
                                type="text"
                                id="cep"
                                placeholder="00000-000"
                                maxlength="9"
                                autocomplete="off">
                            <div id="cepFeedback" class="feedback"></div>
                        </div>
                        <button type="button" id="btnBuscarCep">Buscar Endereço</button>
                        <div id="loaderCep" class="loader hidden">Buscando endereço...</div>
                    </div>
                </section>

                <section id="stepForm" class="step hidden">
                    <form id="formulario">
                        <!-- ================= DADOS PESSOAIS ================= -->

                        <div class="form-group">
                            <label>Nome Completo *</label>
                            <input type="text" name="nome" required>
                        </div>

                        <div class="form-group">
                            <label>Data de Nascimento *</label>
                            <input type="date" name="data_nascimento" required>
                        </div>

                        <div class="form-group">
                            <label>CPF *</label>
                            <input type="text" id="cpf" name="cpf" required>
                        </div>

                        <div class="form-group">
                            <label>Email *</label>

                            <input type="email" name="email" required>
                        </div>

                        <div class="form-group">
                            <label>RG *</label>
                            <input type="text" id="rg" inputmode="numeric" pattern="[0-9]*">

                        </div>

                        <div class="form-row">
                            <div class="form-group small">
                                <label>Órgão Emissor *</label>
                                <select id="orgao" name="orgao" required>
                                    <option value="SSP">SSP</option>
                                    <option value="DETRAN">DETRAN</option>
                                    <option value="IGP">IGP</option>
                                    <option value="PC">PC</option>
                                    <option value="SESP">SESP</option>
                                    <option value="SDS">SDS</option>
                                </select>
                            </div>

                            <div class="form-group uf">
                                <label>UF *</label>
                                <select id="uf_rg" name="uf_rg" required></select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Telefone 1 *</label>
                            <input type="tel" id="tel1" name="telefone1" required>
                        </div>

                        <div class="form-group">
                            <label>Telefone 2</label>
                            <input type="tel" id="tel2" name="telefone2">
                        </div>

                        <!-- Endereço já preenchido (readonly exceto número) -->
                        <div class="form-group">
                            <label>CEP</label>
                            <input type="text" id="cepDisplay" readonly>
                        </div>
                        <div class="form-group">
                            <label>Rua</label>
                            <input type="text" id="rua" readonly>
                        </div>
                        <div class="form-group">
                            <label>Número *</label>
                            <input type="text" name="numero" required>
                        </div>
                        <div class="form-group">
                            <label>Bairro</label>
                            <input type="text" id="bairro" readonly>
                        </div>
                        <div class="form-group">
                            <label>Cidade</label>
                            <input type="text" id="cidade" readonly>
                        </div>
                        <div class="form-group">
                            <label>UF</label>
                            <input type="text" id="uf" readonly>
                        </div>

                        <div class="form-group">
                            <label>Plano *</label>
                            <select id="planos" name="plano" required>
                                <option value="">Selecione o plano</option>
                            </select>
                            <div id="loaderPlanos" class="loader hidden">Buscando planos...</div>
                        </div>

                        <div class="form-group">
                            <label>Vendedor *</label>
                            <select id="vendedor" name="vendedor" required>
                                <option value="">Selecione o vendedor</option>
                            </select>
                        </div>


                        <div class="form-group full">
                            <label>Observações *</label>
                            <textarea name="observacoes" required></textarea>
                        </div>

                        <div class="form-group">
                            <label>Frente do Documento *</label>
                            <input type="file" name="doc_frente" required>
                        </div>

                        <div class="form-group">
                            <label>Verso do Documento *</label>
                            <input type="file" name="doc_verso" required>
                        </div>

                        <div class="form-group full">
                            <label>Selfie com Documento *</label>
                            <input type="file" name="selfie_doc" required>
                        </div>

                        <!-- BOTÃO -->
                        <div class="full center">
                            <button type="submit" class="btn-submit">
                                ENVIAR FORMULÁRIO
                            </button>
                        </div>

                    </form>
                </section>
            </div>

            <!-- MASCOTE DIREITA -->
            <div class="mascote-area direita">
                <img id="mascoteDireita" alt="Mascote Direita">
            </div>

        </section>
    </main>

    <script src="assets/js/script.js"></script>
</body>

</html>