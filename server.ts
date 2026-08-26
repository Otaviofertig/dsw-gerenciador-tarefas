import express from "express";
import Database from "better-sqlite3";

const app = express();
const PORT = 3000;

// Middleware para ler o corpo das requisições em formato JSON
app.use(express.json());

const db = new Database("tarefas.db")

db.exec(`
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        prioridade TEXT DEFAULT 'medium'
    );

    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        senha TEXT NOT NULL
    );
`)

const usuariosExistentes = db.prepare("SELECT COUNT(*) AS count FROM usuarios").get() as any;
if(usuariosExistentes.count === 0) {
    db.exec(`
        INSERT INTO usuarios (email, senha) VALUES ('otavio@gmail.com', 'senha_super_maluca')
        `);
    }

console.log("Banco de Dados inicializado!!!");

// Listar as tarefas (Tasks)
app.get("/api/tasks", (req, res) => {
    const { search } = req.query;
    try {
        if (search) {
    // Prepared Statement: O '?' protege contra Injeção de SQL.
    const sql = "SELECT * FROM tarefas WHERE titulo LIKE ?";
    const tarefas = db.prepare(sql).all(`%${search}%`);
    res.json(tarefas);
        } else {
            const tarefas = db.prepare("SELECT * FROM tarefas").all();
            res.json(tarefas);
        }
    } catch (erro) {
        // Exibir o erro real ajuda a compreender a quebra de sintaxe gerada pelo ataque
        res.status(500).json({ error: erro instanceof Error ? erro.message : "Erro desconhecido" });
    }
});

// Criar nova tarefa (New Task)
app.post("/api/tasks", (req, res) => {
    const { title, prioridade } = req.body;
    const prioridadeValida = ['low', 'medium', 'high'].includes(prioridade) ? prioridade : 'medium';
    
    // Validação rígida: Título obrigatório, não vazio e com tamanho mínimo
    // Sanitizamos com .trim() ANTES de checar o length, aplicando a regra de negócio
    if (!title || title.trim().length < 3) {
        return res.status(400).json({ 
            error: "O título da tarefa é obrigatório e deve conter pelo menos 3 caracteres válidos." 
        });
    }

    try {
        const sql = "INSERT INTO tarefas (titulo, status, prioridade) VALUES (?, 'pending', ?)";
        const resultado = db.prepare(sql).run(title.trim(), prioridadeValida);
        
        // Retorna o objeto recém-criado usando o ID gerado (lastInsertRowid).
        const novaTarefa = db.prepare("SELECT * FROM tarefas WHERE id = ?").get(resultado.lastInsertRowid);
        return res.status(201).json(novaTarefa);
    } catch (erro) {
        return res.status(500).json({ error: "Erro ao processar persistência" });
    }
});

// Rota para deletar fisicamente uma tarefa do banco
app.delete("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    try {
        const sql = "DELETE FROM tarefas WHERE id = ?";
        const resultado = db.prepare(sql).run(id);
        
        // No SQLite, o sucesso é medido pelo número de 
        // linhas afetadas (changes)
        if (resultado.changes === 0) {
            res.status(404).json(
                { error: "Tarefa não localizada para exclusão." }
            );
            return;
        }
        res.json(
            { message: "Tarefa excluída do banco SQLite com sucesso!" }
        );
    } catch (erro) { 
        res.status(500).json(
        { error: erro instanceof Error ? erro.message : "Erro desconhecido" }
        );
    }
});

// Rota principal de FALLBACK
app.get("/", (req, res) => {
    res.json({ turma: "ADS-2025" });
});

// Rota de integridade do sistema (Health Check)
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Servidor do Gestor de Tarefas ativo!" });
});

// Rota da versão do sistema (Version Check)
app.get("/api/version", (req, res) => {
    res.json({ appName: "Gerenciador de Tarefas Multi-Usuários", version: "1.0.0" });
});

// A Rota PUT atualiza uma tarefa existente no SQLite com validações estritas
app.put("/api/tasks/:id", (req, res) => {
  const idParaAtualizar = parseInt(req.params.id);
  
  // 1. Validação do ID numérico recebido na URL
  if (isNaN(idParaAtualizar)) {
    return res.status(400).json({ error: "ID inválido." });
  }


  const { title, prioridade, status } = req.body;


  // 2. Validação rígida do Título (assim como na Aula 10)
  if (!title || title.trim().length < 3) {
    return res.status(400).json({
      error: "O título da tarefa é obrigatório e deve conter pelo menos 3 caracteres válidos."
    });
  }


  // 3. Sanitização e valores padrão para prioridade e status
  const prioridadeValida = ['low', 'medium', 'high'].includes(prioridade) ? prioridade : 'medium';
  const statusValido = ['pending', 'completed'].includes(status) ? status : 'pending';


  try {
    // 4. Execução do UPDATE utilizando Prepared Statement (?) para segurança
    const sql = "UPDATE tarefas SET titulo = ?, status = ?, prioridade = ? WHERE id = ?";
    const resultado = db.prepare(sql).run(title.trim(), statusValido, prioridadeValida, idParaAtualizar);


    // 5. Verifica se alguma linha foi de fato modificada no banco
    if (resultado.changes === 0) {
      return res.status(404).json({ message: "Tarefa não encontrada para atualização!" });
    }


    // 6. Busca a tarefa recém-atualizada para retornar no corpo da resposta (Princípio REST)
    const tarefaAtualizada = db.prepare("SELECT * FROM tarefas WHERE id = ?").get(idParaAtualizar);
    return res.status(200).json(tarefaAtualizada);


  } catch (erro) {
    return res.status(500).json({ error: "Erro ao processar a atualização no banco de dados." });
  }
});

// A Rota PATCH executa atualizações parciais com validações sob demanda de forma segura e atômica
app.patch("/api/tasks/:id", (req, res) => {
  const idParaAtualizar = parseInt(req.params.id);
  
  if (isNaN(idParaAtualizar)) {
    return res.status(400).json({ error: "ID inválido." });
  }


  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Nenhum campo fornecido para atualização." });
  }

  const { title, prioridade, status } = req.body;

  try {
    // Usamos uma transação para garantir consistência ao buscar e atualizar (evita estado parcial)
    const fluxoAtualizacao = db.transaction(() => {
      // 3. Busca o registro atual no banco para validação cruzada/existência
      const tarefaExistente = db.prepare("SELECT * FROM tarefas WHERE id = ?").get(idParaAtualizar) as any;
      if (!tarefaExistente) return null;

      const camposParaAtualizar: string[] = [];
      const valoresParaAtualizar: any[] = [];

      // 4. Validação condicional: Título (se enviado)
      if (title !== undefined) {
        if (typeof title !== "string" || title.trim().length < 3) {
          throw new Error("O título da tarefa deve conter pelo menos 3 caracteres válidos.");
        }
        camposParaAtualizar.push("titulo = ?");
        valoresParaAtualizar.push(title.trim());
      }

      // 5. Validação condicional: Prioridade (se enviada)
      if (prioridade !== undefined) {
        if (!['low', 'medium', 'high'].includes(prioridade)) {
          throw new Error("Prioridade inválida. Use 'low', 'medium' ou 'high'.");
        }
        camposParaAtualizar.push("prioridade = ?");
        valoresParaAtualizar.push(prioridade);
      }

      // 6. Validação condicional: Status (se enviado)
      if (status !== undefined) {
        if (!['pending', 'completed'].includes(status)) {
          throw new Error("Status inválido. Use 'pending' ou 'completed'.");
        }
        camposParaAtualizar.push("status = ?");
        valoresParaAtualizar.push(status);
      }

      if (camposParaAtualizar.length === 0) return tarefaExistente;

      // 7. Montagem segura da query dinâmica com Prepared Statements
      const sql = `UPDATE tarefas SET ${camposParaAtualizar.join(", ")} WHERE id = ?`;
      valoresParaAtualizar.push(idParaAtualizar);

      db.prepare(sql).run(...valoresParaAtualizar);
      return db.prepare("SELECT * FROM tarefas WHERE id = ?").get(idParaAtualizar);
    });

    const resultado = fluxoAtualizacao();

    if (!resultado) {
      return res.status(404).json({ message: "Tarefa não encontrada para atualização parcial!" });
    }

    return res.status(200).json(resultado);

  } catch (erro) {
    if (erro instanceof Error && 
       (erro.message.includes("inválid") || erro.message.includes("caracteres"))) {
      return res.status(400).json({ error: erro.message });
    }
    return res.status(500).json({ error: "Erro ao processar a atualização parcial no banco." });
  }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
