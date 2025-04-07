document.addEventListener("DOMContentLoaded", () => {
    
    const API_URL = "http://localhost:3002";
    const moradorForm = document.getElementById("morador-form");
    const veiculoForm = document.getElementById("veiculo-form");
    const listaMoradores = document.getElementById("lista-moradores");
    const listaVeiculos = document.getElementById("lista-veiculos");
    const seletorMorador = document.getElementById("morador_id");

    // Função para mostrar mensagens
    function mostrarMensagem(mensagem, tipo) {
        const elemento = document.getElementById('mensagem');
        elemento.textContent = mensagem;
        elemento.className = `mensagem ${tipo}`;
        elemento.style.display = 'block';
        setTimeout(() => elemento.style.display = 'none', 5000);
    }

    // Carregar moradores
    function carregarMoradores() {
        fetch(`${API_URL}/moradores`)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar moradores');
                return response.json();
            })
            .then(moradores => {
                listaMoradores.innerHTML = moradores.map(morador => `
                    <div class="item-lista">
                        <div class="info">
                            <strong>${morador.nome}</strong>
                            <p>Bloco: ${morador.bloco} - Apto: ${morador.apartamento}</p>
                            <p>Tel: ${morador.telefone}</p>
                            <p>Email: ${morador.email}</p>
                            <p>Status: ${morador.status}</p>
                        </div>
                        <div class="acoes">
                            <button onclick="editarMorador(${morador.id})" class="editar">Editar</button>
                            <button onclick="excluirMorador(${morador.id})" class="excluir">Excluir</button>
                        </div>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('Erro:', error);
                mostrarMensagem('Erro ao carregar moradores', 'erro');
            });
    }

    // Carregar veículos
    function carregarVeiculos() {
        fetch(`${API_URL}/veiculos`)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar veículos');
                return response.json();
            })
            .then(veiculos => {
                listaVeiculos.innerHTML = veiculos.map(veiculo => `
                    <div class="item-lista">
                        <div class="info">
                            <strong>${veiculo.modelo} - ${veiculo.placa}</strong>
                            <p>Cor: ${veiculo.cor}</p>
                            <p>Vaga: ${veiculo.box}</p>
                            <p>Morador: ${veiculo.morador_nome || 'Não informado'}</p>
                        </div>
                        <div class="acoes">
                            <button onclick="editarVeiculo(${veiculo.id})" class="editar">Editar</button>
                            <button onclick="excluirVeiculo(${veiculo.id})" class="excluir">Excluir</button>
                        </div>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('Erro:', error);
                mostrarMensagem('Erro ao carregar veículos', 'erro');
            });
    }

    // Atualizar lista de moradores no select
    function atualizarSeletorMoradores() {
        fetch(`${API_URL}/moradores`)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar moradores');
                return response.json();
            })
            .then(moradores => {
                seletorMorador.innerHTML = `
                    <option value="">Selecione um morador</option>
                    ${moradores.map(m => `
                        <option value="${m.id}">${m.nome} - Bloco ${m.bloco} Apto ${m.apartamento}</option>
                    `).join('')}
                `;
            })
            .catch(error => {
                console.error('Erro:', error);
                mostrarMensagem('Erro ao carregar lista de moradores', 'erro');
            });
    }

    // Funções de edição
    window.editarMorador = function(id) {
        fetch(`${API_URL}/moradores/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar morador');
                return response.json();
            })
            .then(morador => {
                // Adiciona um campo oculto para armazenar o ID do morador
                let idInput = moradorForm.querySelector('input[name="id"]');
                if (!idInput) {
                    idInput = document.createElement('input');
                    idInput.type = 'hidden';
                    idInput.name = 'id';
                    moradorForm.appendChild(idInput);
                }
                idInput.value = morador.id;
                
                // Preenche os outros campos
                Object.keys(morador).forEach(key => {
                    if (key !== 'id') {
                        const input = moradorForm.elements[key];
                        if (input) input.value = morador[key];
                    }
                });
            })
            .catch(error => {
                console.error('Erro:', error);
                mostrarMensagem('Erro ao carregar dados do morador', 'erro');
            });
    };

    window.editarVeiculo = function(id) {
        fetch(`${API_URL}/veiculos/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar veículo');
                return response.json();
            })
            .then(veiculo => {
                // Adiciona um campo oculto para armazenar o ID do veículo
                let idInput = veiculoForm.querySelector('input[name="id"]');
                if (!idInput) {
                    idInput = document.createElement('input');
                    idInput.type = 'hidden';
                    idInput.name = 'id';
                    veiculoForm.appendChild(idInput);
                }
                idInput.value = veiculo.id;
                
                // Preenche os outros campos
                Object.keys(veiculo).forEach(key => {
                    if (key !== 'id') {
                        const input = veiculoForm.elements[key];
                        if (input) input.value = veiculo[key];
                    }
                });
            })
            .catch(error => {
                console.error('Erro:', error);
                mostrarMensagem('Erro ao carregar dados do veículo', 'erro');
            });
    };

    // Funções de exclusão
    window.excluirMorador = function(id) {
        if (confirm('Deseja realmente excluir este morador?')) {
            fetch(`${API_URL}/moradores/${id}`, { method: 'DELETE' })
                .then(response => {
                    if (!response.ok) throw new Error('Erro ao excluir morador');
                    mostrarMensagem('Morador excluído com sucesso', 'sucesso');
                    carregarMoradores();
                })
                .catch(error => {
                    console.error('Erro:', error);
                    mostrarMensagem('Erro ao excluir morador', 'erro');
                });
        }
    };

    window.excluirVeiculo = function(id) {
        if (confirm('Deseja realmente excluir este veículo?')) {
            fetch(`${API_URL}/veiculos/${id}`, { method: 'DELETE' })
                .then(response => {
                    if (!response.ok) throw new Error('Erro ao excluir veículo');
                    mostrarMensagem('Veículo excluído com sucesso', 'sucesso');
                    carregarVeiculos();
                })
                .catch(error => {
                    console.error('Erro:', error);
                    mostrarMensagem('Erro ao excluir veículo', 'erro');
                });
        }
    };

    // Eventos de formulário
    moradorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(moradorForm);
        const morador = Object.fromEntries(formData.entries());
        
        // Verifica se existe um ID para determinar se é edição ou cadastro
        const id = morador.id;
        const url = id ? `${API_URL}/moradores/${id}` : `${API_URL}/moradores`;
        const method = id ? 'PUT' : 'POST';
        
        // Remove o ID do objeto se for um novo cadastro
        if (!id) {
            delete morador.id;
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(morador)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao salvar morador');
            }

            mostrarMensagem(
                id ? 'Morador atualizado com sucesso' : 'Morador cadastrado com sucesso',
                'sucesso'
            );
            moradorForm.reset();
            carregarMoradores();
        } catch (error) {
            console.error('Erro:', error);
            mostrarMensagem(error.message, 'erro');
        }
    });

    veiculoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(veiculoForm);
        const veiculo = Object.fromEntries(formData.entries());
        
        // Verifica se existe um ID para determinar se é edição ou cadastro
        const id = veiculo.id;
        const url = id ? `${API_URL}/veiculos/${id}` : `${API_URL}/veiculos`;
        const method = id ? 'PUT' : 'POST';
        
        // Remove o ID do objeto se for um novo cadastro
        if (!id) {
            delete veiculo.id;
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(veiculo)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao salvar veículo');
            }

            mostrarMensagem(
                id ? 'Veículo atualizado com sucesso' : 'Veículo cadastrado com sucesso',
                'sucesso'
            );
            veiculoForm.reset();
            carregarVeiculos();
        } catch (error) {
            console.error('Erro:', error);
            mostrarMensagem(error.message, 'erro');
        }
    });

    // Gerenciamento das tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(`${button.dataset.tab}-section`).classList.add('active');
        });
    });
    carregarMoradores();         
    carregarVeiculos();          
    atualizarSeletorMoradores()
    
});