<!-- nav:topo -->
<p align="center">
  <img src="https://img.shields.io/badge/voc%C3%AA_est%C3%A1_aqui-In%C3%ADcio-24292f?style=for-the-badge&logo=github&logoColor=white" alt="Você está aqui: Início">
  <a href="docs/API.md"><img src="https://img.shields.io/badge/API_Gerenciador-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="API Gerenciador"></a>
  <a href="web/README.md"><img src="https://img.shields.io/badge/Front_React-087ea4?style=for-the-badge&logo=react&logoColor=white" alt="Front React"></a>
  <a href="diario-de-bordo/README.md"><img src="https://img.shields.io/badge/Di%C3%A1rio_de_bordo-8250df?style=for-the-badge&logo=bookstack&logoColor=white" alt="Diário de bordo"></a>
  <a href="docs/GUIA_DE_ESTUDOS.md"><img src="https://img.shields.io/badge/Guia_de_estudos-d97706?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Guia de estudos"></a>
  <a href="extras/README.md"><img src="https://img.shields.io/badge/Extras-6e7781?style=for-the-badge&logo=files&logoColor=white" alt="Extras"></a>
</p>
<!-- /nav:topo -->

# DSW: Gerenciador de Tarefas

**Estudante:** Otávio Fertig
**Disciplina:** DSW — Desenvolvimento de Sistemas Web (turma ADS-2025)

Um **gerenciador de tarefas multiusuário**: cada pessoa cria a sua conta, entra com e-mail e senha e organiza as próprias tarefas, com prioridade, busca e filtro. O projeto tem duas partes que funcionam juntas:

- **API** em Node.js + Express + TypeScript ([`server.ts`](server.ts)), com login por JWT e banco de dados **Turso** (SQLite na nuvem);
- **tela** em React + TypeScript + Tailwind CSS ([`web/`](web/)), que a própria API entrega.

O sistema está publicado no **Render**:

[![Abrir o sistema publicado](https://img.shields.io/badge/abrir_o_sistema-no_ar_no_Render-46e3b7?style=for-the-badge&logo=render&logoColor=black)](https://gerenciador-de-tarefas.onrender.com) [![Como foi o deploy](https://img.shields.io/badge/como_foi_o_deploy-passo_a_passo-24292f?style=for-the-badge&logo=render&logoColor=white)](#deploy-no-render)

## Comece por aqui

| Eu quero... | Vá para |
| --- | --- |
| Abrir o sistema publicado na internet | [![Render](https://img.shields.io/badge/Render-46e3b7?style=for-the-badge&logo=render&logoColor=black)](https://gerenciador-de-tarefas.onrender.com) |
| Rodar o projeto na minha máquina | [![Como rodar](https://img.shields.io/badge/Como_rodar-24292f?style=for-the-badge&logo=gnubash&logoColor=white)](#como-rodar) |
| Entender como o sistema foi publicado (deploy) | [![Deploy](https://img.shields.io/badge/Deploy_no_Render-24292f?style=for-the-badge&logo=render&logoColor=white)](#deploy-no-render) |
| Entender a API: rotas, banco e segurança | [![API Gerenciador](https://img.shields.io/badge/API_Gerenciador-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](docs/API.md) |
| Ver a lista de rotas e o que cada uma responde | [![Endpoints](https://img.shields.io/badge/Endpoints-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](docs/API.md#endpoints) |
| Testar as rotas no VS Code | [![requests.http](https://img.shields.io/badge/requests.http-339933?style=for-the-badge)](requests.http) |
| Ver como a tela foi feita | [![Front React](https://img.shields.io/badge/Front_React-087ea4?style=for-the-badge&logo=react&logoColor=white)](web/README.md) |
| Revisar o que aprendi em cada aula | [![Diário de bordo](https://img.shields.io/badge/Di%C3%A1rio_de_bordo-8250df?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/README.md) |
| Ler a aula mais recente | [![Última aula](https://img.shields.io/badge/%C3%9Altima_aula-18_nov:_Leitura_e_an%C3%A1lise-8250df?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/2026-11-18.md) |
| Estudar os conceitos com calma, com glossário | [![Guia de estudos](https://img.shields.io/badge/Guia_de_estudos-d97706?style=for-the-badge&logo=readthedocs&logoColor=white)](docs/GUIA_DE_ESTUDOS.md) |
| Ver os trabalhos de outras aulas (Tailwind, primeiro app React) | [![Extras](https://img.shields.io/badge/Extras-6e7781?style=for-the-badge&logo=files&logoColor=white)](extras/README.md) |

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

[![Abrir a tela](https://img.shields.io/badge/abrir_a_tela-localhost:5173-087ea4?style=for-the-badge&logo=react&logoColor=white)](http://localhost:5173) [![Abrir a API](https://img.shields.io/badge/health_da_API-localhost:3000-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](http://localhost:3000/api/health)

### 3. Igual ao Render (a API entrega a tela)

Um servidor só, na porta 3000, do mesmo jeito que roda na nuvem. É o teste a fazer antes de cada `git push`: se o build quebrar aqui, também quebraria no Render.

```bash
npm run build      # instala a tela, gera web/dist e confere os tipos
npm start
```

[![Abrir a aplicação](https://img.shields.io/badge/abrir_a_aplica%C3%A7%C3%A3o-localhost:3000-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](http://localhost:3000)

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

[![Abrir o sistema](https://img.shields.io/badge/abrir_o_sistema-46e3b7?style=for-the-badge&logo=render&logoColor=black)](https://gerenciador-de-tarefas.onrender.com) [![health](https://img.shields.io/badge/GET-/api/health-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://gerenciador-de-tarefas.onrender.com/api/health) [![db-check](https://img.shields.io/badge/GET-/api/db--check-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://gerenciador-de-tarefas.onrender.com/api/db-check)

> [!NOTE]
> O plano gratuito do Render "dorme" depois de 15 minutos sem visitas. O primeiro acesso depois disso pode demorar perto de 1 minuto: é o servidor acordando, não um erro.

### Como funciona

Toda vez que um commit chega na `main` do GitHub, o Render refaz o deploy sozinho:

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

Um endereço só entrega a tela e a API. Por isso, em produção, a tela não precisa de CORS: tudo vem do mesmo lugar.

### O que foi preparado no código

| Arquivo | O que mudou | Por quê |
| --- | --- | --- |
| [`package.json`](package.json) | o `build` virou `npm --prefix web install && npm run build:web && tsc` | a máquina do Render começa vazia. Sem instalar a tela antes, o Vite não existe lá e o build quebra |
| [`server.ts`](server.ts) | rota nova `GET /api/db-check` | mostra as tabelas do banco e quantas linhas cada uma tem: confirma que o Render está ligado ao Turso |
| [`render.yaml`](render.yaml) | arquivo novo na raiz | é a "receita" do deploy: nome, plano grátis, comandos, variáveis e health check |

### Passo a passo no painel do Render

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

### Como testar depois do deploy

1. Abra `/api/health`. Deve responder `200` com `"banco": "Turso / libSQL (nuvem)"`. Se aparecer `arquivo local (SQLite)`, as variáveis do Turso não chegaram.
2. Abra `/api/db-check`. Deve responder `ok: true`, com as tabelas `usuarios` e `tarefas` e quantas linhas cada uma tem.
3. Abra o endereço principal, entre com `admin@senai.com` / `123456` e crie uma tarefa.
4. Aperte **F5**. A página deve continuar abrindo, sem erro 404: o servidor devolve a tela do React para qualquer caminho que não seja da API.

### Se algo der errado

| O que aparece | Por que acontece | Como resolver |
| --- | --- | --- |
| A página mostra "Ainda não existe o build do front-end" | o build não gerou a tela | conferir se o Build Command tem o `&& npm run build` |
| `/api/health` responde `503` ou o log mostra erro de banco | `TURSO_URL` ou `TURSO_TOKEN` errados | copiar de novo, sem `/` no final da URL e com o token inteiro |
| `/api/health` diz `arquivo local (SQLite)` | as variáveis do Turso não foram cadastradas | cadastrar as duas em **Environment** e fazer um novo deploy |
| A primeira visita demora quase 1 minuto | o plano gratuito dorme sem uso | é normal: depois de acordar, fica rápido |

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Back-end | ![Node.js](https://img.shields.io/badge/Node.js_24-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express 5](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![Turso](https://img.shields.io/badge/Turso_(libSQL)-4ff8d2?style=flat-square&logo=turso&logoColor=black) ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) ![bcrypt](https://img.shields.io/badge/bcryptjs-6e7781?style=flat-square) ![CORS](https://img.shields.io/badge/cors-6e7781?style=flat-square) |
| Front-end | ![React 19](https://img.shields.io/badge/React_19-087ea4?style=flat-square&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646cff?style=flat-square&logo=vite&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0ea5e9?style=flat-square&logo=tailwindcss&logoColor=white) |
| Deploy | ![Render](https://img.shields.io/badge/Render-46e3b7?style=flat-square&logo=render&logoColor=black) ![Turso](https://img.shields.io/badge/Turso-4ff8d2?style=flat-square&logo=turso&logoColor=black) ![GitHub](https://img.shields.io/badge/GitHub-24292f?style=flat-square&logo=github&logoColor=white) |
| Ferramentas | ![npm](https://img.shields.io/badge/npm-cb3837?style=flat-square&logo=npm&logoColor=white) ![tsx](https://img.shields.io/badge/tsx-6e7781?style=flat-square) ![ESLint](https://img.shields.io/badge/ESLint-4b32c3?style=flat-square&logo=eslint&logoColor=white) ![REST Client](https://img.shields.io/badge/REST_Client-007acc?style=flat-square) |

## Andamento por aula

Clique na data para abrir o diário daquela aula. Verde = back-end, azul = front-end.

| Aula | Tema | Diário |
| --- | --- | --- |
| 3 e 4 | Layout com Tailwind CSS (desafio do card responsivo, hoje em [`extras/`](extras/README.md)) | — |
| 5 · 14/08 | Configuração inicial do back-end (Express + TS, rotas de diagnóstico, CRUD em RAM) | — |
| 6 a 9 | Banco SQLite, testes de ataque e tratamento de erros | [![02 set](https://img.shields.io/badge/02_set-339933?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/2026-09-02.md) |
| 10 | Validação profunda e escrita segura (POST, PUT, PATCH, DELETE) | — |
| 11 | Sanitização da busca e prepared statements | [![09 set](https://img.shields.io/badge/09_set-339933?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/2026-09-09.md) |
| 12 | Type guards, allowlists e transações nas rotas de escrita | [![16 set](https://img.shields.io/badge/16_set-339933?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/2026-09-16.md) |
| 13 | Autenticação: registro, login, bcrypt e JWT | [![23 set](https://img.shields.io/badge/23_set-339933?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/2026-09-23.md) |
| React 1 | Introdução ao React: componentes, `useState`, `useEffect`, `fetch` e CORS | [![07 out](https://img.shields.io/badge/07_out-087ea4?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/2026-10-07.md) |
| React 2 | Lista de tarefas com estado, formulário controlado e componente `Tarefa` | [![14 out](https://img.shields.io/badge/14_out-087ea4?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/2026-10-14.md) |
| Lab | Ajustes com Tailwind, lacunas de lógica e o back servindo o front (`express.static` e SPA fallback) | [![28 out](https://img.shields.io/badge/28_out-087ea4?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/2026-10-28.md) |
| 09 | Banco de dados em nuvem: `@libsql/client` (Turso), `.env` com detecção de BOM, `db.batch()` e rotas assíncronas | [![04 nov](https://img.shields.io/badge/04_nov-339933?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/2026-11-04.md) |
| 10 | Deploy no Render: `render.yaml`, build que instala a tela, rota `/api/db-check`, variáveis de ambiente e projeto centralizado na raiz | [![11 nov](https://img.shields.io/badge/11_nov-339933?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/2026-11-11.md) |
| Atividade | Leitura e análise do front (questionário ENADE), caça ao bug (debounce, `await`, resposta 204) e filtro por prioridade com `useMemo` | [![18 nov](https://img.shields.io/badge/18_nov-087ea4?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/2026-11-18.md) |

Os pontos em aberto e os próximos passos estão na [documentação da API](docs/API.md#limitações-atuais).

## Observações do Professor

Espaço reservado para as observações e os ajustes solicitados pelo professor ao longo da disciplina. Nenhuma observação registrada até o momento.

<!-- nav:rodape -->
---

<p align="center">
  <a href="#top"><img src="https://img.shields.io/badge/%E2%AC%86_voltar_ao_topo-6e7781?style=for-the-badge" alt="⬆ voltar ao topo"></a>
  <a href="docs/API.md"><img src="https://img.shields.io/badge/pr%C3%B3ximo_%E2%86%92-API_Gerenciador-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="próximo →"></a>
</p>
<!-- /nav:rodape -->
