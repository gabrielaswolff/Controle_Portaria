# 🏢 Controle de Portaria

## 📌 Sobre o Projeto

O **Controle de Portaria** é um sistema Fullstack desenvolvido para gerenciar moradores e veículos de um condomínio. O projeto tem foco em **CRUD**, organização de dados, boas práticas de API REST, além de responsividade e acessibilidade no frontend.

A aplicação permite:

* Cadastro e gerenciamento de moradores
* Controle de veículos vinculados a cada morador
* Regras de negócio para garantir apenas **um proprietário por apartamento**
* Exclusão em cascata de veículos quando um morador é removido

---

## ⚙️ Funcionalidades

* CRUD completo de moradores
* CRUD completo de veículos
* Associação de veículos a moradores
* Validação de proprietário único por apartamento
* Listagem ordenada de moradores e veículos
* Relacionamento entre tabelas com integridade referencial

---

## 🛠️ Tecnologias Utilizadas

### Backend

* Node.js
* Express.js
* MySQL
* Cors

### Frontend

* HTML
* CSS
* JavaScript

---

## 🗄️ Banco de Dados

### 📁 Criação do Banco

```sql
CREATE DATABASE portaria;
USE portaria;
```

### 📌 Tabela: moradores

```sql
CREATE TABLE moradores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    bloco VARCHAR(10) NOT NULL,
    apartamento VARCHAR(10) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    status ENUM('residente', 'proprietario', 'visitante') NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 🚗 Tabela: veiculos

```sql
CREATE TABLE veiculos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    placa VARCHAR(10) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    cor VARCHAR(30) NOT NULL,
    box VARCHAR(10) NOT NULL,
    morador_id INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (morador_id) REFERENCES moradores(id) ON DELETE CASCADE
);
```

### ⚡ Índices

```sql
CREATE INDEX idx_morador_status ON moradores(status);
CREATE INDEX idx_veiculo_placa ON veiculos(placa);
CREATE INDEX idx_veiculo_morador ON veiculos(morador_id);
```

---

## 🚀 Servidor

O servidor é iniciado na porta **3003**:

```bash
node index.js
```

---

## 📡 Rotas da API

### 👤 Moradores

#### 📄 Listar todos os moradores

* **Método:** GET
* **Rota:** `/moradores`

#### 🔍 Buscar morador por ID

* **Método:** GET
* **Rota:** `/moradores/:id`

#### ➕ Cadastrar morador

* **Método:** POST
* **Rota:** `/moradores`

```json
{
  "nome": "João Silva",
  "bloco": "A",
  "apartamento": "101",
  "telefone": "11999999999",
  "email": "joao@email.com",
  "status": "proprietario"
}
```

#### ✏️ Atualizar morador

* **Método:** PUT
* **Rota:** `/moradores/:id`

```json
{
  "nome": "João da Silva",
  "bloco": "A",
  "apartamento": "101",
  "telefone": "11999999999",
  "email": "joao.silva@email.com",
  "status": "proprietario"
}
```

#### ❌ Deletar morador

* **Método:** DELETE
* **Rota:** `/moradores/:id`

> ⚠️ Ao excluir um morador, todos os veículos vinculados a ele também são removidos.

---

### 🚗 Veículos

#### 📄 Listar veículos

* **Método:** GET
* **Rota:** `/veiculos`

#### 🔍 Buscar veículo por ID

* **Método:** GET
* **Rota:** `/veiculos/:id`

#### ➕ Cadastrar veículo

* **Método:** POST
* **Rota:** `/veiculos`

```json
{
  "placa": "ABC1234",
  "modelo": "Fiat Uno",
  "cor": "Prata",
  "box": "12",
  "morador_id": 1
}
```

#### ✏️ Atualizar veículo

* **Método:** PUT
* **Rota:** `/veiculos/:id`

```json
{
  "placa": "XYZ5678",
  "modelo": "Volkswagen Gol",
  "cor": "Branco",
  "box": "15",
  "morador_id": 1
}
```

#### ❌ Deletar veículo

* **Método:** DELETE
* **Rota:** `/veiculos/:id`

---

## 📌 Regras de Negócio

* Cada apartamento pode ter **apenas um proprietário**
* Um morador pode ter **vários veículos**
* Um veículo pertence a apenas **um morador**
* Exclusões respeitam integridade referencial

---

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido com fins **educacionais**, visando praticar:

* APIs REST
* Relacionamentos em banco de dados
* Validações no backend
* Organização de código

---

## ✨ Autoria

© 2026 — **Projeto Controle de Portaria**
