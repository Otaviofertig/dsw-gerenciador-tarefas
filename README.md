# dsw-gerenciador-tarefas

**Estudante:** Otávio Fertig
**Disciplina:** DSW — Desenvolvimento de Sistemas Web (turma ADS-2025)

## Sobre o projeto

Gerenciador de tarefas completo e multi-usuário, com back-end em **Node.js + Express + TypeScript** e persistência em **SQLite** (`better-sqlite3`). O projeto evolui a cada aula: primeiro as rotas básicas, depois o CRUD, a blindagem contra entradas maliciosas e, por fim, a autenticação com senha criptografada e JWT.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| Node.js + Express 5 | Servidor HTTP e rotas |
| TypeScript + tsx | Tipagem e execução direta do `.ts` |
| better-sqlite3 | Banco de dados SQLite (arquivo `tarefas.db`) |
| bcryptjs | Hash das senhas |
| jsonwebtoken | Geração de tokens JWT |
| Tailwind CSS | Layout do front-end (aulas 3 e 4) |
| REST Client (VS Code) | Testes das rotas via `requests.http` |

## Como rodar

```bash
npm install
npm run dev     # desenvolvimento, reinicia ao salvar (tsx watch)
npm start       # execução simples
```

O servidor sobe em `http://localhost:3000`. O banco `tarefas.db` é criado automaticamente na primeira execução, junto com um usuário semente.

### Variáveis de ambiente

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `PORT` | `3000` | Porta do servidor |
| `JWT_SECRET` | valor de desenvolvimento | Chave que assina os tokens. Em produção, sempre defina a sua |

> **Atenção:** se o banco foi criado antes da trava `UNIQUE` em `usuarios.email`, apague o arquivo `tarefas.db` e reinicie o servidor. O `CREATE TABLE IF NOT EXISTS` não atualiza tabelas já existentes.

## Estrutura do projeto

```
├── server.ts                  # API completa (rotas, banco, autenticação)
├── requests.http              # cenários de teste (REST Client)
├── GUIA_DE_ESTUDOS.md         # resumo consolidado de toda a disciplina
├── Diário de conhecimento/    # anotações de cada aula
├── Desafios_aula/             # desafio prático das aulas 3 e 4 (Tailwind)
├── Gerenciador_Tarefas/       # protótipo de front-end
├── package.json
└── tsconfig.json
```

## Endpoints da API

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

## Front-end

As telas estão em [index.html](index.html) e em [Gerenciador_Tarefas/gt.html/gt.html](Gerenciador_Tarefas/gt.html/gt.html), feitas com Tailwind CSS via CDN: cabeçalho, formulário de acesso ("Acesso ao Sistema") e área de tarefas em grade responsiva. Por enquanto são páginas estáticas e ainda não consomem a API. Basta abri-las no navegador. A [tailwindCSS.html](tailwindCSS.html) e o [dicas.txt](dicas.txt) guardam os experimentos e a tabela de equivalência CSS puro → Tailwind usada nas aulas 3 e 4.

## Segurança aplicada

- **Prepared statements** compilados uma única vez: impedem SQL Injection.
- **Coerção de tipo** em `req.query`: arrays e valores inesperados viram string vazia.
- **Type guards e allowlists** para título, prioridade e status.
- **Erros genéricos**: a resposta nunca expõe mensagens internas do banco.
- **Senhas com bcrypt** (10 rounds): nunca são gravadas em texto puro.
- **Defesa contra timing attack** no login: a senha é sempre comparada com um hash, mesmo quando o e-mail não existe.
- **JWT assinado** com expiração de 2 horas.

## Andamento por aula

| Aula | Tema | Status |
| --- | --- | --- |
| 3 e 4 | Layout com Tailwind CSS (desafio prático em `Desafios_aula/`) | Concluído |
| 5 | Configuração inicial do back-end (Express + TS, rotas de diagnóstico, CRUD em RAM) | Concluído |
| 6 a 9 | Banco SQLite, teste de ataques e tratamento de erros | Concluído |
| 10 | Validação profunda e escrita segura (POST, PUT, PATCH, DELETE) | Concluído |
| 11 | Sanitização da busca e prepared statements | Concluído |
| 12 | Type guards e allowlists | Concluído |
| 13 | Autenticação: registro, login, bcrypt e JWT | Concluído |
| Próxima | Middleware de autorização (`Authorization: Bearer <token>`) | Pendente |


## Testes com REST Client

O arquivo [requests.http](requests.http) reúne os cenários de sucesso e de falha de cada aula (validação, ataques, registro e login). Com a extensão **REST Client** instalada, clique em "Send Request" acima de cada bloco.

Dica: separe cada requisição com `###`, senão a extensão não identifica os requests.

## Material de estudo

- [GUIA_DE_ESTUDOS.md](GUIA_DE_ESTUDOS.md): resumo de toda a disciplina, com problemas, soluções e glossário.
- [Diário de conhecimento](Diário%20de%20conhecimento/): anotações de cada aula.

## Limitações atuais

O projeto ainda está em construção, e estes pontos são conhecidos:

- **As rotas de tarefas estão abertas:** o token JWT já é gerado, mas nenhuma rota o exige ainda.
- **As tarefas não têm dono:** a tabela `tarefas` não tem `usuario_id`, então todos os usuários veem as mesmas tarefas. O sistema ainda não é, de fato, multi-usuário.
- **O front-end é estático:** os formulários de login e de tarefas ainda não chamam a API.
- **`JWT_SECRET` tem valor padrão de desenvolvimento:** deve ser definida por variável de ambiente fora do ambiente local.
- **Sem testes automatizados:** a verificação é manual, pelo `requests.http`.

## Roadmap

1. **Middleware de autenticação:** ler `Authorization: Bearer <token>`, validar com `jwt.verify` e responder `401` quando o token faltar ou for inválido.
2. **Tarefas por usuário:** adicionar `usuario_id` (com chave estrangeira) em `tarefas` e filtrar todas as consultas pelo usuário logado.
3. **Proteção de todas as rotas de tarefas** com o middleware.
4. **Integração do front-end:** telas de registro e login, guarda do token e CRUD de tarefas consumindo a API.
5. **Refinamentos:** variáveis de ambiente em arquivo `.env`, testes automatizados e mensagens de erro padronizadas.

## Observações do Professor

Espaço reservado para as observações e os ajustes solicitados pelo professor ao longo da disciplina. Nenhuma observação registrada até o momento.
