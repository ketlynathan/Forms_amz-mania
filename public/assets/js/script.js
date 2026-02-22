document.addEventListener("DOMContentLoaded", () => {

    // ================= ESTADO =================
    let empresaSelecionada = null;

    // ================= ELEMENTOS =================
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
        cepFeedback.textContent = "";

        try {

            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const endereco = await response.json();

            if (endereco.erro) {
                cepFeedback.textContent = "CEP não encontrado!";
                return;
            }

            // Preenche antes de trocar step
            ruaInput.value = endereco.logradouro || "";
            bairroInput.value = endereco.bairro || "";
            cidadeInput.value = endereco.localidade || "";
            ufInput.value = endereco.uf || "";
            cepDisplay.value = endereco.cep || "";

            // Troca step
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