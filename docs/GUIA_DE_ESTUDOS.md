# DSW: Guia de Estudos — Gerenciador de Tarefas

*Atualizado em 23/09/2026*

## Introdução

Este guia resume tudo que já foi construído no projeto **Gerenciador de Tarefas** (disciplina DSW), do zero até a aula de autenticação. É um back-end em **Node.js + Express + TypeScript**, com persistência em **SQLite** (via `better-sqlite3`), pensado para ser multi-usuário.

A lógica evoluiu em camadas, sempre puxada por uma pergunta de segurança ou de robustez:

1. Rotas básicas e diagnóstico do servidor
2. CRUD completo de tarefas
3. Validação, sanitização e prepared statements (defesa contra SQL injection)
4. Autenticação de usuários com hash de senha e JWT

Cada seção abaixo explica **o problema que motivou a mudança**, **o que foi implementado** e **por que funciona**, na ordem em que apareceu no curso.

---

## Fundamentos do servidor

**Aula 5 (14/08):** configuração inicial do back-end.

- `express()` cria o app; `app.listen(PORT, …)` sobe o servidor.
- `app.use(express.json())` é o middleware que lê o corpo das requisições em JSON — sem ele, `req.body` chega vazio.
- Rotas de diagnóstico, sempre presentes para checar se o servidor está de pé:

| Rota | Papel |
| --- | --- |
| `GET /` | Fallback, devolve um JSON simples de identificação da turma |
| `GET /api/health` | Health check — confirma que o servidor está ativo |
| `GET /api/version` | Devolve nome e versão da aplicação |

- A porta deixou de ser um número fixo (`3000`) e passou a vir de variável de ambiente: `const PORT = Number(process.env.PORT) || 3000;`. Isso importa porque cada ambiente (local, produção, um serviço de deploy) pode exigir uma porta diferente, e o código não deveria precisar mudar para isso.
- **Interfaces TypeScript** (`Tarefa`, depois `Usuario`) funcionam como um "molde": documentam o formato dos dados e dão autocompletar/checagem de tipo ao usar `as Tarefa` depois de uma consulta no banco.
- **Helpers centralizados no topo do arquivo** (`tituloValido`, `normalizarPrioridade`, `normalizarStatus`, `parsearId`): a regra de validação é escrita uma única vez e reaproveitada em todas as rotas que precisam dela. Se a regra mudar (por exemplo, título mínimo passar de 3 para 5 caracteres), muda em um só lugar — não em cada rota separadamente.

---

## CRUD de Tarefas

**Aulas 5 a 10 (14/08 a 09/09):** do banco em RAM ao SQLite persistente, com validação rígida.

| Rota | O que faz | Validações principais |
| --- | --- | --- |
| `GET /api/tasks` | Lista tarefas, com busca opcional por `?search=` | Coerção segura: array ou `undefined` no query vira string vazia |
| `POST /api/tasks` | Cria tarefa | Título ≥ 3 caracteres (via `tituloValido`), prioridade cai numa allowlist (`low`/`medium`/`high`) |
| `PUT /api/tasks/:id` | Substitui a tarefa inteira | Mesmas regras de título/prioridade/status, 404 se o id não existir |
| `PATCH /api/tasks/:id` | Atualiza só os campos enviados | Roda dentro de uma transação (`db.transaction`), monta o `UPDATE` dinamicamente só com os campos presentes |
| `DELETE /api/tasks/:id` | Remove a tarefa | 404 se `resultado.changes === 0` (nenhuma linha afetada) |

Ideias-chave:

- **Banco como SQLite real** (`better-sqlite3`), tabela `tarefas` com `id`, `titulo`, `status`, `prioridade`.
- **Prepared statements compilados uma única vez** (`db.prepare(...)`) e guardados em constantes no topo do arquivo (`stmtListarTodas`, `stmtInserirTarefa`, etc.), em vez de recriar a query a cada requisição — mais rápido e mais seguro.
- **PATCH transacional**: buscar o registro atual, montar a lista de campos a alterar e executar tudo dentro de `db.transaction(() => {...})`. Se qualquer validação falhar no meio do caminho, nada é gravado — a tarefa nunca fica "meio atualizada".
- **Erro do cliente vs. erro do servidor**: um título inválido é `400` (quem errou foi quem enviou o dado); uma falha inesperada no banco é `500`, sempre com mensagem genérica, nunca expondo a estrutura interna do banco ou a mensagem de exceção crua.

---

## Validação, sanitização e prepared statements

**Aula 11 (09/09) e Aula 12 (16/09):** blindar as rotas contra dado malicioso ou mal-formado.

### O ataque de SQL Injection

Um invasor pode tentar mandar isto na busca:

```
GET /api/tasks?search=' UNION SELECT id, email, senha FROM usuarios --
```

Se a query fosse montada por concatenação de string (`"...WHERE titulo LIKE '%" + search + "%'"`), esse texto quebraria a query original e vazaria a tabela de usuários. A defesa é o **prepared statement com parâmetro `?`**: o valor do usuário nunca vira parte do SQL, só um dado comparado dentro de `stmtBuscarPorTitulo.all()`, com o `%` entrando apenas dentro do parâmetro, nunca dentro da query.

### Coerção seguindo o tipo esperado

- **Array injection**: `?search=a&search=b` faz o Express entregar um array em `req.query.search`. Sem proteção, o JS converteria isso em `"a,b"` e buscaria algo sem sentido. A defesa: `typeof req.query.search === "string" ? req.query.search : ""` — se não for string pura, vira string vazia de propósito.
- **Parâmetro indefinido**: `?search[]=a` faz `req.query.search` ficar `undefined` de um jeito inesperado; a mesma coerção acima cobre esse caso.

### Type guards e allowlists

- `tituloValido` é um **type guard** (`t is string`): barra título numérico, `null`, objeto etc., não só string vazia.
- Prioridade e status usam **allowlist** (`PRIORIDADES`, `STATUS_VALIDOS`): um valor fora da lista (`"cancelled"`, `"super_urgent"`) é rejeitado ou substituído por um padrão seguro, dependendo da rota — nunca deixado passar para o banco.

### Regra de ouro

Nunca devolver a mensagem de erro crua do banco/exceção para quem fez a requisição — isso pode revelar como o sistema é feito por dentro e ajudar um invasor. Resposta sempre genérica: `"Erro interno ao processar..."`.

---

## Autenticação: bcrypt e JWT

**Aula de hoje (23/09):** dar identidade segura a cada usuário.

### O problema do texto puro

Se a coluna `senha` guardasse o valor literal digitado (`"senha123"`), um vazamento do banco comprometeria todas as contas instantaneamente — e ninguém deveria conseguir saber a senha de ninguém, nem o próprio time de desenvolvimento.

### Tabela `usuarios` com trava `UNIQUE`

```sql
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL
);
```

`UNIQUE` faz o **próprio banco** recusar um e-mail repetido, mesmo que alguém esqueça de validar isso no código. Detalhe importante: como a criação usa `CREATE TABLE IF NOT EXISTS`, um banco antigo (sem a trava) não é atualizado automaticamente — é preciso apagar o arquivo `.db` e deixá-lo nascer de novo com o schema certo.

### `POST /api/auth/register`

1. Valida que `email` e `senha` são strings e que a senha tem 6+ caracteres.
2. Gera o hash: `bcrypt.hashSync(senha, 10)` — o `10` é o "custo" (rounds) do algoritmo, quanto maior, mais lento e mais resistente a força bruta.
3. Insere `(email, hash)` no banco; se o `UNIQUE` disparar, o `catch` devolve `409 Conflict` ("E-mail já cadastrado") em vez de vazar o erro do SQLite.

O hash (`$2a$10$...`) é uma via de mão única: dá para comparar uma senha contra ele, mas não dá para reverter o hash de volta para o texto original.

### `POST /api/auth/login`

1. Busca o usuário por e-mail.
2. Compara a senha enviada com `bcrypt.compareSync(senha, hashEsperado)`.
3. Se bater e o usuário existir, gera um token: `jwt.sign({ id, email }, JWT_SECRET, { expiresIn: "2h" })`.

**Defesa contra timing attack:** se comparássemos a senha só quando o e-mail existe, a resposta seria mais rápida para e-mails inexistentes (falha sem calcular bcrypt) e mais lenta para e-mails existentes (bcrypt roda de verdade) — um atacante mediria esse tempo para descobrir quais e-mails estão cadastrados. A correção: quando o usuário não existe, comparar mesmo assim contra um **hash falso fixo** (`$2a$10$fakehashparanaquebrarcomparacao`), garantindo que a operação sempre leve o mesmo tempo.

### O que é o JWT

Um JSON Web Token é um "crachá" assinado com `JWT_SECRET`: carrega o `id` e o `email` do usuário e uma validade (`expiresIn: "2h"`). Qualquer tentativa de alterar o conteúdo do token quebra a assinatura, e o servidor rejeita. `JWT_SECRET` deveria sempre vir de variável de ambiente em produção, nunca fixo no código.

### O que ainda falta (próxima aula)

O token já é gerado corretamente, mas **nenhuma rota ainda exige ele** — `/api/tasks` continua aberta para qualquer um. A próxima etapa é um middleware que leia o cabeçalho `Authorization: Bearer <token>`, valide com `jwt.verify` e só então libere acesso às rotas de criar/editar/excluir tarefas.

---

## Resumo e glossário

### Resumo geral

| Camada | Problema resolvido | Mecanismo |
| --- | --- | --- |
| Servidor | Confirmar que a API está de pé, portas fixas atrapalham deploy | Rotas de diagnóstico + `PORT` via variável de ambiente |
| CRUD | Persistir tarefas de forma confiável | SQLite + prepared statements + transações |
| Validação | Dado errado ou malicioso não pode quebrar o servidor nem o banco | Type guards, allowlists, coerção de tipo, prepared statements |
| Autenticação | Provar quem é o usuário sem expor a senha | bcrypt (hash) + JWT (token assinado) |

### Glossário de termos-chave

- **Prepared statement**: consulta SQL compilada com parâmetros (`?`) no lugar de valores; o valor do usuário nunca vira parte do texto da query, o que impede SQL injection.
- **Type guard**: função que checa o tipo de um valor em tempo de execução (`typeof`, `t is string`) e "ensina" o TypeScript sobre esse tipo depois do `if`.
- **Allowlist**: lista fechada de valores aceitos; qualquer coisa fora dela é rejeitada ou trocada por um padrão.
- **Hash (bcrypt)**: transformação de mão única da senha; serve para comparar, nunca para recuperar o texto original.
- **UNIQUE (SQL)**: restrição de banco que impede duas linhas com o mesmo valor numa coluna.
- **Timing attack**: ataque que descobre informação medindo quanto tempo o servidor demora para responder em cenários diferentes.
- **JWT (JSON Web Token)**: token assinado que carrega dados do usuário e uma validade; a assinatura garante que ninguém alterou o conteúdo sem ter a chave secreta.
- **Transação (`db.transaction`)**: agrupa várias operações no banco para que aconteçam todas ou nenhuma, evitando estado parcial.

### Linha do tempo dos commits (visão rápida)

1. `feat: configuracao inicial do backend` — Express + TS, rota de fallback.
2. `feat: get, post e delete tasks` — CRUD inicial em memória.
3. `feat: adição do banco de dados` — troca para SQLite.
4. `feat: testes de ataque e resposta de erro` — primeiros testes de segurança.
5. `fix: sanitiza query search e blinda rota GET /api/tasks` — coerção de tipo no `search`.
6. `perf: compila prepared statements na inicializacao do banco` — statements reaproveitados.
7. `feat: blindagem da criacao/exclusao/atualizacao (POST/DELETE/PUT/PATCH)` — validação padronizada em todo o CRUD.
8. `feat: adiciona UNIQUE em usuarios.email e prepara buscas de autenticacao` — base da autenticação.
9. `feat: adiciona rota de registro / login` — bcrypt + JWT completos.
