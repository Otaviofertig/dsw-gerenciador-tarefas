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
| Testar as rotas no VS Code | [![requests.http](https://img.shields.io/badge/requests.http-339933?style=for-the-badge&logo=visualstudiocode&logoColor=white)](gerenciador-tarefas/api/requests.http) |
| Ver as telas em React | [![Front React](https://img.shields.io/badge/Front_React-087ea4?style=for-the-badge&logo=react&logoColor=white)](app-react/README.md) |
| Revisar o que aprendi em cada aula | [![Diário de bordo](https://img.shields.io/badge/Di%C3%A1rio_de_bordo-8250df?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/README.md) |
| Ler a aula mais recente | [![Última aula](https://img.shields.io/badge/%C3%9Altima_aula-04_nov:_Banco_em_nuvem-8250df?style=for-the-badge&logo=bookstack&logoColor=white)](diario-de-bordo/2026-11-04.md) |
| Estudar os conceitos com calma, com glossário | [![Guia de estudos](https://img.shields.io/badge/Guia_de_estudos-d97706?style=for-the-badge&logo=readthedocs&logoColor=white)](docs/GUIA_DE_ESTUDOS.md) |
| Consultar a tabela CSS → Tailwind | [![Tailwind](https://img.shields.io/badge/Tailwind-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white)](exercicios/tailwind/dicas.md) |

## Estrutura de pastas

```
dsw-gerenciador-tarefas/
├── gerenciador-tarefas/       # Projeto principal: organizador de tarefas
│   ├── api/                   #   back-end Express + TypeScript + Turso/libSQL (JWT, bcrypt)
│   └── prototipo-html/        #   tela estática de login e cadastro (Tailwind)
│
├── app-react/                 # Aplicações em React (Vite)
│   ├── meu-primeiro-app/      #   lista de tarefas com componentes e estado (JS)
│   └── web/                   #   front-end React + TS que consome a API
│
├── exercicios/
│   └── tailwind/              # desafio do card responsivo, CSS puro vs. Tailwind e dicas
│
├── diario-de-bordo/           # Uma anotação por aula (AAAA-MM-DD.md) + índice
│
└── docs/
    └── GUIA_DE_ESTUDOS.md     # Resumo consolidado da disciplina, com glossário
```

| Pasta | O que tem | Documentação |
| --- | --- | --- |
| `gerenciador-tarefas/` | API completa (rotas, banco, autenticação), testes `requests.http` e protótipo HTML | [README do Gerenciador](gerenciador-tarefas/README.md) |
| `app-react/` | Os dois projetos React das aulas | [README da Aplicação React](app-react/README.md) |
| `exercicios/tailwind/` | Páginas de prática das aulas 3 e 4 e a [tabela CSS → Tailwind](exercicios/tailwind/dicas.md) | Abrir os `.html` no navegador |
| `diario-de-bordo/` | Aprendizados de cada aula, separados por módulo | [Índice do diário](diario-de-bordo/README.md) |
| `docs/` | Guia de estudos | [GUIA_DE_ESTUDOS.md](docs/GUIA_DE_ESTUDOS.md) |

## Como rodar

O repositório usa **pnpm** em todos os projetos. Cada projeto tem o próprio `package.json`, `pnpm-lock.yaml` e `node_modules`: rode a instalação dentro da pasta desejada.

| Projeto | Comandos | Endereço |
| --- | --- | --- |
| API | `cd gerenciador-tarefas/api && pnpm install && pnpm dev` | http://localhost:3000 |
| React + API (`web`) | `cd app-react/web && pnpm install && pnpm dev` | http://localhost:5173 |
| API + front juntos (1 terminal) | `cd gerenciador-tarefas/api && pnpm dev:all` | http://localhost:5173 (tela) e :3000 (API) |
| Front servido pela API | `cd gerenciador-tarefas/api && pnpm build:web && pnpm dev` | http://localhost:3000 |
| Lista de tarefas React | `cd app-react/meu-primeiro-app && pnpm install && pnpm dev` | http://localhost:5173 |
| Protótipo e exercícios | abrir o arquivo `.html` no navegador | — |

Para gravar os dados no Turso em vez do arquivo local, copie `gerenciador-tarefas/api/.env.example` para `.env` e preencha `TURSO_URL` e `TURSO_TOKEN` (passo a passo no [README do Gerenciador](gerenciador-tarefas/README.md#banco-em-nuvem-turso)).

Para ver o `web` conversando com o back-end, deixe a API rodando em um terminal e o front-end em outro, ou use o `pnpm dev:all`, que sobe os dois juntos. Em `:5173` o Vite lê o código ao vivo; em `:3000` a API entrega o build (`app-react/web/dist`), então depois de mexer no front é preciso rodar `pnpm build:web` de novo.

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Back-end | Node.js, Express 5, TypeScript, tsx, @libsql/client (Turso), bcryptjs, jsonwebtoken, cors |
| Front-end | React 19, Vite, TypeScript, Tailwind CSS |
| Qualidade e testes | ESLint, oxlint, REST Client (VS Code) |

## Andamento por aula

| Aula | Data | Tema | Diário |
| --- | --- | --- | --- |
| 3 e 4 | — | Layout com Tailwind CSS (desafio do card responsivo) | — |
| 5 | 14/08 | Configuração inicial do back-end (Express + TS, rotas de diagnóstico, CRUD em RAM) | — |
| 6 a 9 | até 02/09 | Banco SQLite, testes de ataque e tratamento de erros | [02/09](diario-de-bordo/2026-09-02.md) |
| 10 | — | Validação profunda e escrita segura (POST, PUT, PATCH, DELETE) | — |
| 11 | 09/09 | Sanitização da busca e prepared statements | [09/09](diario-de-bordo/2026-09-09.md) |
| 12 | 16/09 | Type guards, allowlists e transações nas rotas de escrita | [16/09](diario-de-bordo/2026-09-16.md) |
| 13 | 23/09 | Autenticação: registro, login, bcrypt e JWT | [23/09](diario-de-bordo/2026-09-23.md) |
| React 1 | 07/10 | Introdução ao React: componentes, `useState`, `useEffect`, `fetch` e CORS | [07/10](diario-de-bordo/2026-10-07.md) |
| React 2 | 14/10 | Lista de tarefas com estado, formulário controlado e componente `Tarefa` | [14/10](diario-de-bordo/2026-10-14.md) |
| Lab | 28/10 | Laboratório prático: ajustes com Tailwind, lacunas de lógica e o back servindo o front (`express.static` e SPA fallback) | [28/10](diario-de-bordo/2026-10-28.md) |
| 09 | 04/11 | Banco de dados em nuvem: troca do `better-sqlite3` pelo `@libsql/client` (Turso), `.env` com detecção de BOM, `db.batch()` e rotas assíncronas | [04/11](diario-de-bordo/2026-11-04.md) |
| Próxima | — | Deploy em produção com Render e Docker | — |

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
