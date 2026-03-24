# Backend - Tira-Time

Servidor API para gerenciamento de jogadores e partidas com balanceamento automático de times.

## 📋 Visão Geral

Este backend fornece endpoints REST para:
- **CRUD de Jogadores**: criar, listar, atualizar e deletar jogadores
- **Gerenciamento de Partidas** (em desenvolvimento): criar e visualizar partidas
- **Sorteio de Times** (em desenvolvimento): algoritmo para equilibrar times

## 🛠 Tecnologias

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js v5
- **ORM**: Prisma v6
- **Banco de Dados**: SQLite (dev.db)
- **Validação**: Manual nos endpoints
- **Dev Tool**: Nodemon (hot reload)

## 📁 Estrutura do Projeto

```
api/
├── src/
│   └── app.js              # Servidor principal com todas as rotas
├── prisma/
│   ├── schema.prisma       # Definição do banco de dados
│   └── migrations/         # Histórico de migrações SQL
├── .env                    # Variáveis de ambiente (não versionado)
├── dev.db                  # Banco SQLite (não versionado)
├── package.json
└── prisma.config.js        # Config do Prisma
```

## 🚀 Como Rodar

### Instalação

```bash
cd api
npm install
```

### Configuração do Banco

```bash
# Criar/atualizar banco com migrações
npx prisma migrate deploy

# (Opcional) Acessar DB visualmente
npx prisma studio
```

### Iniciar Servidor (Dev)

```bash
npm run dev
```

Server roda em `http://localhost:3000` (ou conforme `PORT` no `.env`)

## 📡 Endpoints Documentados

### Players (Jogadores)

#### ➕ Criar Jogador
```http
POST /players
Content-Type: application/json

{
  "name": "João Araldi",
  "ability": 5, 
  "position": "FieldPlayer"
}
```

**Respostas:**
- `201 Created`: Jogador criado com sucesso
  ```json
  {
    "id": "uuid-aqui",
    "name": "João Araldi",
    "ability": 4,
    "position": "FieldPlayer"
  }
  ```
- `400 Bad Request`: Validação falhou
- `500 Internal Server Error`: Erro do servidor

**Validações:**
- `name`: obrigatório, mínimo 2 caracteres
- `ability`: número de 1 a 5
- `position`: `"GoalKeeper"` ou `"FieldPlayer"`

---

#### 📋 Listar Todos os Jogadores
```http
GET /players
```

**Resposta (200 OK):**
```json
[
  {
    "id": "e9d4c171-029a-4175-bde3-14a8bb5f60e9",
    "name": "Cristiano Ronaldo",
    "ability": 5,
    "position": "FieldPlayer"
  },
  {
    "id": "df5f640d-c99e-4ab3-9bf7-a92a83099062",
    "name": "Neymar Jr",
    "ability": 5,
    "position": "FieldPlayer"
  }
]
```

**Nota:** Retorna ordenado por nome (ASC)

---

#### 🔍 Buscar Jogador por ID
```http
GET /players/:id
```

**Resposta (200 OK):**
```json
{
  "id": "e9d4c171-029a-4175-bde3-14a8bb5f60e9",
  "name": "Cristiano Ronaldo",
  "ability": 5,
  "position": "FieldPlayer"
}
```

**Respostas:**
- `200 OK`: Jogador encontrado
- `404 Not Found`: Jogador não existe
- `500 Internal Server Error`: Erro do servidor

---

#### ✏️ Atualizar Jogador
```http
PUT /players/:id
Content-Type: application/json

{
  "name": "Cristiano Ronaldo",
  "ability": 4,
  "position": "GoalKeeper"
}
```

**Resposta (200 OK):**
```json
{
  "id": "e9d4c171-029a-4175-bde3-14a8bb5f60e9",
  "name": "Cristiano Ronaldo",
  "ability": 4,
  "position": "GoalKeeper"
}
```

**Validações:** Mesmas do POST
- `name`: mínimo 2 caracteres
- `ability`: 1-5
- `position`: GoalKeeper ou FieldPlayer

---

#### 🗑️ Deletar Jogador
```http
DELETE /players/:id
```

**Resposta (200 OK):**
```json
{
  "message": "Jogador deletado com sucesso"
}
```

**Respostas:**
- `200 OK`: Deletado com sucesso
- `500 Internal Server Error`: Erro do servidor

---

## 🔐 Validações Implementadas

| Campo | Validação | Status |
|-------|-----------|--------|
| `name` | 2+ caracteres, obrigatório | ✅ Ativa |
| `ability` | 1-5, número inteiro | ✅ Ativa |
| `position` | GoalKeeper ou FieldPlayer | ✅ Ativa |
| ID (UUID) | String UUID válido | ⚠️ Sem validação |


### Tratamento de Erros

```javascript
try {
  // lógica aqui
} catch (error) {
  console.error('Contexto do erro:', error);
  res.status(500).json({ error: 'Mensagem amigável' });
}
```

### Respostas Padronizadas

**Sucesso:**
```json
{ "id": "...", "name": "...", ... }
```

**Erro:**
```json
{ "error": "Mensagem descritiva" }
```

## 🧪 Como Testar

### Com cURL

```bash
# Criar jogador
curl -X POST http://localhost:3000/players \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","ability":3,"position":"FieldPlayer"}'

# Listar
curl http://localhost:3000/players

# Deletar
curl -X DELETE http://localhost:3000/players/UUID-AQUI
```

### Com Insomnia/Postman

1. Importe as rotas em uma collection
2. Configure environment `http://localhost:3000`
3. Execute os endpoints

## 🔑 Variáves de Ambiente

Crie arquivo `.env` na raiz de `api/`:

```env
PORT=3000
DATABASE_URL="file:./dev.db"
NODE_ENV=development
```

**Status**: 🟡 Em Desenvolvimento  
**Última atualização**: 24 de Março, 2026  
**Mantido por**: Time de Dev
