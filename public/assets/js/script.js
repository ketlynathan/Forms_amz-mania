document.addEventListener("DOMContentLoaded", () => {
    // ================= ESTADO =================
    let empresaSelecionada = null;
    let token = null;
    let vendedores = [];
    let servicos = [];

    // ================= ELEMENTOS =================
    const stepCep = document.getElementById("stepCep");
    const stepForm = document.getElementById("stepForm");

    const form = document.getElementById("formulario");
    const btnSubmit = document.querySelector(".btn-submit");

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
    const dataInput = document.getElementById("data_nascimento");
    const erroData = document.getElementById("erroData");

    const containerVoltar = document.getElementById("containerVoltar");
    const btnVoltar = document.querySelector(".btn-voltar");

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
            opt.value = v.id;        // 🔥 AQUI ESTÁ A CORREÇÃO
            opt.textContent = v.name;
            selectVendedor.appendChild(opt);
        });
    }

    function popularPlanos(lista) {
        if (!selectPlano) return;

        selectPlano.innerHTML = '<option value="">Selecione o plano</option>';

        lista.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.id_servico;                // 🔥 ID real
            opt.dataset.valor = s.valor;     // 🔥 VALOR real
            opt.textContent = `${s.descricao} - R$ ${s.valor}`;
            selectPlano.appendChild(opt);
        });
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

                selectPlano.innerHTML = '<option value="">Nenhum plano disponível</option>';
                selectPlano.disabled = true;

                showToast(
                    `${empresaSelecionada.toUpperCase()} não possui cobertura neste CEP.`,
                    "warning"
                );

                containerVoltar.classList.remove("hidden");

                return false; // 🔥 IMPORTANTE
            }

            popularPlanos(servicos);
            selectPlano.disabled = false;
            containerVoltar.classList.add("hidden");

            return true; // 🔥 IMPORTANTE

        } catch (err) {
            console.error("Erro ao buscar serviços:", err);
            showToast("Erro ao carregar serviços.", "error");
            return false;
        }
    }

    function showToast(message, type = "success") {
        const toast = document.getElementById("toast");

        toast.className = `toast ${type}`;
        toast.innerText = message;

        toast.classList.remove("hidden");

        setTimeout(() => {
            toast.classList.add("show");
        }, 50);

        setTimeout(() => {
            toast.classList.remove("show");

            setTimeout(() => {
                toast.classList.add("hidden");
            }, 400);

        }, 4000);
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
                // 🔎 FILTRO AQUI
                vendedores = vendedores.filter(v =>
                    v.name && /(tec|autonomo|auto)/i.test(v.name)
                );

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
    function mostrarErro(mensagem) {
        erroData.innerText = mensagem;
        erroData.style.display = "block";
        dataInput.classList.add("input-erro");

        dataInput.focus();
    }


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


    // ---------------- CEP ----------------
    btnBuscarCep.addEventListener("click", async () => {

        let cep = cepInput.value.replace(/\D/g, "");

        // 🔎 Validação básica
        if (cep.length !== 8) {
            showToast("Digite um CEP válido com 8 números.", "warning");
            cepInput.focus();
            return;
        }

        loaderCep.classList.remove("hidden");

        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();

            // ❌ CEP inexistente
            if (data.erro) {
                showToast("CEP não encontrado. Verifique e tente novamente.", "error");
                cepInput.focus();
                return;
            }

            // ✅ CEP válido
            cepCache[cep] = data;
            preencherEndereco(data);

            await buscarServicos(cep);

            showToast("CEP encontrado com sucesso!", "success");

            irParaStep("stepForm");

        } catch (err) {

            showToast("Erro ao consultar CEP. Tente novamente.", "error");

            ruaInput.value = "";
            bairroInput.value = "";
            cidadeInput.value = "";
            ufInput.value = "";

        } finally {
            loaderCep.classList.add("hidden");
        }

    });

    // ================= FUNÇÃO PARA CRIAR PROSPECTO =================
    if (!form) {
        console.error("Formulário não encontrado!");
        return;
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (!empresaSelecionada) {
            showToast("Selecione uma empresa antes de enviar.", "warning");
            return;
        }

        if (!selectPlano.value) {
            showToast("Selecione um plano antes de enviar.", "warning");
            return;
        }


        const bloqueio = localStorage.getItem("bloqueioProspecto");
        if (bloqueio && Date.now() < parseInt(bloqueio)) {
            showToast("Aguarde alguns minutos antes de enviar novo cadastro.", "warning");
            return;
        }




        const dados = {
            nome_razaosocial: form.nome.value,
            cpf_cnpj: form.cpf.value.replace(/\D/g, ""),
            data_nascimento: form.data_nascimento.value,
            email: form.email.value,
            rg: document.getElementById("rg").value,
            rg_emissor: document.getElementById("orgao").value,
            rg_uf: document.getElementById("uf_rg").value,

            telefone: tel1.value.replace(/\D/g, ""),
            telefone_secundario: tel2?.value.replace(/\D/g, "") || "",

            // 🔥 ENDEREÇO
            cep: cepDisplay.value.replace(/\D/g, ""),
            endereco: ruaInput.value,
            numero: form.numero.value,
            bairro: bairroInput.value,
            cidade: cidadeInput.value,
            estado: ufInput.value,

            // 🔥 PLANO
            servico: {
                id_servico: Number(selectPlano.value),
                valor: Number(selectPlano.selectedOptions[0]?.dataset.valor)
            },

            // 🔥 VENDEDOR
            id_vendedor: parseInt(selectVendedor.value),

            observacao: form.observacoes.value,

            tipo_pessoa: "pf",
            nacionalidade: "brasileiro"
        };

        try {
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerText = "Enviando...";
            }

            const formData = new FormData(form);


            const response = await fetch(
                `api.php?acao=createProspect&empresa=${empresaSelecionada}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                }
            );

            const result = await response.json();

            if (result.success) {
                showToast("Enviado com sucesso!", "success");
                form.reset();
            } else {
                showToast(result.error || "Erro ao enviar.", "error");
            }

        } catch (error) {
            console.error(error);
            showToast("Erro ao conectar com servidor.", "error");
        } finally {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerText = "ENVIAR FORMULÁRIO";
            }
        }
    });
    if (btnVoltar) {
        btnVoltar.addEventListener("click", () => {

            // reset empresa
            empresaSelecionada = null;

            // limpar seleção visual
            cards.forEach(c => c.classList.remove("ativo"));

            // reset formulário
            form.reset();
            selectPlano.innerHTML = '<option value="">Selecione o plano</option>';
            selectPlano.disabled = true;

            // esconder botão voltar
            containerVoltar.classList.add("hidden");

            // voltar para tela inicial
            formContainer.classList.add("hidden");
            selecao.classList.remove("hidden");

            showToast("Escolha uma empresa para continuar.", "success");
        });
    }


});