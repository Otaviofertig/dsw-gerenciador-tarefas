<!-- nav:topo -->
<p align="center">
  <a href="../README.md"><img src="https://img.shields.io/badge/In%C3%ADcio-24292f?style=for-the-badge&logo=github&logoColor=white" alt="Início"></a>
  <a href="../docs/API.md"><img src="https://img.shields.io/badge/API_Gerenciador-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="API Gerenciador"></a>
  <a href="../web/README.md"><img src="https://img.shields.io/badge/Front_React-087ea4?style=for-the-badge&logo=react&logoColor=white" alt="Front React"></a>
  <a href="../diario-de-bordo/README.md"><img src="https://img.shields.io/badge/Di%C3%A1rio_de_bordo-8250df?style=for-the-badge&logo=bookstack&logoColor=white" alt="Diário de bordo"></a>
  <a href="../docs/GUIA_DE_ESTUDOS.md"><img src="https://img.shields.io/badge/Guia_de_estudos-d97706?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Guia de estudos"></a>
  <img src="https://img.shields.io/badge/voc%C3%AA_est%C3%A1_aqui-Extras-6e7781?style=for-the-badge&logo=files&logoColor=white" alt="Você está aqui: Extras">
</p>
<!-- /nav:topo -->

# Extras: trabalhos de outras aulas

Atividades da disciplina que não fazem parte do Gerenciador de Tarefas. Ficam aqui, separadas, para a raiz do repositório ter só o projeto principal.

| Pasta | O que é | Aula |
| --- | --- | --- |
| [`meu-primeiro-app/`](meu-primeiro-app/) | primeira lista de tarefas em React, sem API | React 1 e 2 (07/10 e 14/10) |
| [`tailwind/`](tailwind/dicas.md) | desafio do card responsivo, comparação CSS × Tailwind e tabela de dicas | 3 e 4 |

## meu-primeiro-app: lista de tarefas

Aplicação de tarefas que roda só no navegador (os dados ficam na memória, sem API):

- adicionar tarefa com título e categoria (Estudo, Trabalho, Pessoal);
- concluir, reabrir e remover tarefas;
- contador de total e de pendentes, com mensagem quando tudo é concluído.

Conceitos praticados: componentes e props, `useState` com atualização imutável (`...spread`, `.map()`, `.filter()`), formulário e `select` controlados, valor derivado e renderização condicional.

```bash
cd extras/meu-primeiro-app
npm install
npm run dev     # abre em http://localhost:5173
npm run lint    # oxlint
```

## Tailwind

Não precisam de servidor: abra o arquivo `.html` direto no navegador.

[![Card responsivo](https://img.shields.io/badge/exerc%C3%ADcio-card_responsivo-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white)](tailwind/desafio-card-responsivo.html) [![CSS vs Tailwind](https://img.shields.io/badge/exerc%C3%ADcio-CSS_vs_Tailwind-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white)](tailwind/css-puro-vs-tailwind.html) [![Dicas](https://img.shields.io/badge/tabela-CSS_%E2%86%92_Tailwind-0ea5e9?style=for-the-badge&logo=tailwindcss&logoColor=white)](tailwind/dicas.md)

<!-- nav:rodape -->
---

<p align="center">
  <a href="../docs/GUIA_DE_ESTUDOS.md"><img src="https://img.shields.io/badge/%E2%86%90_anterior-Guia_de_estudos-6e7781?style=for-the-badge" alt="← anterior"></a>
  <a href="#top"><img src="https://img.shields.io/badge/%E2%AC%86_voltar_ao_topo-6e7781?style=for-the-badge" alt="⬆ voltar ao topo"></a>
  <a href="../README.md"><img src="https://img.shields.io/badge/in%C3%ADcio_%E2%86%92-24292f?style=for-the-badge&logo=github&logoColor=white" alt="início →"></a>
</p>
<!-- /nav:rodape -->
