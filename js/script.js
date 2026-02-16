document.addEventListener("DOMContentLoaded", () => {
    let empresaSelecionada = null;

    const cards = document.querySelectorAll(".card");
    const btnContinuar = document.getElementById("btnContinuar");
    const selecao = document.getElementById("selecaoEmpresa");
    const formContainer = document.getElementById("formContainer");
    const logo = document.getElementById("logoEmpresa");
    const mascoteEsquerda = document.getElementById("mascoteEsquerda");
    const mascoteDireita = document.getElementById("mascoteDireita");
    const root = document.documentElement;

    // Campos do formulário
    const cpfInput = document.getElementById("cpf");
    const cepInput = document.getElementById("cep");
    const tel1Input = document.getElementById("tel1");
    const tel2Input = document.getElementById("tel2");
    const ruaInput = document.getElementById("rua");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const ufInput = document.getElementById("uf");

    /* ================= SELEÇÃO EMPRESA ================= */
    cards.forEach(card => {
        card.addEventListener("click", () => {
            cards.forEach(c => c.classList.remove("ativo"));
            card.classList.add("ativo");
            empresaSelecionada = card.dataset.empresa;
            btnContinuar.disabled = !empresaSelecionada;
        });
    });

    btnContinuar.addEventListener("click", () => {
        if (!empresaSelecionada) return;
        aplicarTema(empresaSelecionada);
        selecao.classList.remove("active");
        setTimeout(() => {
            selecao.style.display = "none";
            formContainer.style.display = "block";
            setTimeout(() => formContainer.classList.add("active"), 50);
        }, 500);
    });

    /* ================= SISTEMA DE TEMA ================= */
    function aplicarTema(empresa) {
        logo.src = "";
        mascoteEsquerda.src = "";
        mascoteDireita.src = "";
        document.querySelector(".topo").className = "topo";

        if (empresa === "amazonet") {
            logo.src = "img/amazonet-logo.png";
            mascoteEsquerda.src = "img/bg_amazonet_left.png";
            mascoteDireita.src = "img/bg_amazonet_right.png";
            root.style.setProperty("--cor-primaria", "#052654");
            root.style.setProperty("--cor-secundaria", "#114b9b");
            root.style.setProperty("--cor-botao", "#05853a");
            document.querySelector(".topo").classList.add("amazonet-theme");
        }

        if (empresa === "mania") {
            logo.src = "img/mania_semfundo.png";
            mascoteEsquerda.src = "img/bg_mania_left.png";
            mascoteDireita.src = "img/bg_mania_right.png";
            root.style.setProperty("--cor-primaria", "#155ee4");
            root.style.setProperty("--cor-secundaria", "#002866");
            root.style.setProperty("--cor-botao", "#00F5B0");
        }
    }

    /* ================= VALIDAÇÃO E MÁSCARA CPF ================= */
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let sum = 0;
        for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
        let rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(9))) return false;
        sum = 0;
        for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (sum % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(10))) return false;
        return true;
    }

    function aplicarMascaraCPF(input) {
        input.addEventListener("input", () => {
            let valor = input.value.replace(/\D/g, '');
            if (valor.length > 11) valor = valor.slice(0, 11);

            if (valor.length <= 3) valor = valor;
            else if (valor.length <= 6) valor = `${valor.slice(0, 3)}.${valor.slice(3)}`;
            else if (valor.length <= 9) valor = `${valor.slice(0, 3)}.${valor.slice(3, 6)}.${valor.slice(6)}`;
            else valor = `${valor.slice(0, 3)}.${valor.slice(3, 6)}.${valor.slice(6, 9)}-${valor.slice(9)}`;

            input.value = valor;
        });

        input.addEventListener("blur", () => {
            const cpfErro = document.getElementById("cpfErro");
            const valor = input.value.replace(/\D/g, '');
            if (!validarCPF(valor)) {
                input.classList.add("input-erro");
                cpfErro.textContent = "CPF inválido";
            } else {
                input.classList.remove("input-erro");
                cpfErro.textContent = "";
            }
        });
    }
    aplicarMascaraCPF(cpfInput);

    /* ================= TELEFONE COM MÁSCARA E VALIDAÇÃO ================= */
    function aplicarMascaraTelefone(input) {
        input.addEventListener("input", () => {
            let valor = input.value.replace(/\D/g, '');
            if (valor.length > 11) valor = valor.slice(0, 11);

            if (valor.length <= 2) valor = `(${valor}`;
            else if (valor.length <= 6) valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
            else if (valor.length <= 10) valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6)}`;
            else valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;

            input.value = valor;
        });

        input.addEventListener("blur", () => {
            const erro = document.getElementById(input.id + "Erro");
            const valor = input.value.replace(/\D/g, '');
            if (valor.length !== 10 && valor.length !== 11) {
                input.classList.add("input-erro");
                erro.textContent = "Telefone inválido (10 ou 11 dígitos)";
            } else {
                input.classList.remove("input-erro");
                erro.textContent = "";
            }
        });
    }
    aplicarMascaraTelefone(tel1Input);
    aplicarMascaraTelefone(tel2Input);

    /* ================= PREENCIMENTO AUTOMÁTICO DO CEP ================= */
    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, '');
        const cepErro = document.getElementById("cepErro");

        if (cep.length !== 8) {
            cepInput.classList.add("input-erro");
            cepErro.textContent = "CEP inválido";
            return;
        }

        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();

            if (data.erro) {
                cepInput.classList.add("input-erro");
                cepErro.textContent = "CEP não encontrado";
                return;
            }

            ruaInput.value = data.logradouro || '';
            bairroInput.value = data.bairro || '';
            cidadeInput.value = data.localidade || '';
            ufInput.value = data.uf || '';

            cepInput.classList.remove("input-erro");
            cepErro.textContent = "";
        } catch (error) {
            cepInput.classList.add("input-erro");
            cepErro.textContent = "Erro ao buscar CEP";
        }
    });
});
