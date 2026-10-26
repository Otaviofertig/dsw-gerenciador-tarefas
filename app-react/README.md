# Aplicação React

Projetos das aulas de React, criados com **Vite**. Cada pasta é um projeto independente, com o próprio `package.json` e `node_modules`.

```
app-react/
├── meu-primeiro-app/      # lista de tarefas em React (JavaScript)
│   └── src/
│       ├── main.jsx       # ponto de entrada
│       ├── App.jsx        # versão atual: lista de tarefas com categoria
│       ├── Tarefa.jsx     # componente de um item da lista
│       ├── Appv1.jsx      # versão anterior: app da lâmpada (useState)
│       └── Botao.jsx      # componente de botão com props (exercício)
└── web/                   # front-end React + TypeScript conectado à API
    └── src/
        ├── main.tsx
        └── App.tsx        # componentes, contador, fetch do health check e lista
```

## meu-primeiro-app: lista de tarefas

Aplicação de tarefas que roda só no navegador (o estado fica na memória, sem API):

- adicionar tarefa com título e categoria (Estudo, Trabalho, Pessoal) por formulário controlado;
- concluir/reabrir e remover tarefas;
- contador de total e de pendentes, com mensagem quando tudo é concluído.

Conceitos praticados: componentes e props, `useState` com atualização imutável (`...spread`, `.map()`, `.filter()`), formulário e `select` controlados, valor derivado e renderização condicional.

```bash
cd app-react/meu-primeiro-app
pnpm install
pnpm dev        # abre em http://localhost:5173
pnpm lint       # oxlint
```

## web: front-end conectado à API

Base do front-end do [Gerenciador de Tarefas](../gerenciador-tarefas/). Hoje mostra um componente de saudação, um contador, uma lista renderizada com `.map()` e o status do servidor, buscado em `GET /api/health` com `useEffect` + `fetch`.

```bash
# 1. em um terminal, suba a API
cd gerenciador-tarefas/api && pnpm dev

# 2. em outro terminal, suba o front-end
cd app-react/web
pnpm install
pnpm dev        # abre em http://localhost:5173
pnpm lint       # eslint
pnpm build      # checa tipos e gera dist/
```

Se a API não estiver rodando, a tela mostra "Erro ao conectar com o servidor". A API já libera o CORS para essa origem.

## Tecnologias

| Tecnologia | Projeto |
| --- | --- |
| React 19 + Vite | ambos |
| JavaScript + oxlint | meu-primeiro-app |
| TypeScript + ESLint | web |
