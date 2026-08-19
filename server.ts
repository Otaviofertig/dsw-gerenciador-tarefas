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
        status TEXT DEFAULT 'pending'
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

// Banco de Dados provisório em RAM
let bancoDeDadosProvisorio = [
    { id: 1, title: "Estudar arquitetura REST", status: "pendente" }
];

// Listar as tarefas (Tasks)
app.get("/api/tasks", (req, res) => {
    res.json(bancoDeDadosProvisorio);
});

// Criar nova tarefa (New Task)
app.post("/api/tasks", (req, res) => {
    const { title } = req.body;
    const novaTarefa = {
        id: Date.now(),
        title,
        status: "pendente"
    };
    bancoDeDadosProvisorio.push(novaTarefa);
    res.status(201).json(novaTarefa);
});

// Deletar tarefa (Delete Task)
app.delete("/api/tasks/:id", (req, res) => {
    const idParaDeletar = parseInt(req.params.id);
    const tarefaExiste = bancoDeDadosProvisorio.some(t => t.id === idParaDeletar);

    if (!tarefaExiste) {
        return res.status(404).json({ message: "Tarefa não existe!" });
    }

    bancoDeDadosProvisorio = bancoDeDadosProvisorio.filter(t => t.id !== idParaDeletar);
    res.json({ message: "Tarefa removida com sucesso!" });
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

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
