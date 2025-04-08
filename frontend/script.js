const API = "http://localhost:3002";

function mostrarMsg(texto, tipo) {
    const notificacao = document.getElementById("notificacao");
    notificacao.textContent = texto;
    notificacao.className = `mensagem ${tipo}`;
    notificacao.style.display = "block";
    setTimeout(() => (notificacao.style.display = "none"), 4000);
}

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".aba");
    const panels = document.querySelectorAll(".painel");

    const formMorador = document.getElementById("form-morador");
    const formVeiculo = document.getElementById("form-veiculo");

    const listaMoradores = document.getElementById("moradores-lista");
    const listaVeiculos = document.getElementById("veiculos-lista");
    const selectMorador = document.getElementById("morador-select");

    function alternarAbas(tab) {
        tabs.forEach(btn => btn.classList.remove("ativo"));
        panels.forEach(sec => sec.classList.remove("ativo"));
        tab.classList.add("ativo");
        document.getElementById(tab.dataset.alvo).classList.add("ativo");
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => alternarAbas(tab));
    });

    function atualizarSelectMoradores(moradores) {
        selectMorador.innerHTML = `<option value="">Selecione o morador</option>` +
            moradores.map(m => `<option value="${m.id}">${m.nome}</option>`).join("");
    }

    function renderizarListaMoradores() {
        fetch(`${API}/moradores`)
            .then(res => res.json())
            .then(data => {
                listaMoradores.innerHTML = data.map(m => `
          <div class="item">
            <div>
              <strong>${m.nome}</strong><br/>
              ${m.bloco} - ${m.apartamento}<br/>
              ${m.telefone} / ${m.email}<br/>
              Status: ${m.status}
            </div>
            <div>
              <button class="botoes" onclick="editarMorador(${m.id})">Editar</button>
              <button class="botoes" onclick="deletarMorador(${m.id})">Excluir</button>
            </div>
          </div>
        `).join("");
                atualizarSelectMoradores(data);
            });
    }

    function renderizarListaVeiculos() {
        fetch(`${API}/veiculos`)
            .then(res => res.json())
            .then(data => {
                listaVeiculos.innerHTML = data.map(v => `
          <div class="item">
            <div>
              <strong>${v.modelo} - ${v.placa}</strong><br/>
              Cor: ${v.cor}, Vaga: ${v.box}<br/>
              Morador: ${v.morador_nome || 'Não informado'}
            </div>
            <div>
              <button class="botoes" onclick="editarVeiculo(${v.id})">Editar</button>
              <button class="botoes" onclick="deletarVeiculo(${v.id})">Excluir</button>
            </div>
          </div>
        `).join("");
            });
    }


    formMorador.addEventListener("submit", e => {
        e.preventDefault();
        const dados = Object.fromEntries(new FormData(formMorador));
        const metodo = dados.id ? "PUT" : "POST";
        const url = dados.id ? `${API}/moradores/${dados.id}` : `${API}/moradores`;
        if (dados.id) delete dados.id;

        fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        })
            .then(res => {
                if (!res.ok) throw new Error("Falha ao salvar morador.");
                return res.json();
            })
            .then(() => {
                formMorador.reset();
                formMorador.querySelector('input[name="id"]').value = "";
                renderizarListaMoradores();
                mostrarMsg("Morador salvo com sucesso!", "sucesso");
            })
            .catch(() => mostrarMsg("Erro ao salvar morador", "erro"));
    });


    formVeiculo.addEventListener("submit", e => {
        e.preventDefault();
        const dados = Object.fromEntries(new FormData(formVeiculo));
        const metodo = dados.id ? "PUT" : "POST";
        const url = dados.id ? `${API}/veiculos/${dados.id}` : `${API}/veiculos`;
        if (dados.id) delete dados.id;

        fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        })
            .then(res => {
                if (!res.ok) throw new Error("Falha ao salvar veículo.");
                return res.json();
            })
            .then(() => {
                formVeiculo.reset();
                formVeiculo.querySelector('input[name="id"]').value = "";
                renderizarListaVeiculos();
                mostrarMsg("Veículo salvo com sucesso!", "sucesso");
            })
            .catch(() => mostrarMsg("Erro ao salvar veículo", "erro"));
    });


    renderizarListaMoradores();
    renderizarListaVeiculos();

});


window.editarMorador = function (id) {
    fetch(`${API}/moradores/${id}`)
        .then(res => res.json())
        .then(dado => {
            const form = document.getElementById("form-morador");
            Object.keys(dado).forEach(chave => {
                if (form[chave]) form[chave].value = dado[chave];
            });
        });
}

window.editarVeiculo = function (id) {
    fetch(`${API}/veiculos/${id}`)
        .then(res => res.json())
        .then(dado => {
            const form = document.getElementById("form-veiculo");
            Object.keys(dado).forEach(chave => {
                if (form[chave]) form[chave].value = dado[chave];
            });
        });
}

window.deletarMorador = function (id) {
    if (!confirm("Confirmar exclusão do morador?")) return;
    fetch(`${API}/moradores/${id}`, { method: "DELETE" })
        .then(() => {
            mostrarMsg("Morador removido!", "sucesso");
            document.dispatchEvent(new Event("DOMContentLoaded"));
        });
}

window.deletarVeiculo = function (id) {
    if (!confirm("Confirmar exclusão do veículo?")) return;
    fetch(`${API}/veiculos/${id}`, { method: "DELETE" })
        .then(() => {
            mostrarMsg("Veículo removido!", "sucesso");
            document.dispatchEvent(new Event("DOMContentLoaded"));
        });
}

//---------------------------------------------------------------------

window.addEventListener("resize", () => {
    const largura = window.innerWidth;
    console.log(`Tamanho da tela: ${largura}px`);

    if (largura < 768) {
        console.log("você está usando uma tela mobile (pequena)");
    }
});
