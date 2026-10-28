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
        ├── App.tsx        # decide entre a tela de login e a lista de tarefas
        ├── Login.tsx      # login e registro (um componente, dois modos)
        ├── Tarefas.tsx    # lista, criação, conclusão, exclusão e busca de tarefas
        ├── api.ts         # único lugar que conhece o endereço da API e o token JWT
        └── index.css      # entrada do Tailwind CSS (tema escuro)
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

Front-end do [Gerenciador de Tarefas](../gerenciador-tarefas/), feito com React, TypeScript e Tailwind CSS. Tem tela de login e registro, e a lista de tarefas do usuário logado, com criação, conclusão, exclusão e busca. O token JWT fica no `localStorage` e é enviado em `Authorization: Bearer <token>`.

Em desenvolvimento (`pnpm dev`) o `api.ts` fala com `http://localhost:3000`. Depois do `pnpm build`, o `api.ts` usa caminhos relativos, e a própria API entrega o `dist/` (veja o [README do Gerenciador](../gerenciador-tarefas/README.md)).

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

Se a API não estiver rodando, a tela mostra o erro de conexão. A API libera o CORS para essa origem, necessário só no desenvolvimento, quando tela (`:5173`) e API (`:3000`) são origens diferentes.

## Tecnologias

| Tecnologia | Projeto |
| --- | --- |
| React 19 + Vite | ambos |
| JavaScript + oxlint | meu-primeiro-app |
| TypeScript + ESLint | web |
