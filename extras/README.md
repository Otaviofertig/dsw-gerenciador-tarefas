<!-- nav:topo -->
<p align="center">
  <a href="../README.md"><img src="../docs/assets/botoes/incio-06c559.svg" alt="Início"></a>
  <a href="../docs/API.md"><img src="../docs/assets/botoes/api-gerenciador-4e8698.svg" alt="API Gerenciador"></a>
  <a href="../web/README.md"><img src="../docs/assets/botoes/front-react-1df9b7.svg" alt="Front React"></a>
  <a href="../diario-de-bordo/README.md"><img src="../docs/assets/botoes/dirio-de-bordo-b821ca.svg" alt="Diário de bordo"></a>
  <a href="../docs/GUIA_DE_ESTUDOS.md"><img src="../docs/assets/botoes/guia-de-estudos-abf8ad.svg" alt="Guia de estudos"></a>
  <img src="../docs/assets/botoes/voc-est-aqui-extras-b82594.svg" alt="Você está aqui: Extras">
</p>
<!-- /nav:topo -->

<p align="center">
  <img src="../docs/assets/banner-extras.svg" width="100%" alt="Extras: trabalhos de outras aulas">
</p>

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

[![Card responsivo](../docs/assets/botoes/exerccio-card-responsivo-25736d.svg)](tailwind/desafio-card-responsivo.html) [![CSS vs Tailwind](../docs/assets/botoes/exerccio-css-vs-tailwind-c188ee.svg)](tailwind/css-puro-vs-tailwind.html) [![Dicas](../docs/assets/botoes/tabela-css-tailwind-3d98bb.svg)](tailwind/dicas.md)

<!-- nav:rodape -->
---

<p align="center">
  <a href="../docs/GUIA_DE_ESTUDOS.md"><img src="../docs/assets/botoes/anterior-guia-de-estudos-7fb2c4.svg" alt="← anterior"></a>
  <a href="#top"><img src="../docs/assets/botoes/voltar-ao-topo-5af198.svg" alt="⬆ voltar ao topo"></a>
  <a href="../README.md"><img src="../docs/assets/botoes/incio-3f3c4d.svg" alt="início →"></a>
</p>
<!-- /nav:rodape -->
