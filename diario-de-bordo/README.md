<!-- nav:topo -->
<p align="center">
  <a href="../README.md"><img src="https://img.shields.io/badge/In%C3%ADcio-24292f?style=for-the-badge&logo=github&logoColor=white" alt="Início"></a>
  <a href="../docs/API.md"><img src="https://img.shields.io/badge/API_Gerenciador-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="API Gerenciador"></a>
  <a href="../web/README.md"><img src="https://img.shields.io/badge/Front_React-087ea4?style=for-the-badge&logo=react&logoColor=white" alt="Front React"></a>
  <img src="https://img.shields.io/badge/voc%C3%AA_est%C3%A1_aqui-Di%C3%A1rio_de_bordo-8250df?style=for-the-badge&logo=bookstack&logoColor=white" alt="Você está aqui: Diário de bordo">
  <a href="../docs/GUIA_DE_ESTUDOS.md"><img src="https://img.shields.io/badge/Guia_de_estudos-d97706?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Guia de estudos"></a>
  <a href="../extras/README.md"><img src="https://img.shields.io/badge/Extras-6e7781?style=for-the-badge&logo=files&logoColor=white" alt="Extras"></a>
</p>
<!-- /nav:topo -->

# Diário de bordo

Anotações curtas do que aprendi em cada aula de DSW, escritas com as minhas palavras. Para a explicação completa de cada assunto, veja o [Guia de Estudos](../docs/GUIA_DE_ESTUDOS.md).

**Linha do tempo** (clique para abrir a aula). Dentro de cada aula, os botões do rodapé levam para a anterior e para a próxima, e o botão "ver no projeto" abre a parte do código ou do README que aquela aula construiu.

<p>
  <a href="2026-09-02.md"><img src="https://img.shields.io/badge/02_set-Erros_e_ataques-339933?style=for-the-badge" alt="02 set: Erros e ataques"></a>
  <a href="2026-09-09.md"><img src="https://img.shields.io/badge/09_set-Busca_segura-339933?style=for-the-badge" alt="09 set: Busca segura"></a>
  <a href="2026-09-16.md"><img src="https://img.shields.io/badge/16_set-Rotas_de_escrita-339933?style=for-the-badge" alt="16 set: Rotas de escrita"></a>
  <a href="2026-09-23.md"><img src="https://img.shields.io/badge/23_set-Autentica%C3%A7%C3%A3o-339933?style=for-the-badge" alt="23 set: Autenticação"></a>
  <a href="2026-10-07.md"><img src="https://img.shields.io/badge/07_out-Intro_ao_React-087ea4?style=for-the-badge" alt="07 out: Intro ao React"></a>
  <a href="2026-10-14.md"><img src="https://img.shields.io/badge/14_out-Estado_no_React-087ea4?style=for-the-badge" alt="14 out: Estado no React"></a>
  <a href="2026-10-28.md"><img src="https://img.shields.io/badge/28_out-Laborat%C3%B3rio-087ea4?style=for-the-badge" alt="28 out: Laboratório"></a>
  <a href="2026-11-04.md"><img src="https://img.shields.io/badge/04_nov-Banco_em_nuvem-339933?style=for-the-badge" alt="04 nov: Banco em nuvem"></a>
  <a href="2026-11-11.md"><img src="https://img.shields.io/badge/11_nov-Deploy_no_Render-339933?style=for-the-badge" alt="11 nov: Deploy no Render"></a>
  <a href="2026-11-18.md"><img src="https://img.shields.io/badge/18_nov-Leitura_e_an%C3%A1lise-087ea4?style=for-the-badge" alt="18 nov: Leitura e análise"></a>
</p>

Verde = back-end (API) · azul = front-end (React).

## Índice

### Back-end (API do Gerenciador de Tarefas)

| Data | Tema |
| --- | --- |
| [02/09/2026](2026-09-02.md) | Tratamento de erros e testes de ataque |
| [09/09/2026](2026-09-09.md) | Sanitização da busca e prepared statements |
| [16/09/2026](2026-09-16.md) | Segurança nas rotas de escrita: type guards, allowlists e transações |
| [23/09/2026](2026-09-23.md) | Autenticação: registro, login, bcrypt e JWT |
| [04/11/2026](2026-11-04.md) | Banco de dados em nuvem: Turso, libSQL, `.env` e `db.batch()` |
| [11/11/2026](2026-11-11.md) | Deploy no Render: `render.yaml`, build na nuvem, `/api/db-check` e variáveis de ambiente |

### Front-end (React)

| Data | Tema |
| --- | --- |
| [07/10/2026](2026-10-07.md) | Introdução ao React: componentes, useState, useEffect e CORS |
| [14/10/2026](2026-10-14.md) | Estado e componentes no React: lista de tarefas e formulário controlado |
| [28/10/2026](2026-10-28.md) | Laboratório prático: ajustes com Tailwind, lacunas de lógica e o back servindo o front |
| [18/11/2026](2026-11-18.md) | Leitura, análise e evolução: questionário, caça ao bug, filtro por prioridade e reflexão ENADE |

## Como registrar uma nova aula

1. Copie o [modelo](_modelo.md) para um arquivo com a data da aula no formato `AAAA-MM-DD.md` (ex.: `2026-10-21.md`). Assim os arquivos ficam em ordem cronológica na pasta.
2. Preencha a data, o tema, o módulo e os aprendizados.
3. Ajuste os botões do modelo: "ver no projeto" aponta para a seção que a aula construiu, e o "←" do rodapé aponta para a aula anterior. Na aula anterior, acrescente o botão "→" para a nova.
4. Adicione uma linha na tabela do módulo correspondente e um botão na linha do tempo, aqui no índice. Atualize também o botão "Última aula" do [README principal](../README.md#comece-por-aqui).

<!-- nav:rodape -->
---

<p align="center">
  <a href="../web/README.md"><img src="https://img.shields.io/badge/%E2%86%90_anterior-Front_React-6e7781?style=for-the-badge" alt="← anterior"></a>
  <a href="#top"><img src="https://img.shields.io/badge/%E2%AC%86_voltar_ao_topo-6e7781?style=for-the-badge" alt="⬆ voltar ao topo"></a>
  <a href="../docs/GUIA_DE_ESTUDOS.md"><img src="https://img.shields.io/badge/pr%C3%B3ximo_%E2%86%92-Guia_de_estudos-d97706?style=for-the-badge&logo=readthedocs&logoColor=white" alt="próximo →"></a>
</p>
<!-- /nav:rodape -->
