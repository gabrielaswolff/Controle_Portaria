const express = require('express');
const cors = require('cors');
const db = require('./db_config');
const app = express();
const port = 3003;

///MUDAR PORTAS

app.use(cors());
app.use(express.json());

function verificarProprietarioExistente(bloco, apartamento, idExcluir = null) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM moradores WHERE bloco = ? AND apartamento = ? AND status = "proprietario"';
        let params = [bloco, apartamento];
        
        if (idExcluir) {
            query += ' AND id != ?';
            params.push(idExcluir);
        }
        
        db.query(query, params, (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results.length > 0);
        });
    });
}

// Rotas para Moradores
app.get('/moradores', async (req, res) => {
    try {
        db.query('SELECT * FROM moradores ORDER BY nome', (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao buscar moradores' });
            }
            res.json(results);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar moradores' });
    }
});

app.get('/moradores/:id', async (req, res) => {
    try {
        db.query('SELECT * FROM moradores WHERE id = ?', [req.params.id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao buscar morador' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Morador não encontrado' });
            }
            res.json(results[0]);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar morador' });
    }
});

app.post('/moradores', async (req, res) => {
    try {
        const { nome, bloco, apartamento, telefone, email, status } = req.body;
        
        // Verifica se já existe um proprietário no mesmo apartamento
        if (status === 'proprietario') {
            const existeProprietario = await verificarProprietarioExistente(bloco, apartamento);
            if (existeProprietario) {
                return res.status(400).json({ 
                    error: 'Já existe um proprietário cadastrado neste apartamento' 
                });
            }
        }
        
        db.query(
            'INSERT INTO moradores (nome, bloco, apartamento, telefone, email, status) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, bloco, apartamento, telefone, email, status],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Erro ao criar morador' });
                }
                
                db.query('SELECT * FROM moradores WHERE id = ?', [result.insertId], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Erro ao buscar morador criado' });
                    }
                    res.status(201).json(results[0]);
                });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar morador' });
    }
});

app.put('/moradores/:id', async (req, res) => {
    try {
        const { nome, bloco, apartamento, telefone, email, status } = req.body;
        
        // Verifica se já existe um proprietário no mesmo apartamento
        if (status === 'proprietario') {
            const existeProprietario = await verificarProprietarioExistente(bloco, apartamento, req.params.id);
            if (existeProprietario) {
                return res.status(400).json({ 
                    error: 'Já existe um proprietário cadastrado neste apartamento' 
                });
            }
        }
        
        db.query(
            'UPDATE moradores SET nome = ?, bloco = ?, apartamento = ?, telefone = ?, email = ?, status = ? WHERE id = ?',
            [nome, bloco, apartamento, telefone, email, status, req.params.id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Erro ao atualizar morador' });
                }
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Morador não encontrado' });
                }
                
                db.query('SELECT * FROM moradores WHERE id = ?', [req.params.id], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Erro ao buscar morador atualizado' });
                    }
                    res.json(results[0]);
                });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar morador' });
    }
});

app.delete('/moradores/:id', async (req, res) => {
    try {
        db.query('DELETE FROM moradores WHERE id = ?', [req.params.id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao excluir morador' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Morador não encontrado' });
            }
            
            res.json({ message: 'Morador excluído com sucesso' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir morador' });
    }
});

// Rotas para Veículos
app.get('/veiculos', async (req, res) => {
    try {
        db.query(`
            SELECT v.*, m.nome as morador_nome 
            FROM veiculos v 
            LEFT JOIN moradores m ON v.morador_id = m.id 
            ORDER BY v.placa
        `, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao buscar veículos' });
            }
            res.json(results);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar veículos' });
    }
});

app.get('/veiculos/:id', async (req, res) => {
    try {
        db.query('SELECT * FROM veiculos WHERE id = ?', [req.params.id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao buscar veículo' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Veículo não encontrado' });
            }
            res.json(results[0]);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar veículo' });
    }
});

app.post('/veiculos', async (req, res) => {
    try {
        const { placa, modelo, cor, box, morador_id } = req.body;
        db.query(
            'INSERT INTO veiculos (placa, modelo, cor, box, morador_id) VALUES (?, ?, ?, ?, ?)',
            [placa, modelo, cor, box, morador_id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Erro ao criar veículo' });
                }
                
                db.query('SELECT * FROM veiculos WHERE id = ?', [result.insertId], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Erro ao buscar veículo criado' });
                    }
                    res.status(201).json(results[0]);
                });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar veículo' });
    }
});

app.put('/veiculos/:id', async (req, res) => {
    try {
        const { placa, modelo, cor, box, morador_id } = req.body;
        db.query(
            'UPDATE veiculos SET placa = ?, modelo = ?, cor = ?, box = ?, morador_id = ? WHERE id = ?',
            [placa, modelo, cor, box, morador_id, req.params.id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Erro ao atualizar veículo' });
                }
                
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Veículo não encontrado' });
                }
                
                db.query('SELECT * FROM veiculos WHERE id = ?', [req.params.id], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Erro ao buscar veículo atualizado' });
                    }
                    res.json(results[0]);
                });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar veículo' });
    }
});

app.delete('/veiculos/:id', async (req, res) => {
    try {
        db.query('DELETE FROM veiculos WHERE id = ?', [req.params.id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao excluir veículo' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Veículo não encontrado' });
            }
            
            res.json({ message: 'Veículo excluído com sucesso' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir veículo' });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});