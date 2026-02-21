document.addEventListener("DOMContentLoaded", () => {

    let empresaSelecionada = null;

    const selecao = document.getElementById("selecaoEmpresa");
    const formContainer = document.getElementById("formContainer");
    const btnContinuar = document.getElementById("btnContinuar");
    const cards = document.querySelectorAll(".card");

    const logo = document.getElementById("logoEmpresa");
    const mascoteEsquerda = document.getElementById("mascoteEsquerda");
    const mascoteDireita = document.getElementById("mascoteDireita");

    const cepInput = document.getElementById("cep");
    const ruaInput = document.getElementById("rua");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const ufInput = document.getElementById("uf");
    const selectPlanos = document.getElementById("planos");
    const loader = document.getElementById("loader");
    const cepErro = document.getElementById("cepErro");

    // Seleção de empresa
    cards.forEach(card => {
        card.addEventListener("click", () => {
            cards.forEach(c => c.classList.remove("ativo"));
            card.classList.add("ativo");
            empresaSelecionada = card.dataset.empresa;
            btnContinuar.disabled = false;
        });
    });

    // Ao continuar, mostra a tela de CEP primeiro
    btnContinuar.addEventListener("click", () => {
        if (!empresaSelecionada) return;
        aplicarTema(empresaSelecionada);
        selecao.style.display = "none";

        // Exibe apenas o CEP primeiro
        formContainer.style.display = "block";
        document.querySelector("#formulario").style.display = "none";
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

    // =================== FUNÇÕES DE ENDEREÇO ===================
    async function buscarCep(cep) {
        try {
            loader.style.display = "block";
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            loader.style.display = "none";

            if (data.erro) {
                cepErro.innerText = "CEP não encontrado";
                return null;
            }

            ruaInput.value = data.logradouro || '';
            bairroInput.value = data.bairro || '';
            cidadeInput.value = data.localidade || '';
            ufInput.value = data.uf || '';
            cepErro.innerText = '';

            return data;
        } catch (err) {
            loader.style.display = "none";
            console.error(err);
            cepErro.innerText = "Erro ao buscar CEP";
            return null;
        }
    }

    // =================== FUNÇÃO DE PLANOS ===================
    async function carregarPlanos(cep) {
        loader.style.display = "block";
        selectPlanos.disabled = true;
        selectPlanos.innerHTML = '<option>Carregando planos...</option>';

        let apiUrl = "";
        if (empresaSelecionada === "mania") {
            apiUrl = `https://api.mania.com/planos?cep=${cep}`;
        } else if (empresaSelecionada === "amazonet") {
            apiUrl = `https://api.amazonet.com/planos?cep=${cep}`;
        }

        try {
            const response = await fetch(apiUrl);
            const dados = await response.json();

            selectPlanos.innerHTML = '<option value="">Selecione um plano</option>';

            if (!dados || dados.length === 0) {
                selectPlanos.innerHTML = '<option value="">Nenhum plano disponível</option>';
                return;
            }

            dados.forEach(plano => {
                const option = document.createElement('option');
                option.value = plano.id;
                option.textContent = plano.nome;
                selectPlanos.appendChild(option);
            });

            selectPlanos.disabled = false;

        } catch (err) {
            console.error(err);
            selectPlanos.innerHTML = '<option value="">Erro ao carregar planos</option>';
        } finally {
            loader.style.display = "none";
        }
    }

    // =================== EVENTO CEP ===================
    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length === 8) {
            const endereco = await buscarCep(cep);
            if (endereco) {
                await carregarPlanos(cep);
                // Mostra o formulário completo depois do CEP e planos
                document.querySelector("#formulario").style.display = "grid";
            }
        }
    });

});