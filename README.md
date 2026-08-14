# dsw-gerenciador-tarefas

**Estudante:** Otávio Fertig

## Objetivos do projeto

Desenvolver um gerenciador de tarefas completo, multi-usuário persistindo os dados em SQLite

Desasfio Prático: aula 3 e 4 Concluído com sucesso!!!
nesta aula aprendemos mais sobre a utilização do Tailwand na criação de layout o professor passou um boilerplate e seguimos ele com algumas dicas o codigo esta dentro da pasta de Desafios_aula.
o codigo esta dentro da pasta de Desafios_aula

## Aula 5 - Configuração inicial do Back-end

Nesta aula começamos o back-end da aplicação com Node + Express + TypeScript.

* Definição das dependências do projeto (express, tsx, typescript e os @types) no `package.json` e configuração do compilador no `tsconfig.json`.
* `server.ts`: configuração do listen do servidor na porta 3000, rota de fallback `/`, rota de status do servidor (`/api/health`) e rota da versão do sistema (`/api/version`).
* Rotas de tarefas: `GET /api/tasks` (listar), `POST /api/tasks` (criar) e `DELETE /api/tasks/:id` (remover), usando um banco de dados provisório em RAM até chegarmos no SQLite.
* `requests.http`: arquivo para testar os endpoints com a extensão REST Client.

### Como rodar

```bash
npm install
npm run dev
```

### REST Client
Criar um arquivo `.http` ou `.rest` e separar cada requisição com `###`, senão a extensão não identifica os requests.

---
## Observações do Professor

Aqui farei observações, solicitarei ajustes, etc...
