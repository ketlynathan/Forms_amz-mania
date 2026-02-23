document.addEventListener("DOMContentLoaded", () => {

    // ================= ESTADO =================
    let empresaSelecionada = null;

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
    const cepDisplay = document.getElementById("cepDisplay");


    const selecao = document.getElementById("selecaoEmpresa");
    const formContainer = document.getElementById("formContainer");
    const btnContinuar = document.getElementById("btnContinuar");
    const cards = document.querySelectorAll(".card");

    const logo = document.getElementById("logoEmpresa");
    const mascoteEsquerda = document.getElementById("mascoteEsquerda");
    const mascoteDireita = document.getElementById("mascoteDireita");

     function irParaStep(idStep) {
        document.querySelectorAll(".step").forEach(step => {
            step.classList.add("hidden");
        });

        const stepAtivo = document.getElementById(idStep);
        if (stepAtivo) {
            stepAtivo.classList.remove("hidden");
        }
    }

    const cpfInput = document.getElementById("cpf");

    cpfInput.addEventListener("input", () => {

        // Remove tudo que não for número
        let value = cpfInput.value.replace(/\D/g, "");

        // Limita a 11 dígitos
        value = value.slice(0, 11);

        // Aplica máscara
        value = value
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        cpfInput.value = value;

    });

    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, "");
        return cpf.length === 11;
    }

    function onlyNumbers(input, maxLength) {
        input.addEventListener("input", () => {
            let value = input.value.replace(/\D/g, "");
            input.value = value.slice(0, maxLength);
        });
    }

    

    const tel1 = document.getElementById("tel1");
    const tel2 = document.getElementById("tel2");

    function aplicarMascaraTelefone(input) {

        if (!input) return;

        input.addEventListener("input", () => {

            let value = input.value.replace(/\D/g, "").slice(0, 11);

            if (value.length > 10) {
                value = value.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
            } else {
                value = value.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");
            }

            input.value = value;
        });
    }

    aplicarMascaraTelefone(tel1);
    aplicarMascaraTelefone(tel2);

    const rgInput = document.getElementById("rg");

    rgInput.addEventListener("input", () => {

        let value = rgInput.value.replace(/\D/g, "");

        value = value.slice(0, 9); // ajuste conforme regra

        rgInput.value = value;

    });

    // ================= ESTADO INICIAL =================
    formContainer.classList.add("hidden");
    stepForm.classList.remove("hidden");

    // =========================================================
    // ================= SELEÇÃO DE EMPRESA ====================
    // =========================================================
    
    
    cards.forEach(card => {
        card.addEventListener("click", () => {

            cards.forEach(c => c.classList.remove("ativo"));
            card.classList.add("ativo");

            empresaSelecionada = card.dataset.empresa;
            btnContinuar.disabled = false;
        });
    });

    btnContinuar.addEventListener("click", () => {

        if (!empresaSelecionada) return;

        aplicarTema(empresaSelecionada);

        selecao.classList.add("hidden");
        formContainer.classList.remove("hidden");
        
        irParaStep("stepCep");

        //cepInput.focus();
    });
   

    // =========================================================
    // ================= TEMA DINÂMICO =========================
    // =========================================================
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

    // =========================================================
    // ================= MÁSCARA CEP ===========================
    // =========================================================
    cepInput.addEventListener("input", () => {
        let v = cepInput.value.replace(/\D/g, '');
        if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
        cepInput.value = v;
    });

    // ================= FUNÇÃO PLANOS =================
    async function carregarPlanos(cep) {
        try {
            const response = await fetch(`/api.php/api/planos?cep=${cep}`);
            const data = await response.json();

            console.log("Resposta completa da API:", data);
            console.log("Tipo:", typeof data);
            console.log("É array?", Array.isArray(data));

        } catch (error) {
            console.error("Erro ao carregar planos:", error);
        }
    }

    // =========================================================
    // ================= BUSCAR CEP + PLANOS ===================
    // =========================================================
    btnBuscarCep.addEventListener("click", async () => {

        const cep = cepInput.value.replace(/\D/g, "");

        if (cep.length !== 8) {
            cepFeedback.textContent = "CEP inválido!";
            return;
        }

        btnBuscarCep.disabled = true;
        loaderCep.classList.remove("hidden");

        try {

            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const endereco = await response.json();

            if (endereco.erro) {
                cepFeedback.textContent = "CEP não encontrado!";
                return;
            }

            ruaInput.value = endereco.logradouro || "";
            bairroInput.value = endereco.bairro || "";
            cidadeInput.value = endereco.localidade || "";
            ufInput.value = endereco.uf || "";
            cepDisplay.value = endereco.cep || "";

            await carregarPlanos(cep);

            irParaStep("stepForm");

        } catch (error) {
            console.error(error);
            cepFeedback.textContent = "Erro ao buscar CEP.";
        } finally {
            loaderCep.classList.add("hidden");
            btnBuscarCep.disabled = false;
        }

    });
    
});