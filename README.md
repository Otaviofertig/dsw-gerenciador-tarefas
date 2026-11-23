<!-- nav:topo -->
<p align="center">
  <img src="docs/assets/botoes/voc-est-aqui-incio-bb48ba.svg" alt="Você está aqui: Início">
  <a href="docs/API.md"><img src="docs/assets/botoes/api-gerenciador-4e8698.svg" alt="API Gerenciador"></a>
  <a href="web/README.md"><img src="docs/assets/botoes/front-react-1df9b7.svg" alt="Front React"></a>
  <a href="diario-de-bordo/README.md"><img src="docs/assets/botoes/dirio-de-bordo-b821ca.svg" alt="Diário de bordo"></a>
  <a href="docs/GUIA_DE_ESTUDOS.md"><img src="docs/assets/botoes/guia-de-estudos-abf8ad.svg" alt="Guia de estudos"></a>
  <a href="extras/README.md"><img src="docs/assets/botoes/extras-4a886c.svg" alt="Extras"></a>
</p>
<!-- /nav:topo -->

<p align="center">
  <img src="docs/assets/banner.svg" width="100%" alt="Gerenciador de Tarefas: React, Express, TypeScript, Turso e Render. Uma lista de tarefas animada vai sendo concluída.">
</p>

# DSW: Gerenciador de Tarefas

<p>
  <a href="https://gerenciador-de-tarefas.onrender.com"><img src="docs/assets/botoes/deploy-render-e9b770.svg" alt="deploy: Render"></a>
  <img src="docs/assets/botoes/aulas-no-dirio-10-a0413c.svg" alt="aulas no diário: 10">
  <img src="docs/assets/botoes/node-js-24-a7f8d6.svg" alt="Node.js 24">
  <img src="docs/assets/botoes/react-19-75d94c.svg" alt="React 19">
  <img src="docs/assets/botoes/typescript-strict-4da69d.svg" alt="TypeScript">
</p>

**Estudante:** Otávio Fertig<br>
**Disciplina:** DSW — Desenvolvimento de Sistemas Web (turma ADS-2025)

Um **gerenciador de tarefas multiusuário**: cada pessoa cria a sua conta, entra com e-mail e senha e organiza as próprias tarefas, com prioridade, busca e filtro. O projeto tem duas partes que funcionam juntas:

- **API** em Node.js + Express + TypeScript ([`server.ts`](server.ts)), com login por JWT e banco de dados **Turso** (SQLite na nuvem);
- **tela** em React + TypeScript + Tailwind CSS ([`web/`](web/)), que a própria API entrega.

O sistema está publicado no **Render**:

[![Abrir o sistema publicado](docs/assets/botoes/abrir-o-sistema-no-ar-no-render-680507.svg)](https://gerenciador-de-tarefas.onrender.com) [![Como foi o deploy](docs/assets/botoes/como-foi-o-deploy-passo-a-passo-4330cf.svg)](#deploy-no-render)

**Nesta página:** [Funcionalidades](#o-que-o-sistema-faz) · [Comece por aqui](#comece-por-aqui) · [Estrutura](#estrutura-do-projeto) · [Como rodar](#como-rodar) · [Deploy](#deploy-no-render) · [Tecnologias](#tecnologias) · [Andamento](#andamento-por-aula)

## O que o sistema faz

- [x] Criar conta e entrar com e-mail e senha (senha guardada com **bcrypt**, login com **JWT**)
- [x] Cada pessoa vê só as próprias tarefas
- [x] Criar, concluir e excluir tarefas, com prioridade baixa, média ou alta
- [x] Buscar por título, com **debounce** para não chamar a API a cada letra
- [x] Filtrar por prioridade na própria tela
- [x] Dados guardados na nuvem (**Turso**), que não somem quando o servidor reinicia
- [x] Publicado na internet (**Render**), com deploy automático a cada push na `main`
- [ ] Testes automatizados (próximo passo, veja o [roadmap](docs/API.md#roadmap))

## Comece por aqui

| Eu quero... | Vá para |
| --- | --- |
| Abrir o sistema publicado na internet | [![Render](docs/assets/botoes/render-20a379.svg)](https://gerenciador-de-tarefas.onrender.com) |
| Rodar o projeto na minha máquina | [![Como rodar](docs/assets/botoes/como-rodar-5dfde1.svg)](#como-rodar) |
| Entender como o sistema foi publicado (deploy) | [![Deploy](docs/assets/botoes/deploy-no-render-ba0ab5.svg)](#deploy-no-render) |
| Entender a API: rotas, banco e segurança | [![API Gerenciador](docs/assets/botoes/api-gerenciador-4e8698.svg)](docs/API.md) |
| Ver a lista de rotas e o que cada uma responde | [![Endpoints](docs/assets/botoes/endpoints-5126ad.svg)](docs/API.md#endpoints) |
| Testar as rotas no VS Code | [![requests.http](docs/assets/botoes/requests-http-24c378.svg)](requests.http) |
| Ver como a tela foi feita | [![Front React](docs/assets/botoes/front-react-1df9b7.svg)](web/README.md) |
| Revisar o que aprendi em cada aula | [![Diário de bordo](docs/assets/botoes/dirio-de-bordo-b821ca.svg)](diario-de-bordo/README.md) |
| Ler a aula mais recente | [![Última aula](docs/assets/botoes/ltima-aula-18-nov-leitura-e-anlise-3e130d.svg)](diario-de-bordo/2026-11-18.md) |
| Estudar os conceitos com calma, com glossário | [![Guia de estudos](docs/assets/botoes/guia-de-estudos-abf8ad.svg)](docs/GUIA_DE_ESTUDOS.md) |
| Ver os trabalhos de outras aulas (Tailwind, primeiro app React) | [![Extras](docs/assets/botoes/extras-4a886c.svg)](extras/README.md) |

## Estrutura do projeto

O projeto inteiro fica na raiz do repositório, no mesmo formato do material da disciplina: a API na raiz e a tela na pasta `web/`.

```
dsw-gerenciador-tarefas/
├── server.ts            # a API: rotas, banco, login e entrega da tela
├── package.json         # scripts da API (dev, start, build) e dependências
├── tsconfig.json
├── render.yaml          # receita do deploy no Render
├── .env.example         # modelo do .env com TURSO_URL e TURSO_TOKEN
├── requests.http        # testes das rotas (REST Client do VS Code)
├── web/                 # a tela em React (Vite + TypeScript + Tailwind)
│   └── src/             #   App, Login, Tarefas e api.ts
├── diario-de-bordo/     # o que aprendi em cada aula
├── docs/
│   ├── API.md           # documentação completa da API
│   └── GUIA_DE_ESTUDOS.md
└── extras/              # trabalhos de outras aulas
```

## Como rodar

Precisa do **Node.js 24** e do **npm**.

### 1. Primeira vez

```bash
npm install            # dependências da API
npm --prefix web install   # dependências da tela
```

**Banco de dados:** sem configurar nada, a API grava num arquivo local (`tarefas.db`), o que já basta para testar. Para usar o Turso, copie o `.env.example` para `.env` e preencha os dois valores:

```env
TURSO_URL=libsql://seu-banco.turso.io
TURSO_TOKEN=seu-token
```

O `.env` nunca vai para o GitHub (está no `.gitignore`). Ao ligar, o terminal mostra para onde os dados estão indo:

```
  Modo  : Turso / libSQL (nuvem)
  Onde  : libsql://seu-banco.turso.io
  Token : presente (nunca será mostrado)
```

### 2. Dia a dia: tela e API juntas

Sobe a API e o Vite num terminal só. A tela atualiza sozinha quando você salva um arquivo.

```bash
npm run dev:all
```

[![Abrir a tela](docs/assets/botoes/abrir-a-tela-localhost-5173-3f8f40.svg)](http://localhost:5173) [![Abrir a API](docs/assets/botoes/health-da-api-localhost-3000-206be6.svg)](http://localhost:3000/api/health)

### 3. Igual ao Render (a API entrega a tela)

Um servidor só, na porta 3000, do mesmo jeito que roda na nuvem. É o teste a fazer antes de cada `git push`: se o build quebrar aqui, também quebraria no Render.

```bash
npm run build      # instala a tela, gera web/dist e confere os tipos
npm start
```

[![Abrir a aplicação](docs/assets/botoes/abrir-a-aplicao-localhost-3000-c65fb4.svg)](http://localhost:3000)

### 4. Só a API

Para testar as rotas pelo [`requests.http`](requests.http) no VS Code.

```bash
npm run dev
```

**Usuário de teste:** o servidor cria sozinho o `admin@senai.com` com a senha `123456`.

> [!WARNING]
> **"Porta 3000 já está em uso":** já existe outro servidor rodando, provavelmente esquecido em outro terminal. Feche-o com `Ctrl+C` antes de subir de novo.

## Deploy no Render

**Deploy** é colocar o sistema na internet, num endereço que qualquer pessoa consegue abrir. O **Render** pega o código do GitHub, prepara tudo numa máquina dele e deixa o site no ar. Os dados continuam no **Turso**, então nada se perde quando o Render reinicia ou atualiza o servidor.

[![Abrir o sistema](docs/assets/botoes/abrir-o-sistema-d5893e.svg)](https://gerenciador-de-tarefas.onrender.com) [![health](docs/assets/botoes/get-api-health-5e438c.svg)](https://gerenciador-de-tarefas.onrender.com/api/health) [![db-check](docs/assets/botoes/get-api-db-check-21c8ea.svg)](https://gerenciador-de-tarefas.onrender.com/api/db-check)

> [!NOTE]
> O plano gratuito do Render "dorme" depois de 15 minutos sem visitas. O primeiro acesso depois disso pode demorar perto de 1 minuto: é o servidor acordando, não um erro.

### Como funciona

Toda vez que um commit chega na `main` do GitHub, o Render refaz o deploy sozinho. Depois, cada pedido da tela passa pela API e chega ao banco:

<p align="center">
  <img src="docs/assets/fluxo.svg" width="100%" alt="Animação: o push no GitHub dispara o deploy no Render. A tela manda GET /api/tasks com o token para a API no Render, a API consulta o Turso filtrando pelo usuario_id e a resposta volta em JSON.">
</p>

<details>
<summary>Ver o mesmo fluxo em texto</summary>

```
 GitHub (main) ──push──▶ Render
                           1. npm install        → dependências da API
                           2. npm run build      → instala a tela, gera web/dist e confere os tipos
                           3. npm start          → liga o servidor
                                      │
                 https://gerenciador-de-tarefas.onrender.com
                   ├── /         → a tela do React
                   ├── /api/...  → a API
                   └── dados ───▶ Turso (banco na nuvem)
```

</details>

Um endereço só entrega a tela e a API. Por isso, em produção, a tela não precisa de CORS: tudo vem do mesmo lugar.

### O que foi preparado no código

| Arquivo | O que mudou | Por quê |
| --- | --- | --- |
| [`package.json`](package.json) | o `build` virou `npm --prefix web install && npm run build:web && tsc` | a máquina do Render começa vazia. Sem instalar a tela antes, o Vite não existe lá e o build quebra |
| [`server.ts`](server.ts) | rota nova `GET /api/db-check` | mostra as tabelas do banco e quantas linhas cada uma tem: confirma que o Render está ligado ao Turso |
| [`render.yaml`](render.yaml) | arquivo novo na raiz | é a "receita" do deploy: nome, plano grátis, comandos, variáveis e health check |

<details>
<summary><b>Passo a passo no painel do Render</b></summary>

1. Entre em [render.com](https://render.com) com a conta do GitHub.
2. Clique em **New + → Web Service** e conecte este repositório.
3. Preencha:

   | Campo | Valor |
   | --- | --- |
   | Name | `gerenciador-de-tarefas` |
   | Runtime | Node |
   | Plan | Free |
   | Build Command | `npm install && npm run build` (o padrão do Render é só `npm install`: não esqueça o `&& npm run build`) |
   | Start Command | `npm start` |

4. Em **Environment Variables**, cadastre as três variáveis:

   | Variável | O que colocar | Cuidado |
   | --- | --- | --- |
   | `JWT_SECRET` | clique em **Generate** | é a chave que assina os logins; o Render cria uma difícil de adivinhar |
   | `TURSO_URL` | `libsql://seu-banco.turso.io` (o mesmo do seu `.env`) | sem `/` no final |
   | `TURSO_TOKEN` | o token inteiro (começa com `eyJ`) | copiar até o fim |

5. Clique em **Create Web Service** e acompanhe os **Logs**. O primeiro deploy leva de 3 a 5 minutos.

> [!TIP]
> Outro caminho: **New + → Blueprint**. O Render lê o `render.yaml` sozinho e só pergunta o `TURSO_URL` e o `TURSO_TOKEN`.

</details>

### Como testar depois do deploy

1. Abra `/api/health`. Deve responder `200` com `"banco": "Turso / libSQL (nuvem)"`. Se aparecer `arquivo local (SQLite)`, as variáveis do Turso não chegaram.
2. Abra `/api/db-check`. Deve responder `ok: true`, com as tabelas `usuarios` e `tarefas` e quantas linhas cada uma tem.
3. Abra o endereço principal, entre com `admin@senai.com` / `123456` e crie uma tarefa.
4. Aperte **F5**. A página deve continuar abrindo, sem erro 404: o servidor devolve a tela do React para qualquer caminho que não seja da API.

<details>
<summary><b>Se algo der errado</b></summary>

| O que aparece | Por que acontece | Como resolver |
| --- | --- | --- |
| A página mostra "Ainda não existe o build do front-end" | o build não gerou a tela | conferir se o Build Command tem o `&& npm run build` |
| `/api/health` responde `503` ou o log mostra erro de banco | `TURSO_URL` ou `TURSO_TOKEN` errados | copiar de novo, sem `/` no final da URL e com o token inteiro |
| `/api/health` diz `arquivo local (SQLite)` | as variáveis do Turso não foram cadastradas | cadastrar as duas em **Environment** e fazer um novo deploy |
| A primeira visita demora quase 1 minuto | o plano gratuito dorme sem uso | é normal: depois de acordar, fica rápido |

</details>

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Back-end | ![Node.js](docs/assets/botoes/node-js-24-0aeae6.svg) ![Express 5](docs/assets/botoes/express-5-9178c1.svg) ![TypeScript](docs/assets/botoes/typescript-68ed4a.svg) ![Turso](docs/assets/botoes/turso-libsql-80730e.svg) ![JWT](docs/assets/botoes/jwt-bee6ab.svg) ![bcrypt](docs/assets/botoes/bcryptjs-511cfe.svg) ![CORS](docs/assets/botoes/cors-d7d0dc.svg) |
| Front-end | ![React 19](docs/assets/botoes/react-19-da2d67.svg) ![Vite](docs/assets/botoes/vite-859d86.svg) ![TypeScript](docs/assets/botoes/typescript-68ed4a.svg) ![Tailwind CSS](docs/assets/botoes/tailwind-css-5ff3b8.svg) |
| Deploy | ![Render](docs/assets/botoes/render-bac91c.svg) ![Turso](docs/assets/botoes/turso-b9565d.svg) ![GitHub](docs/assets/botoes/github-888a05.svg) |
| Ferramentas | ![npm](docs/assets/botoes/npm-0907c7.svg) ![tsx](docs/assets/botoes/tsx-20d487.svg) ![ESLint](docs/assets/botoes/eslint-1f8b1a.svg) ![REST Client](docs/assets/botoes/rest-client-90f1d7.svg) |

## Andamento por aula

As aulas de setembro em diante seguem a numeração do material do professor (Aula 00 = 02/09). Clique na data para abrir o diário. Verde = back-end, azul = front-end.

<details>
<summary><b>Antes do diário: agosto</b> (Tailwind, primeira API e banco SQLite)</summary>

| Aulas | Tema |
| --- | --- |
| 3 e 4 | Layout com Tailwind CSS (desafio do card responsivo, hoje em [`extras/`](extras/README.md)) |
| 5 · 14/08 | Configuração inicial do back-end: Express + TypeScript, rotas de diagnóstico e CRUD em memória |
| 6 a 10 | Banco SQLite, validação profunda e escrita segura (POST, PUT, PATCH, DELETE) |

</details>

| Aula | Tema | Diário |
| :---: | --- | :---: |
| 00 | Tratamento de erros e testes de ataque | [![02 set](docs/assets/botoes/02-set-48d263.svg)](diario-de-bordo/2026-09-02.md) |
| 01 | Sanitização da busca e prepared statements | [![09 set](docs/assets/botoes/09-set-2228e8.svg)](diario-de-bordo/2026-09-09.md) |
| 02 | Type guards, allowlists e transações nas rotas de escrita | [![16 set](docs/assets/botoes/16-set-d5841b.svg)](diario-de-bordo/2026-09-16.md) |
| 03 | Autenticação: registro, login, bcrypt e JWT | [![23 set](docs/assets/botoes/23-set-9b649a.svg)](diario-de-bordo/2026-09-23.md) |
| 04 | Protegendo rotas: middleware `authenticate` e tarefas por usuário | [![30 set: sem diário, ver no código](docs/assets/botoes/30-set-ver-no-cdigo-6af2b8.svg)](docs/API.md#fluxo-de-autenticação) |
| 05 | Introdução ao React: componentes, `useState`, `useEffect`, `fetch` e CORS | [![07 out](docs/assets/botoes/07-out-f8ca98.svg)](diario-de-bordo/2026-10-07.md) |
| 06 | Lista de tarefas com estado, formulário controlado e componente `Tarefa` | [![14 out](docs/assets/botoes/14-out-1a2f2b.svg)](diario-de-bordo/2026-10-14.md) |
| 07 | Lista de tarefas ligada à API: debounce na busca, `useRef` e modal acessível | [![21 out: sem diário, ver no código](docs/assets/botoes/21-out-ver-no-cdigo-27b45a.svg)](web/README.md#como-funciona) |
| 08 | Laboratório: Tailwind, lacunas de lógica e o back servindo o front (`express.static` e SPA fallback) | [![28 out](docs/assets/botoes/28-out-2b8bd4.svg)](diario-de-bordo/2026-10-28.md) |
| 09 | Banco em nuvem: `@libsql/client` (Turso), `.env` com detecção de BOM, `db.batch()` e rotas assíncronas | [![04 nov](docs/assets/botoes/04-nov-7cf6ad.svg)](diario-de-bordo/2026-11-04.md) |
| 10 | Deploy no Render: `render.yaml`, build que instala a tela, `/api/db-check` e variáveis de ambiente | [![11 nov](docs/assets/botoes/11-nov-85394d.svg)](diario-de-bordo/2026-11-11.md) |
| 11 | Leitura e análise do front (questionário ENADE), caça ao bug e filtro por prioridade com `useMemo` | [![18 nov](docs/assets/botoes/18-nov-831c5b.svg)](diario-de-bordo/2026-11-18.md) |

Os pontos em aberto e os próximos passos estão na [documentação da API](docs/API.md#limitações-atuais).

## Observações do Professor

Espaço reservado para as observações e os ajustes solicitados pelo professor ao longo da disciplina. Nenhuma observação registrada até o momento.

<!-- nav:rodape -->
---

<p align="center">
  <a href="#top"><img src="docs/assets/botoes/voltar-ao-topo-5af198.svg" alt="⬆ voltar ao topo"></a>
  <a href="docs/API.md"><img src="docs/assets/botoes/prximo-api-gerenciador-abc8fd.svg" alt="próximo →"></a>
</p>
<!-- /nav:rodape -->
