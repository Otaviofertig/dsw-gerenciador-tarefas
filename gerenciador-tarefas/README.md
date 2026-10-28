# Gerenciador de Tarefas

Gerenciador de tarefas multi-usuário: back-end em **Node.js + Express + TypeScript** com persistência em **SQLite** (`better-sqlite3`), e um protótipo de tela feito com **Tailwind CSS**. O projeto evolui a cada aula: primeiro as rotas básicas, depois o CRUD, a blindagem contra entradas maliciosas e, por fim, a autenticação com senha criptografada e JWT.

```
gerenciador-tarefas/
├── api/
│   ├── server.ts          # API completa (rotas, banco, autenticação)
│   ├── requests.http      # cenários de teste por aula (REST Client)
│   ├── package.json
│   └── tsconfig.json
└── prototipo-html/
    └── index.html         # tela estática: login + cadastro de tarefas (Tailwind via CDN)
```

## Como rodar a API

```bash
cd gerenciador-tarefas/api
pnpm install
pnpm dev        # desenvolvimento, reinicia ao salvar (tsx watch)
pnpm start      # execução simples
```

O servidor sobe em `http://localhost:3000`. O banco `tarefas.db` é criado automaticamente dentro de `api/` na primeira execução, junto com um usuário semente.

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

> **Atenção:** se o banco foi criado antes da trava `UNIQUE` em `usuarios.email`, apague o arquivo `tarefas.db` e reinicie o servidor. O `CREATE TABLE IF NOT EXISTS` não atualiza tabelas já existentes.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| Node.js + Express 5 | Servidor HTTP e rotas |
| TypeScript + tsx | Tipagem e execução direta do `.ts` |
| better-sqlite3 | Banco de dados SQLite (arquivo `tarefas.db`) |
| bcryptjs | Hash das senhas |
| jsonwebtoken | Geração de tokens JWT |
| cors | Libera o front-end React (`localhost:5173`) para consumir a API |
| Tailwind CSS | Layout do protótipo HTML |
| REST Client (VS Code) | Testes das rotas via `requests.http` |

## Endpoints

### Diagnóstico

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/` | Fallback, identifica a turma |
| GET | `/api/health` | Health check do servidor |
| GET | `/api/version` | Nome e versão da aplicação |

### Autenticação

| Método | Rota | Descrição | Respostas |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Cadastra usuário (`email`, `senha` com 6+ caracteres) | `201`, `400`, `409` (e-mail já cadastrado) |
| POST | `/api/auth/login` | Autentica e devolve `{ "token": "..." }` (validade de 2h) | `200`, `400`, `401` |

### Tarefas

| Método | Rota | Descrição | Respostas |
| --- | --- | --- | --- |
| GET | `/api/tasks` | Lista tarefas; aceita `?search=` | `200`, `500` |
| POST | `/api/tasks` | Cria tarefa (`titulo`, `prioridade` opcional) | `201`, `400` |
| PUT | `/api/tasks/:id` | Substitui a tarefa inteira | `200`, `400`, `404` |
| PATCH | `/api/tasks/:id` | Atualiza só os campos enviados (transação) | `200`, `400`, `404` |
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

O banco `tarefas.db` (ignorado pelo Git) é criado na inicialização com duas tabelas:

```sql
CREATE TABLE tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    prioridade TEXT DEFAULT 'medium'
);

CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,   -- o banco recusa e-mails repetidos
    senha TEXT NOT NULL           -- hash bcrypt, nunca o texto original
);
```

Na primeira execução, se não houver usuários, é criado um usuário semente (`otavio@gmail.com`) com a senha já em hash.

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
{ "id": 1, "titulo": "Estudar Node.js e SQLite", "status": "pending", "prioridade": "high" }
```

**Erros** seguem sempre o formato `{ "error": "mensagem" }` (em alguns `404`, a chave é `message`):

```json
{ "error": "O título da tarefa é obrigatório e deve conter pelo menos 3 caracteres válidos." }
```

## Fluxo de autenticação

1. O cliente chama `POST /api/auth/register` e a senha é transformada em hash bcrypt antes de ir para o banco.
2. O cliente chama `POST /api/auth/login` e o servidor compara a senha com o hash.
3. Se estiver correta, o servidor devolve um JWT assinado com `id` e `email` do usuário, válido por 2 horas.
4. O cliente guardará o token e o enviará em `Authorization: Bearer <token>` nas rotas protegidas. Essa última etapa ainda não está implementada (veja "Limitações atuais").

## Segurança aplicada

- **Prepared statements** compilados uma única vez: impedem SQL Injection.
- **Coerção de tipo** em `req.query`: arrays e valores inesperados viram string vazia.
- **Type guards e allowlists** para título, prioridade e status.
- **Erros genéricos**: a resposta nunca expõe mensagens internas do banco.
- **Senhas com bcrypt** (10 rounds): nunca são gravadas em texto puro.
- **Defesa contra timing attack** no login: a senha é sempre comparada com um hash, mesmo quando o e-mail não existe.
- **JWT assinado** com expiração de 2 horas.

## Testes com REST Client

O arquivo [requests.http](api/requests.http) reúne os cenários de sucesso e de falha de cada aula (validação, ataques, registro e login). Com a extensão **REST Client** instalada, clique em "Send Request" acima de cada bloco.

Dica: separe cada requisição com `###`, senão a extensão não identifica os requests.

## Protótipo HTML

A tela em [prototipo-html/index.html](prototipo-html/index.html) foi feita com Tailwind CSS via CDN: cabeçalho, formulário de acesso ("Acesso ao Sistema") e área de cadastro de tarefas em grade responsiva. É uma página estática que ainda não consome a API. Basta abri-la no navegador.

## Limitações atuais

- **O banco é um arquivo local:** o `tarefas.db` fica no disco, que some a cada deploy em hospedagens comuns. A próxima etapa é migrar para um banco em nuvem (Turso / libSQL).
- **O protótipo HTML é estático:** os formulários de login e de tarefas não chamam a API. A tela de verdade está em `app-react/web`.
- **`JWT_SECRET` tem valor padrão de desenvolvimento:** deve ser definida por variável de ambiente fora do ambiente local.
- **Sem testes automatizados:** a verificação é manual, pelo `requests.http`.

## Roadmap

1. **Middleware de autenticação:** ler `Authorization: Bearer <token>`, validar com `jwt.verify` e responder `401` quando o token faltar ou for inválido.
2. **Tarefas por usuário:** adicionar `usuario_id` (com chave estrangeira) em `tarefas` e filtrar todas as consultas pelo usuário logado.
3. **Proteção de todas as rotas de tarefas** com o middleware.
4. **Integração do front-end:** telas de registro e login, guarda do token e CRUD de tarefas consumindo a API (a base já está em [app-react/web](../app-react/web/)).
5. **Refinamentos:** variáveis de ambiente em arquivo `.env`, testes automatizados e mensagens de erro padronizadas.
