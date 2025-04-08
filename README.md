# Controle de Portaria

Desenvolvido por: Gabriela e Laura
Turma: 3BM

Website de Sistema de Portaria de um condomínio focado em CRUD, responsividade e acessibilidade. Abaixo as informações necessárias para o teste de rotas:

# Crud dos moradores

MÉTODO: GET
CAMINHO: /moradores

MÉTODO: GET
CAMINHO: /moradores/:id

MÉTODO: POST
CAMINHO: /moradores
BODY:
{
  "nome": "João Silva",
  "bloco": "A",
  "apartamento": "101",
  "telefone": "11999999999",
  "email": "joao@email.com",
  "status": "proprietario" 
}

MÉTODO: PUT
CAMINHO: /moradores/:id
BODY:
{
  "nome": "João da Silva",
  "bloco": "A",
  "apartamento": "101",
  "telefone": "11999999999",
  "email": "joao.silva@email.com",
  "status": "proprietario"
}

MÉTODO: DELETE
CAMINHO: /moradores/:id


# Crud dos veículos

MÉTODO: GET
CAMINHO: /moradores/1

MÉTODO: GET
CAMINHO: /moradores/1

MÉTODO: POST
CAMINHO: /veiculos
BODY:

{
  "placa": "ABC1234",
  "modelo": "Fiat Uno",
  "cor": "Prata",
  "box": "12",
  "morador_id": 1
}

MÉTODO: PUT
CAMINHO: /veiculos/:id
BODY:
{
  "placa": "XYZ5678",
  "modelo": "Volkswagen Gol",
  "cor": "Branco",
  "box": "15",
  "morador_id": 1
}

MÉTODO: DELETE
CAMINHO: /veiculos/:id













