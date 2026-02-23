document.addEventListener("DOMContentLoaded", () => {
    // ================= ESTADO =================
    let empresaSelecionada = null;
    let token = null;
    let vendedores = [];
    let servicos = [];

    // ================= ELEMENTOS =================
    const stepCep = document.getElementById("stepCep");
    const stepForm = document.getElementById("stepForm");

    const cepInput = document.getElementById("cep");
    const btnBuscarCep = document.getElementById("btnBuscarCep");
    const loaderCep = document.getElementById("loaderCep");
    const cepFeedback = document.getElementById("cepFeedback");

    const ruaInput = document.getElementById("rua");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const ufInput = document.getElementById("uf");
    const ufSelect = document.getElementById("uf_rg");
    const cepDisplay = document.getElementById("cepDisplay");

    const selecao = document.getElementById("selecaoEmpresa");
    const formContainer = document.getElementById("formContainer");
    const btnContinuar = document.getElementById("btnContinuar");
    const cards = document.querySelectorAll(".card");

    const logo = document.getElementById("logoEmpresa");
    const mascoteEsquerda = document.getElementById("mascoteEsquerda");
    const mascoteDireita = document.getElementById("mascoteDireita");
    const selectPlano = document.getElementById("planos");
    const selectVendedor = document.getElementById("vendedor");

    // ---------------- FUNÇÕES ----------------
    function irParaStep(idStep) {
        document.querySelectorAll(".step").forEach(s => s.classList.add("hidden"));
        document.getElementById(idStep).classList.remove("hidden");
    }

    function popularVendedores(lista) {
        if (!selectVendedor) return;
        selectVendedor.innerHTML = '<option value="">Selecione o vendedor</option>';
        lista.forEach(v => {
            const opt = document.createElement("option");
            opt.textContent = v.name;
            selectVendedor.appendChild(opt);
        });
    }

    function popularPlanos(lista) {
        if (!selectPlano) return;
        selectPlano.innerHTML = '<option value="">Selecione o plano</option>';
        lista.forEach(s => {
            const opt = document.createElement("option");
            opt.textContent = `${s.descricao} - R$ ${s.valor}`;
            selectPlano.appendChild(opt);
        });
        document.getElementById("loaderPlanos")?.classList.add("hidden");
    }

    function preencherEndereco(data) {
        if (!data || data.erro) return alert("CEP não encontrado");
        ruaInput.value = data.logradouro || "";
        bairroInput.value = data.bairro || "";
        cidadeInput.value = data.localidade || "";
        ufInput.value = data.uf || "";
        cepDisplay.value = data.cep || "";
    }

    async function buscarServicos(cep) {
        try {
            const res = await fetch(`api.php?acao=servicos&empresa=${empresaSelecionada}&cep=${cep}`);
            const json = await res.json();
            servicos = json.data?.servicos || [];

            if (servicos.length === 0) {
                alert("Não há serviços disponíveis para este CEP.");
                selectPlano.innerHTML = '<option value="">Nenhum plano disponível</option>';
                btnContinuar.disabled = true; // desabilita continuar
            } else {
                popularPlanos(servicos);
                btnContinuar.disabled = false;
            }
        } catch (err) {
            console.error("Erro ao buscar serviços:", err);
            alert("Erro ao carregar serviços.");
        }
    }


    // ================= POPULAR UF =================
    const estados = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
        "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

    if (ufSelect) {
        ufSelect.innerHTML = "";
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Selecione";
        ufSelect.appendChild(defaultOption);
        estados.forEach(uf => {
            const option = document.createElement("option");
            option.value = uf;
            option.textContent = uf;
            ufSelect.appendChild(option);
        });
    }

    // ================= MÁSCARA CPF =================
    const cpfInput = document.getElementById("cpf");
    cpfInput.addEventListener("input", () => {
        let value = cpfInput.value.replace(/\D/g, "").slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        cpfInput.value = value;
    });

    // ================= MÁSCARA TELEFONE =================
    const tel1 = document.getElementById("tel1");
    const tel2 = document.getElementById("tel2");

    function aplicarMascaraTelefone(input) {
        if (!input) return;
        input.addEventListener("input", () => {
            let value = input.value.replace(/\D/g, "").slice(0, 11);
            if (value.length > 10) value = value.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
            else value = value.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");
            input.value = value;
        });
    }
    aplicarMascaraTelefone(tel1);
    aplicarMascaraTelefone(tel2);

    // ================= MÁSCARA RG =================
    const rgInput = document.getElementById("rg");
    rgInput.addEventListener("input", () => {
        rgInput.value = rgInput.value.replace(/\D/g, "").slice(0, 9);
    });

    // ================= ESTADO INICIAL =================
    formContainer.classList.add("hidden");

    // ---------------- SELEÇÃO DE EMPRESA ----------------
    cards.forEach(card => {
        card.addEventListener("click", async () => {
            cards.forEach(c => c.classList.remove("ativo"));
            card.classList.add("ativo");
            empresaSelecionada = card.dataset.empresa;
            btnContinuar.disabled = false;

            aplicarTema(empresaSelecionada);

            try {
                const tokenResp = await fetch(`api.php?acao=token&empresa=${empresaSelecionada}`);
                token = (await tokenResp.json()).token;

                const vendedoresResp = await fetch(`api.php?acao=vendedores&empresa=${empresaSelecionada}`);
                vendedores = (await vendedoresResp.json()).data?.vendedores || [];
                popularVendedores(vendedores);
            } catch (err) {
                console.error("Erro ao carregar token ou vendedores:", err);
            }
        });
    });

    btnContinuar.addEventListener("click", () => {
        if (!empresaSelecionada) return;
        selecao.classList.add("hidden");
        formContainer.classList.remove("hidden");
        irParaStep("stepCep");
    });


    function aplicarTema(empresa) {
        const temas = {
            amazonet: {
                logo: "assets/img/amazonet-logo.png",
                left: "assets/img/bg_amazonet_left.png",
                right: "assets/img/bg_amazonet_right.png",
                primaria: "#052654",
                botao: "#05853a"
            },
            mania: {
                logo: "assets/img/mania_semfundo.png",
                left: "assets/img/bg_mania_left.png",
                right: "assets/img/bg_mania_right.png",
                primaria: "#155ee4",
                botao: "#19d6a1"
            }
        };
        const tema = temas[empresa];
        if (!tema) return;
        logo.src = tema.logo;
        mascoteEsquerda.src = tema.left;
        mascoteDireita.src = tema.right;
        document.documentElement.style.setProperty("--cor-primaria", tema.primaria);
        document.documentElement.style.setProperty("--cor-botao", tema.botao);
    }

    // ================= MÁSCARA CEP =================
    cepInput.addEventListener("input", () => {
        let v = cepInput.value.replace(/\D/g, "");
        if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
        cepInput.value = v;
    });

    // ================= BUSCA CEP COM CACHE E JSONP =================
    const cepCache = {};
    function buscarCepJSONP(cep, callbackName) {
        const script = document.createElement('script');
        script.src = `https://viacep.com.br/ws/${cep}/json/?callback=${callbackName}`;
        document.body.appendChild(script);
    }



    window.cepCallback = async function (data) {
        const cep = data.cep.replace(/\D/g, "");
        cepCache[cep] = data;
        preencherEndereco(data);

        // 🔹 Chamar API de serviços
        try {
            const resServicos = await fetch(`api.php?acao=servicos&empresa=${empresaSelecionada}&cep=${cep}`);
            const servicosJson = await resServicos.json();
            servicos = servicosJson.data?.servicos || [];
            console.log("Serviços disponíveis:", servicos);

        } catch (err) {
            console.error("Erro ao buscar serviços:", err);
        }

        irParaStep("stepForm");
    };

    // ---------------- CEP ----------------
    btnBuscarCep.addEventListener("click", async () => {
        let cep = cepInput.value.replace(/\D/g, "");
        if (cep.length !== 8) return alert("CEP inválido");

        loaderCep.classList.remove("hidden");
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (data.erro) throw new Error("CEP não encontrado");

            cepCache[cep] = data;
            preencherEndereco(data);
            await buscarServicos(cep);
            irParaStep("stepForm");
        } catch (err) {
            alert(err.message);
            // Permitir que o usuário preencha manualmente
            ruaInput.value = "";
            bairroInput.value = "";
            cidadeInput.value = "";
            ufInput.value = "";
            irParaStep("stepForm");
        } finally {
            loaderCep.classList.add("hidden");
        }
    });

    // ================= FUNÇÃO PARA CRIAR PROSPECTO =================
    function prepararProspect() {
        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
        const telefone = document.getElementById("tel1").value.replace(/\D/g, "");
        const telefone2 = document.getElementById("tel2").value.replace(/\D/g, "");
        const rg = document.getElementById("rg").value;
        const cep = cepInput.value.replace(/\D/g, "");
        const rua = ruaInput.value;
        const bairro = bairroInput.value;
        const cidade = cidadeInput.value;
        const uf = ufInput.value;
        const email = document.getElementById("email").value;

        return { nome, cpf, telefone, telefone2, rg, cep, rua, bairro, cidade, uf, email, empresa: empresaSelecionada };
    }

    // 🔹 Exemplo de uso: console.log(prepararProspect());
});