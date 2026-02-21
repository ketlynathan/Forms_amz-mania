document.addEventListener("DOMContentLoaded", () => {

    let empresaSelecionada = null;

    const selecao = document.getElementById("selecaoEmpresa");
    const formContainer = document.getElementById("formContainer");
    const btnContinuar = document.getElementById("btnContinuar");
    const cards = document.querySelectorAll(".card");

    const logo = document.getElementById("logoEmpresa");
    const mascoteEsquerda = document.getElementById("mascoteEsquerda");
    const mascoteDireita = document.getElementById("mascoteDireita");

    // Campos CEP e endereço
    const cepInput = document.getElementById("cep");
    const btnBuscarCep = document.getElementById("btnBuscarCep");
    const loaderCep = document.getElementById("loaderCep");
    const cepFeedback = document.getElementById("cepFeedback");

    const ruaInput = document.getElementById("rua");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const ufInput = document.getElementById("uf");
    const cepDisplay = document.getElementById("cepDisplay");

    // Planos
    const selectPlanos = document.getElementById("planos");
    const form = document.getElementById("formulario");

    formContainer.style.display = "block";   // mantém visível
    stepCep.classList.remove("hidden");
    stepForm.classList.add("hidden");

    // ------------------ SELEÇÃO DE EMPRESA ------------------
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

        selecao.style.display = "none";
        formContainer.style.display = "block";
        form.style.display = "none"; // esconde form completo até carregar CEP
        cepInput.focus();
    });

    function aplicarTema(empresa) {
        if (empresa === "amazonet") {
            logo.src = "assets/img/amazonet-logo.png";
            mascoteEsquerda.src = "assets/img/bg_amazonet_left.png";
            mascoteDireita.src = "assets/img/bg_amazonet_right.png";
            document.documentElement.style.setProperty("--cor-primaria", "#052654");
            document.documentElement.style.setProperty("--cor-botao", "#05853a");
        }
        if (empresa === "mania") {
            logo.src = "assets/img/mania_semfundo.png";
            mascoteEsquerda.src = "assets/img/bg_mania_left.png";
            mascoteDireita.src = "assets/img/bg_mania_right.png";
            document.documentElement.style.setProperty("--cor-primaria", "#155ee4");
            document.documentElement.style.setProperty("--cor-botao", "#19d6a1");
        }
    }

    // ------------------ MÁSCARA CEP ------------------
    cepInput.addEventListener("input", () => {
        let v = cepInput.value.replace(/\D/g, '');
        if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
        cepInput.value = v;
    });

    // ------------------ BOTÃO BUSCAR CEP ------------------
    btnBuscarCep.addEventListener("click", async () => {
        let cep = cepInput.value.replace(/\D/g, "");

        if (cep.length !== 8) {
            cepFeedback.textContent = "CEP inválido!";
            return;
        }

        loaderCep.classList.remove("hidden");
        cepFeedback.textContent = "";

        try {
            // Consulta ViaCEP
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();

            loaderCep.classList.add("hidden");

            if (data.erro) {
                cepFeedback.textContent = "CEP não encontrado!";
                return;
            }

            // Preencher campos
            ruaInput.value = data.logradouro || "";
            bairroInput.value = data.bairro || "";
            cidadeInput.value = data.localidade || "";
            ufInput.value = data.uf || "";
            cepDisplay.value = data.cep;

            // Carregar planos dinamicamente
            await carregarPlanos(cep);

            // Mostrar formulário completo
            form.style.display = "grid";

        } catch (err) {
            loaderCep.classList.add("hidden");
            console.error(err);
            cepFeedback.textContent = "Erro ao buscar CEP!";
        }
    });

    // ------------------ FUNÇÃO CARREGAR PLANOS ------------------
    async function carregarPlanos(cep) {
        selectPlanos.disabled = true;
        selectPlanos.innerHTML = '<option>Carregando planos...</option>';

        let apiUrl = "";
        if (empresaSelecionada === "mania") {
            apiUrl = `https://api.mania.com/planos?cep=${cep}`;
        } else if (empresaSelecionada === "amazonet") {
            apiUrl = `https://api.amazonet.com/planos?cep=${cep}`;
        }

        try {
            // Simulando fetch
            // Substitua pelo fetch real da sua API
            // const response = await fetch(apiUrl);
            // const dados = await response.json();
            const dados = [
                { id: 1, nome: "Plano Básico" },
                { id: 2, nome: "Plano Premium" },
                { id: 3, nome: "Plano Empresarial" }
            ];

            selectPlanos.innerHTML = '<option value="">Selecione um plano</option>';
            dados.forEach(plano => {
                const option = document.createElement("option");
                option.value = plano.id;
                option.textContent = plano.nome;
                selectPlanos.appendChild(option);
            });

            selectPlanos.disabled = false;

        } catch (err) {
            console.error(err);
            selectPlanos.innerHTML = '<option value="">Erro ao carregar planos</option>';
        }
    }

});