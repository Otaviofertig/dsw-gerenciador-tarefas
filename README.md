<!-- nav:topo -->
<p align="center">
  <img src="https://img.shields.io/badge/voc%C3%AA_est%C3%A1_aqui-In%C3%ADcio-24292f?style=for-the-badge&logo=github&logoColor=white" alt="Você está aqui: Início">
  <a href="gerenciador-tarefas/README.md"><img src="https://img.shields.io/badge/API_Gerenciador-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="API Gerenciador"></a>
  <a href="app-react/README.md"><img src="https://img.shields.io/badge/Front_React-087ea4?style=for-the-badge&logo=react&logoColor=white" alt="Front React"></a>
  <a href="diario-de-bordo/README.md"><img src="https://img.shields.io/badge/Di%C3%A1rio_de_bordo-8250df?style=for-the-badge&logo=bookstack&logoColor=white" alt="Diário de bordo"></a>
  <a href="docs/GUIA_DE_ESTUDOS.md"><img src="https://img.shields.io/badge/Guia_de_estudos-d97706?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Guia de estudos"></a>
  <a href="exercicios/tailwind/dicas.md"><img src="https://img.shields.io/badge/Tailwind-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"></a>
</p>
<!-- /nav:topo -->

# DSW: Gerenciador de Tarefas

**Estudante:** Otávio Fertig
**Disciplina:** DSW — Desenvolvimento de Sistemas Web (turma ADS-2025)

Repositório da disciplina de DSW. Reúne o projeto principal (um **gerenciador de tarefas** com API em Node.js + SQLite na nuvem pelo Turso), as **aplicações em React** feitas nas aulas de front-end, os exercícios de Tailwind CSS e o diário de bordo com o que aprendi em cada aula.

## Comece por aqui

Escolha o que você quer fazer e clique no botão. Todas as páginas têm a mesma barra no topo, para você voltar ou pular para outra parte a qualquer momento.

| Eu quero... | Vá para |
| --- | --- |
| Rodar o projeto na minha máquina | [![Como rodar](https://img.shields.io/badge/Como_rodar-24292f?style=for-the-badge&logo=gnubash&logoColor=white)](#como-rodar) |
| Entender a API: rotas, banco e segurança | [![API Gerenciador](https://img.shields.io/badge/API_Gerenciador-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](gerenciador-tarefas/README.md) |
| Ver a lista de rotas e o que cada uma responde | [![Endpoints](https://img.shields.io/badge/Endpoints-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](gerenciador-tarefas/README.md#endpoints) |
| Configurar o banco na nuvem | [![Turso](https://img.shields.io/badge/Turso-4ff8d2?style=for-the-badge&logo=turso&logoColor=white)](gerenciador-tarefas/README.md#banco-em-nuvem-turso) |
| Testar as rotas no VS Code | [![requests.http](https://img.shields.io/badge/requests.http-339933?style=for-the-badge)](gerenciador-tarefas/api/requests.http) |
| Ver as telas em React | [![Front React](https://img.shields.io/badge/Front_React-087ea4?style=for-the-badge&logo=react&logoColor=white)](app-react/README.md) |
| Revisar o que aprendi em cada aula | [![Diário de bordo](https://img.shields.io/badge/Di%C3%A1rio_de_bordo-8250df?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/README.md) |
| Ler a aula mais recente | [![Última aula](https://img.shields.io/badge/%C3%9Altima_aula-04_nov:_Banco_em_nuvem-8250df?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/2026-11-04.md) |
| Estudar os conceitos com calma, com glossário | [![Guia de estudos](https://img.shields.io/badge/Guia_de_estudos-d97706?style=for-the-badge&logo=readthedocs&logoColor=white)](docs/GUIA_DE_ESTUDOS.md) |
| Consultar a tabela CSS → Tailwind | [![Tailwind](https://img.shields.io/badge/Tailwind-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white)](exercicios/tailwind/dicas.md) |

## Estrutura de pastas

```
dsw-gerenciador-tarefas/
├── gerenciador-tarefas/     # projeto principal
│   ├── api/                 #   back-end: Express + TS + Turso
│   └── prototipo-html/      #   tela estática (Tailwind)
├── app-react/               # aplicações React (Vite)
│   ├── meu-primeiro-app/    #   lista de tarefas (JS)
│   └── web/                 #   front que consome a API
├── exercicios/tailwind/     # card responsivo e dicas
├── diario-de-bordo/         # uma página por aula
└── docs/GUIA_DE_ESTUDOS.md  # resumo e glossário
```

| Pasta | O que tem | Abrir |
| --- | --- | --- |
| `gerenciador-tarefas/` | API completa (rotas, banco, autenticação), testes `requests.http` e protótipo HTML | [![API Gerenciador](https://img.shields.io/badge/API_Gerenciador-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](gerenciador-tarefas/README.md) |
| `app-react/` | Os dois projetos React das aulas | [![Front React](https://img.shields.io/badge/Front_React-087ea4?style=for-the-badge&logo=react&logoColor=white)](app-react/README.md) |
| `exercicios/tailwind/` | Páginas de prática das aulas 3 e 4 (abrir o `.html` no navegador) e a tabela CSS → Tailwind | [![Tailwind](https://img.shields.io/badge/Tailwind-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white)](exercicios/tailwind/dicas.md) |
| `diario-de-bordo/` | O que aprendi em cada aula, com linha do tempo | [![Diário de bordo](https://img.shields.io/badge/Di%C3%A1rio_de_bordo-8250df?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/README.md) |
| `docs/` | Guia de estudos com glossário | [![Guia de estudos](https://img.shields.io/badge/Guia_de_estudos-d97706?style=for-the-badge&logo=readthedocs&logoColor=white)](docs/GUIA_DE_ESTUDOS.md) |

## Como rodar

O repositório usa **pnpm**, e cada projeto tem o próprio `package.json` e `node_modules`. Na primeira vez, rode `pnpm install` dentro da pasta de cada projeto que for usar. Escolha um dos jeitos abaixo: o bloco de comandos tem botão de copiar, e o botão verde abre o endereço depois que o servidor subir.

### 1. Tela e API juntas (o jeito do dia a dia)

Sobe a API e o Vite num terminal só. A tela atualiza sozinha quando você salva um arquivo do front.

```bash
cd gerenciador-tarefas/api
pnpm dev:all
```

[![Abrir a tela](https://img.shields.io/badge/abrir_a_tela-localhost:5173-087ea4?style=for-the-badge&logo=react&logoColor=white)](http://localhost:5173) [![Abrir a API](https://img.shields.io/badge/health_da_API-localhost:3000-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](http://localhost:3000/api/health)

### 2. Como em produção (a API entrega a tela)

Um servidor só, na porta 3000, igual ao que vai para a nuvem. Depois de mexer no front, rode o `pnpm build:web` de novo para a mudança aparecer.

```bash
cd gerenciador-tarefas/api
pnpm build:web
pnpm dev
```

[![Abrir a aplicação](https://img.shields.io/badge/abrir_a_aplica%C3%A7%C3%A3o-localhost:3000-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](http://localhost:3000)

### 3. Só a API

Para testar as rotas pelo [requests.http](gerenciador-tarefas/api/requests.http) no VS Code.

```bash
cd gerenciador-tarefas/api
pnpm dev
```

[![Abrir o health](https://img.shields.io/badge/health_da_API-localhost:3000-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](http://localhost:3000/api/health)

### 4. Lista de tarefas simples (`meu-primeiro-app`)

O primeiro projeto React, sem API: os dados ficam só na memória do navegador.

```bash
cd app-react/meu-primeiro-app
pnpm dev
```

[![Abrir a lista](https://img.shields.io/badge/abrir_a_lista-localhost:5173-087ea4?style=for-the-badge&logo=react&logoColor=white)](http://localhost:5173)

### 5. Protótipo e exercícios

Não precisam de servidor: abra o arquivo `.html` direto no navegador.

[![Protótipo](https://img.shields.io/badge/prot%C3%B3tipo-index.html-e34f26?style=for-the-badge&logo=html5&logoColor=white)](gerenciador-tarefas/prototipo-html/index.html) [![Card responsivo](https://img.shields.io/badge/exerc%C3%ADcio-card_responsivo-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white)](exercicios/tailwind/desafio-card-responsivo.html) [![CSS vs Tailwind](https://img.shields.io/badge/exerc%C3%ADcio-CSS_vs_Tailwind-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white)](exercicios/tailwind/css-puro-vs-tailwind.html)

> [!TIP]
> **Banco na nuvem:** sem configurar nada, a API grava num arquivo local (`tarefas.db`). Para gravar no Turso, copie `gerenciador-tarefas/api/.env.example` para `.env` e preencha `TURSO_URL` e `TURSO_TOKEN`. O terminal mostra em qual banco os dados estão indo.
>
> [![Configurar o Turso](https://img.shields.io/badge/passo_a_passo-Turso-4ff8d2?style=for-the-badge&logo=turso&logoColor=white)](gerenciador-tarefas/README.md#banco-em-nuvem-turso)

> [!WARNING]
> **"Porta 3000 já está em uso":** já existe outro servidor rodando, provavelmente esquecido em outro terminal. Feche-o com `Ctrl+C` antes de subir de novo.

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Back-end | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express 5](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![Turso](https://img.shields.io/badge/Turso_(libSQL)-4ff8d2?style=flat-square&logo=turso&logoColor=black) ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) ![bcrypt](https://img.shields.io/badge/bcryptjs-6e7781?style=flat-square) ![CORS](https://img.shields.io/badge/cors-6e7781?style=flat-square) |
| Front-end | ![React 19](https://img.shields.io/badge/React_19-087ea4?style=flat-square&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646cff?style=flat-square&logo=vite&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0ea5e9?style=flat-square&logo=tailwindcss&logoColor=white) |
| Ferramentas | ![pnpm](https://img.shields.io/badge/pnpm-f69220?style=flat-square&logo=pnpm&logoColor=white) ![tsx](https://img.shields.io/badge/tsx-6e7781?style=flat-square) ![ESLint](https://img.shields.io/badge/ESLint-4b32c3?style=flat-square&logo=eslint&logoColor=white) ![oxlint](https://img.shields.io/badge/oxlint-6e7781?style=flat-square) ![REST Client](https://img.shields.io/badge/REST_Client-007acc?style=flat-square) |

## Andamento por aula

Clique na data para abrir o diário daquela aula. Verde = back-end, azul = front-end.

| Aula | Tema | Diário |
| --- | --- | --- |
| 3 e 4 | Layout com Tailwind CSS (desafio do card responsivo) | — |
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
| 10 | Deploy em produção com Render e Docker | ![em breve](https://img.shields.io/badge/em_breve-6e7781?style=for-the-badge) |

Os pontos em aberto e o roadmap do projeto estão no [README do Gerenciador](gerenciador-tarefas/README.md#limitações-atuais).

## Observações do Professor

Espaço reservado para as observações e os ajustes solicitados pelo professor ao longo da disciplina. Nenhuma observação registrada até o momento.

<!-- nav:rodape -->
---

<p align="center">
  <a href="#top"><img src="https://img.shields.io/badge/%E2%AC%86_voltar_ao_topo-6e7781?style=for-the-badge" alt="⬆ voltar ao topo"></a>
  <a href="gerenciador-tarefas/README.md"><img src="https://img.shields.io/badge/pr%C3%B3ximo_%E2%86%92-API_Gerenciador-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="próximo →"></a>
</p>
<!-- /nav:rodape -->
