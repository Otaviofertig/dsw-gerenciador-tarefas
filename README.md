# DSW: Gerenciador de Tarefas

**Estudante:** Otávio Fertig
**Disciplina:** DSW — Desenvolvimento de Sistemas Web (turma ADS-2025)

Repositório da disciplina de DSW. Reúne o projeto principal (um **gerenciador de tarefas** com API em Node.js + SQLite), as **aplicações em React** feitas nas aulas de front-end, os exercícios de Tailwind CSS e o diário de bordo com o que aprendi em cada aula.

## Estrutura de pastas

```
dsw-gerenciador-tarefas/
├── gerenciador-tarefas/       # Projeto principal: organizador de tarefas
│   ├── api/                   #   back-end Express + TypeScript + SQLite (JWT, bcrypt)
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
| Lista de tarefas React | `cd app-react/meu-primeiro-app && pnpm install && pnpm dev` | http://localhost:5173 |
| Protótipo e exercícios | abrir o arquivo `.html` no navegador | — |

Para ver o `web` conversando com o back-end, deixe a API rodando em um terminal e o front-end em outro.

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Back-end | Node.js, Express 5, TypeScript, tsx, better-sqlite3, bcryptjs, jsonwebtoken, cors |
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
| Próxima | — | Middleware de autorização (`Authorization: Bearer <token>`) | — |

Os pontos em aberto e o roadmap do projeto estão no [README do Gerenciador](gerenciador-tarefas/README.md#limitações-atuais).

## Observações do Professor

Espaço reservado para as observações e os ajustes solicitados pelo professor ao longo da disciplina. Nenhuma observação registrada até o momento.
