<!-- nav:topo -->
<p align="center">
  <a href="../README.md"><img src="https://img.shields.io/badge/In%C3%ADcio-24292f?style=for-the-badge&logo=github&logoColor=white" alt="Início"></a>
  <a href="../docs/API.md"><img src="https://img.shields.io/badge/API_Gerenciador-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="API Gerenciador"></a>
  <img src="https://img.shields.io/badge/voc%C3%AA_est%C3%A1_aqui-Front_React-087ea4?style=for-the-badge&logo=react&logoColor=white" alt="Você está aqui: Front React">
  <a href="../diario-de-bordo/README.md"><img src="https://img.shields.io/badge/Di%C3%A1rio_de_bordo-8250df?style=for-the-badge&logo=bookstack&logoColor=white" alt="Diário de bordo"></a>
  <a href="../docs/GUIA_DE_ESTUDOS.md"><img src="https://img.shields.io/badge/Guia_de_estudos-d97706?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Guia de estudos"></a>
  <a href="../extras/README.md"><img src="https://img.shields.io/badge/Extras-6e7781?style=for-the-badge&logo=files&logoColor=white" alt="Extras"></a>
</p>
<!-- /nav:topo -->

<p align="center">
  <img src="../docs/assets/banner-web.svg" width="100%" alt="Front-end em React: React 19, Vite, TypeScript e Tailwind CSS">
</p>

# Front-end (React)

A tela do Gerenciador de Tarefas, feita com **React + TypeScript + Tailwind CSS** e criada com **Vite**. Ela tem a tela de login e cadastro e a lista de tarefas de quem está logado: criar, concluir, excluir, buscar por título e filtrar por prioridade. Toda conversa com o servidor passa pela [API do Gerenciador](../docs/API.md#endpoints).

**Aulas que construíram estas telas** (clique para abrir o diário):

<p>
  <a href="../diario-de-bordo/2026-10-07.md"><img src="https://img.shields.io/badge/07_out-Intro_ao_React-8250df?style=for-the-badge" alt="07 out: Intro ao React"></a>
  <a href="../diario-de-bordo/2026-10-14.md"><img src="https://img.shields.io/badge/14_out-Estado_no_React-8250df?style=for-the-badge" alt="14 out: Estado no React"></a>
  <a href="../diario-de-bordo/2026-10-28.md"><img src="https://img.shields.io/badge/28_out-Laborat%C3%B3rio-8250df?style=for-the-badge" alt="28 out: Laboratório"></a>
  <a href="../diario-de-bordo/2026-11-18.md"><img src="https://img.shields.io/badge/18_nov-Leitura_e_an%C3%A1lise-8250df?style=for-the-badge" alt="18 nov: Leitura e análise"></a>
</p>

## Arquivos

```
web/
├── index.html
├── vite.config.ts      # Vite com os plugins do React e do Tailwind
└── src/
    ├── main.tsx        # ponto de entrada
    ├── App.tsx         # decide entre a tela de login e a lista de tarefas
    ├── Login.tsx       # login e cadastro (um componente, dois modos)
    ├── Tarefas.tsx     # lista, criação, conclusão, exclusão, busca e filtro por prioridade
    ├── Icones.tsx      # ícones em SVG (livro, lupa, check)
    ├── api.ts          # único lugar que conhece o endereço da API e o token JWT
    └── index.css       # Tailwind e o tema de caderno (papel, capa, fontes)
```

## Como funciona

```mermaid
flowchart TD
    main["main.tsx"] --> App["App.tsx<br/><i>dono do usuário logado</i>"]
    App -->|sem usuário| Login["Login.tsx<br/><i>entrar ou criar conta</i>"]
    App -->|com usuário| Tarefas["Tarefas.tsx<br/><i>lista, busca, filtro</i>"]
    Login --> api["api.ts<br/><i>único lugar que fala com a API</i>"]
    Tarefas --> api
    App --> api
    api -->|fetch + Bearer token| API[("API · server.ts")]

    classDef tela fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e
    classDef util fill:#f3e8ff,stroke:#7c3aed,color:#3b0764
    classDef back fill:#dcfce7,stroke:#16a34a,color:#14532d
    class main,App,Login,Tarefas tela
    class api util
    class API back
```

- **Login:** o token JWT que a API devolve fica guardado no navegador (`localStorage`) e vai junto em todo pedido, no cabeçalho `Authorization: Bearer <token>`.
- **Busca:** só vai até a API quando a pessoa para de digitar por 400 ms (debounce), para não fazer um pedido a cada letra.
- **Filtro por prioridade:** é feito na própria tela, sem chamar a API, em cima da lista que já chegou.
- **Endereço da API:** enquanto programo (`npm run dev:all`), a tela fica em `localhost:5173` e chama a API em `localhost:3000`. Depois do build, a própria API entrega a tela, e os pedidos usam o mesmo endereço do site, sem precisar de CORS.

## Como rodar

O jeito mais simples é pela raiz do projeto, que sobe a API e a tela juntas:

```bash
npm install
npm run dev:all     # tela em http://localhost:5173
```

Só a tela, a partir desta pasta (a API precisa estar ligada em outro terminal):

```bash
cd web
npm install
npm run dev         # http://localhost:5173
npm run lint        # ESLint
npm run build       # confere os tipos e gera dist/
```

Se a API não estiver ligada, a tela mostra o erro de conexão.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| React 19 + Vite | componentes, estado e servidor de desenvolvimento |
| TypeScript | tipos da API (`Tarefa`, `Usuario`) e das telas |
| Tailwind CSS 4 | visual, com o tema de caderno definido no `index.css` |
| ESLint | regras de qualidade, incluindo as regras dos hooks do React |

<!-- nav:rodape -->
---

<p align="center">
  <a href="../docs/API.md"><img src="https://img.shields.io/badge/%E2%86%90_anterior-API_Gerenciador-6e7781?style=for-the-badge" alt="← anterior"></a>
  <a href="#top"><img src="https://img.shields.io/badge/%E2%AC%86_voltar_ao_topo-6e7781?style=for-the-badge" alt="⬆ voltar ao topo"></a>
  <a href="../diario-de-bordo/README.md"><img src="https://img.shields.io/badge/pr%C3%B3ximo_%E2%86%92-Di%C3%A1rio_de_bordo-8250df?style=for-the-badge&logo=bookstack&logoColor=white" alt="próximo →"></a>
</p>
<!-- /nav:rodape -->
