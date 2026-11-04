<!-- nav:topo -->
<p align="center">
  <a href="../README.md"><img src="https://img.shields.io/badge/In%C3%ADcio-24292f?style=for-the-badge&logo=github&logoColor=white" alt="Início"></a>
  <img src="https://img.shields.io/badge/voc%C3%AA_est%C3%A1_aqui-API_Gerenciador-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Você está aqui: API Gerenciador">
  <a href="../app-react/README.md"><img src="https://img.shields.io/badge/Front_React-087ea4?style=for-the-badge&logo=react&logoColor=white" alt="Front React"></a>
  <a href="../diario-de-bordo/README.md"><img src="https://img.shields.io/badge/Di%C3%A1rio_de_bordo-8250df?style=for-the-badge&logo=bookstack&logoColor=white" alt="Diário de bordo"></a>
  <a href="../docs/GUIA_DE_ESTUDOS.md"><img src="https://img.shields.io/badge/Guia_de_estudos-d97706?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Guia de estudos"></a>
  <a href="../exercicios/tailwind/dicas.md"><img src="https://img.shields.io/badge/Tailwind-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"></a>
</p>
<!-- /nav:topo -->

# Gerenciador de Tarefas

Gerenciador de tarefas multi-usuário: back-end em **Node.js + Express + TypeScript** com persistência em **SQLite na nuvem** (Turso, via `@libsql/client`), e um protótipo de tela feito com **Tailwind CSS**. O projeto evolui a cada aula: primeiro as rotas básicas, depois o CRUD, a blindagem contra entradas maliciosas, a autenticação com senha criptografada e JWT e, na Aula 09, a migração do arquivo local para o banco em nuvem.

```
gerenciador-tarefas/
├── api/
│   ├── server.ts          # API completa (rotas, banco, autenticação)
│   ├── requests.http      # cenários de teste por aula (REST Client)
│   ├── .env.example       # modelo do .env com TURSO_URL e TURSO_TOKEN
│   ├── package.json
│   └── tsconfig.json
└── prototipo-html/
    └── index.html         # tela estática: login + cadastro de tarefas (Tailwind via CDN)
```

**Nesta página:** [Como rodar](#como-rodar-a-api) · [Banco em nuvem](#banco-em-nuvem-turso) · [Front pela API](#servindo-o-front-end-pela-api) · [Variáveis](#variáveis-de-ambiente) · [Tecnologias](#tecnologias) · [Endpoints](#endpoints) · [Modelo de dados](#modelo-de-dados) · [Respostas](#exemplos-de-resposta) · [Autenticação](#fluxo-de-autenticação) · [Segurança](#segurança-aplicada) · [Testes](#testes-com-rest-client) · [Limitações](#limitações-atuais) · [Roadmap](#roadmap)

**Aulas que construíram esta API** (clique para abrir o diário):

<p>
  <a href="../diario-de-bordo/2026-09-02.md"><img src="https://img.shields.io/badge/02_set-Erros_e_ataques-8250df?style=for-the-badge" alt="02 set: Erros e ataques"></a>
  <a href="../diario-de-bordo/2026-09-09.md"><img src="https://img.shields.io/badge/09_set-Busca_segura-8250df?style=for-the-badge" alt="09 set: Busca segura"></a>
  <a href="../diario-de-bordo/2026-09-16.md"><img src="https://img.shields.io/badge/16_set-Rotas_de_escrita-8250df?style=for-the-badge" alt="16 set: Rotas de escrita"></a>
  <a href="../diario-de-bordo/2026-09-23.md"><img src="https://img.shields.io/badge/23_set-Autentica%C3%A7%C3%A3o-8250df?style=for-the-badge" alt="23 set: Autenticação"></a>
  <a href="../diario-de-bordo/2026-10-28.md"><img src="https://img.shields.io/badge/28_out-Laborat%C3%B3rio-8250df?style=for-the-badge" alt="28 out: Laboratório"></a>
  <a href="../diario-de-bordo/2026-11-04.md"><img src="https://img.shields.io/badge/04_nov-Banco_em_nuvem-8250df?style=for-the-badge" alt="04 nov: Banco em nuvem"></a>
</p>

## Como rodar a API

```bash
cd gerenciador-tarefas/api
pnpm install
pnpm dev        # desenvolvimento, reinicia ao salvar (tsx watch)
pnpm start      # execução simples
```

O servidor sobe em `http://localhost:3000`. Antes de abrir a porta, ele cria as tabelas (se ainda não existirem) e o usuário semente `admin@senai.com` / `123456`. O banner no terminal diz para onde os dados estão indo:

```
============================================================
  Banco de dados
------------------------------------------------------------
  Modo  : Turso / libSQL (nuvem)
  Onde  : libsql://seu-banco.turso.io
  Token : presente (nunca será mostrado)
============================================================
```

Sem `.env`, o modo é `arquivo local (SQLite)` e os dados ficam em `api/tarefas.db`.

### Banco em nuvem (Turso)

1. Crie a conta e o banco em [turso.tech](https://turso.tech) e copie a URL (`libsql://...`) e um token.
2. Copie `api/.env.example` para `api/.env` e preencha os dois valores. Salve em **UTF-8 sem BOM** e confira se a URL não termina com `/`.
3. Rode `pnpm dev` e confira o banner, ou chame `GET /api/health`, que responde `"banco": "Turso / libSQL (nuvem)"`.

O `.env` e o `tarefas.db` estão no `.gitignore` e nunca devem ir para o repositório.

### Servindo o front-end pela API

A API também entrega o front React (`app-react/web`). Como tela e API saem da mesma origem, o CORS deixa de ser necessário nesse modo.

```bash
pnpm build:web   # gera app-react/web/dist
pnpm dev         # a tela abre em http://localhost:3000
pnpm dev:all     # alternativa: API e Vite juntos (tela em http://localhost:5173)
```

A ordem das peças no final do `server.ts` importa: primeiro o 404 em JSON para `/api/*` que não existe, depois o `express.static` com o `dist`, e por último o SPA fallback, que devolve o `index.html` para qualquer outro caminho. Ao subir, a API avisa se o build não existe ou está mais velho que `app-react/web/src`.

### Variáveis de ambiente

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `PORT` | `3000` | Porta do servidor |
| `JWT_SECRET` | valor de desenvolvimento | Chave que assina os tokens. Em produção, sempre defina a sua |
| `TURSO_URL` | (vazio) | Endereço do banco no Turso (`libsql://...`). Sem ela, usa `tarefas.db` |
| `TURSO_TOKEN` | (vazio) | Token de acesso ao banco. Só vai para a nuvem com URL **e** token |

O servidor lê `api/.env` sozinho (`process.loadEnvFile`). Variáveis já definidas no sistema, como as do painel de uma hospedagem, têm prioridade sobre o arquivo. Se o `.env` estiver salvo com BOM, o terminal mostra um aviso, porque a primeira variável seria ignorada sem erro.

> **Atenção:** o `CREATE TABLE IF NOT EXISTS` não atualiza tabelas que já existem. Um `tarefas.db` criado antes da Aula 09 ainda tem a coluna `senha` (hoje é `senha_hash`): apague o arquivo e reinicie o servidor.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| Node.js + Express 5 | Servidor HTTP e rotas |
| TypeScript + tsx | Tipagem e execução direta do `.ts` |
| @libsql/client | Driver do Turso (SQLite na nuvem, via HTTP); sem `.env`, usa o arquivo `tarefas.db` |
| bcryptjs | Hash das senhas |
| jsonwebtoken | Geração de tokens JWT |
| cors | Libera o front-end React (`localhost:5173`) para consumir a API |
| Tailwind CSS | Layout do protótipo HTML |
| REST Client (VS Code) | Testes das rotas via `requests.http` |

## Endpoints

### Diagnóstico

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/` | Entrega a tela do React (build em `app-react/web/dist`) |
| GET | `/api/health` | Health check ativo: roda `SELECT 1` no banco e informa o modo (`banco`). `503` se o banco não responder |
| GET | `/api/version` | Nome e versão da aplicação |

### Autenticação

| Método | Rota | Descrição | Respostas |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Cadastra usuário (`email`, `senha` com 6+ caracteres) | `201`, `400`, `409` (só para e-mail já cadastrado), `500` (banco indisponível) |
| POST | `/api/auth/login` | Autentica e devolve `{ "token": "..." }` (validade de 8h) | `200`, `400`, `401`, `500` (banco indisponível, e não "credenciais inválidas") |

### Tarefas

| Método | Rota | Descrição | Respostas |
| --- | --- | --- | --- |
| GET | `/api/tasks` | Lista tarefas; aceita `?search=` | `200`, `500` |
| POST | `/api/tasks` | Cria tarefa (`titulo`, `prioridade` opcional) | `201`, `400` |
| PUT | `/api/tasks/:id` | Substitui a tarefa inteira | `200`, `400`, `404` |
| PATCH | `/api/tasks/:id` | Atualiza só os campos enviados | `200`, `400`, `404` |
| DELETE | `/api/tasks/:id` | Remove a tarefa | `200`, `400`, `404` |

**Regras dos campos**

- `titulo`: string com pelo menos 3 caracteres (após `trim`).
- `prioridade`: `low`, `medium` (padrão) ou `high`.
- `status`: `pending` (padrão) ou `completed`.

### Exemplo de uso

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{ "email": "aluno@senai.com", "senha": "minhaSenhaSegura123" }
```

## Modelo de dados

As tabelas são criadas na inicialização com `db.batch([SQL_USUARIOS, SQL_TAREFAS], "write")`, no Turso ou no `tarefas.db` local (ignorado pelo Git):

```sql
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,      -- o banco recusa e-mails repetidos
    senha_hash TEXT NOT NULL,        -- hash bcrypt, nunca o texto original
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,     -- dono da tarefa
    titulo TEXT NOT NULL,
    descricao TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    prioridade TEXT NOT NULL DEFAULT 'medium',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);
```

Por que `batch` e não um `execute` só: no libSQL, um `execute()` com dois comandos roda apenas o primeiro e ignora o resto sem erro, e a tabela `tarefas` nunca seria criada.

Se o usuário `admin@senai.com` não existir, ele é criado com a senha `123456` (em hash).

## Exemplos de resposta

**Registro** (`201`): a resposta nunca devolve a senha nem o hash.

```json
{ "id": 2, "email": "aluno@senai.com" }
```

**Login** (`200`):

```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

**Criar tarefa** (`201`):

```json
{
  "id": 1, "usuario_id": 2, "titulo": "Estudar Turso", "descricao": null,
  "status": "pending", "prioridade": "high",
  "criado_em": "2026-11-04 22:56:49", "atualizado_em": "2026-11-04 22:56:49"
}
```

**Health check** (`200`):

```json
{ "status": "ok", "message": "Servidor do Gestor de Tarefas ativo!", "banco": "Turso / libSQL (nuvem)" }
```

**Erros** seguem sempre o formato `{ "error": "mensagem" }` (em alguns `404`, a chave é `message`):

```json
{ "error": "O título da tarefa é obrigatório e deve conter pelo menos 3 caracteres válidos." }
```

## Fluxo de autenticação

1. O cliente chama `POST /api/auth/register` e a senha é transformada em hash bcrypt antes de ir para o banco.
2. O cliente chama `POST /api/auth/login` e o servidor compara a senha com o hash.
3. Se estiver correta, o servidor devolve um JWT assinado com `id` e `email` do usuário, válido por 8 horas.
4. O front guarda o token e o envia em `Authorization: Bearer <token>`. O middleware `authenticate` valida o token e cada consulta de tarefas filtra pelo `usuario_id` de quem está logado.

## Segurança aplicada

- **Consultas parametrizadas** (`?` + `args` no `db.execute`): os valores nunca são colados no SQL, o que impede SQL Injection.
- **Segredos fora do código:** `TURSO_TOKEN` e `JWT_SECRET` vêm do ambiente ou do `.env`, que não vai para o Git. O banner confirma que o token existe sem imprimi-lo.
- **Coerção de tipo** em `req.query`: arrays e valores inesperados viram string vazia.
- **Type guards e allowlists** para título, prioridade e status.
- **Erros genéricos**: a resposta nunca expõe mensagens internas do banco.
- **Senhas com bcrypt** (10 rounds): nunca são gravadas em texto puro.
- **Defesa contra timing attack** no login: a senha é sempre comparada com um hash, mesmo quando o e-mail não existe.
- **JWT assinado** com expiração de 8 horas.

## Testes com REST Client

O arquivo [requests.http](api/requests.http) reúne os cenários de sucesso e de falha de cada aula (validação, ataques, registro e login). Com a extensão **REST Client** instalada, clique em "Send Request" acima de cada bloco.

Dica: separe cada requisição com `###`, senão a extensão não identifica os requests.

## Protótipo HTML

A tela em [prototipo-html/index.html](prototipo-html/index.html) foi feita com Tailwind CSS via CDN: cabeçalho, formulário de acesso ("Acesso ao Sistema") e área de cadastro de tarefas em grade responsiva. É uma página estática que ainda não consome a API. Basta abri-la no navegador.

## Limitações atuais

- **A aplicação ainda roda só na máquina local:** o banco já pode ficar no Turso, mas a API ainda não foi publicada. Isso fica para a Aula 10.
- **O protótipo HTML é estático:** os formulários de login e de tarefas não chamam a API. A tela de verdade está em `app-react/web`.
- **`JWT_SECRET` tem valor padrão de desenvolvimento:** deve ser definida por variável de ambiente fora do ambiente local.
- **Sem testes automatizados:** a verificação é manual, pelo `requests.http`.

## Roadmap

Já feito: middleware de autenticação, tarefas por usuário, front React consumindo a API, front servido pela API (Aula 08) e banco em nuvem com `.env` (Aula 09).

1. **Deploy em produção (Aula 10):** publicar a API com Render e Docker, com `TURSO_URL`, `TURSO_TOKEN` e `JWT_SECRET` configurados no painel da hospedagem.
2. **Refinamentos:** testes automatizados e mensagens de erro padronizadas (hoje alguns `404` usam `message` em vez de `error`).

<!-- nav:rodape -->
---

<p align="center">
  <a href="../README.md"><img src="https://img.shields.io/badge/%E2%86%90_anterior-In%C3%ADcio-6e7781?style=for-the-badge" alt="← anterior"></a>
  <a href="#top"><img src="https://img.shields.io/badge/%E2%AC%86_voltar_ao_topo-6e7781?style=for-the-badge" alt="⬆ voltar ao topo"></a>
  <a href="../app-react/README.md"><img src="https://img.shields.io/badge/pr%C3%B3ximo_%E2%86%92-Front_React-087ea4?style=for-the-badge&logo=react&logoColor=white" alt="próximo →"></a>
</p>
<!-- /nav:rodape -->
