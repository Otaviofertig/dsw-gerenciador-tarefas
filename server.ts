import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from 'cors';
import express, { type Request, type Response, type NextFunction } from "express";
// LACUNA 1 (Aula 09): o better-sqlite3 só sabe ler um arquivo do disco, e de
// forma síncrona. O @libsql/client fala com o Turso pela internet (HTTP) e,
// sem credenciais, também abre um arquivo local com "file:".
import { createClient, type InValue, type Row } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
app.use(cors()); // Libera o CORS para todas as rotas
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super_secreto_desenvolvimento";

// O projeto usa "type": "module" no package.json, ou seja, roda como ESM.
// Nesse modo não existe a variável __dirname que o Node antigo oferecia: o
// caminho do arquivo atual precisa ser reconstruído a partir de
// import.meta.url, e é o que o fileURLToPath faz por nós.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Pasta do projeto React: a pasta web/, ao lado deste server.ts.
 */
const FRONT_DIR = path.join(__dirname, "web");

/** Pasta que o `npm run build:web` (Vite) cria dentro do projeto React. */
const FRONT_DIST = path.join(FRONT_DIR, "dist");

/** O arquivo de entrada que o SPA fallback entrega. */
const FRONT_INDEX = path.join(FRONT_DIST, "index.html");

/**
 * Resposta que aparece quando alguém abre a página e a pasta web/dist ainda
 * não existe. Um erro de "Cannot GET /" não ajuda ninguém a descobrir que
 * faltou um `npm run build`, então a mensagem diz exatamente o que fazer.
 */
const SEM_BUILD = [
    "Ainda não existe o build do front-end.",
    "",
    "Procurei este arquivo:",
    `  ${FRONT_INDEX}`,
    "",
    "Gere-o com (na pasta do projeto):",
    "  npm run build",
    "",
    "Esse comando já instala as dependências do front (web/) e gera o build.",
    "",
    "Enquanto isso, a API continua funcionando em /api/health.",
].join("\n");

/**
 * Devolve a data de modificação mais recente de uma pasta, olhando dentro das
 * subpastas também. Serve para comparar os fontes do front com o build.
 */
function maisRecente(dir: string): number {
    let maior = 0;

    for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
        const caminho = path.join(dir, entrada.name);

        if (entrada.isDirectory()) {
            maior = Math.max(maior, maisRecente(caminho));
        } else {
            maior = Math.max(maior, fs.statSync(caminho).mtimeMs);
        }
    }

    return maior;
}

// 1. Criamos um "molde" (Interface) para nossas tarefas.
// Na Aula 09 as tabelas ganharam colunas de data e a senha virou senha_hash.
interface Tarefa {
    id: number;
    usuario_id: number;
    titulo: string;
    descricao: string | null;
    status: "pending" | "completed";
    prioridade: "low" | "medium" | "high";
    criado_em: string;
    atualizado_em: string;
}

interface Usuario {
    id: number;
    email: string;
    senha_hash: string;
    criado_em: string;
}

interface AuthRequest extends Request {
    usuarioId?: number; // Injetaremos o ID aqui após validar o token
}

// 2. Centralizamos as regras. Se a regra mudar, mudamos em um só lugar!
const PRIORIDADES = ["low", "medium", "high"] as const;
const STATUS_VALIDOS = ["pending", "completed"] as const;

// 3. Funções ajudantes (Helpers). Escrevemos a validação uma vez e usamos em todo lugar.
const tituloValido = (t: unknown): t is string =>
    typeof t === "string" && t.trim().length >= 3;

const normalizarPrioridade = (p: unknown) => {
    const listaPrioridades = PRIORIDADES as readonly string[];

    return typeof p === "string" && listaPrioridades.includes(p)
        ? p
        : "medium";
};

const normalizarStatus = (s: unknown) => {
    const listaStatus = STATUS_VALIDOS as readonly string[];

    return typeof s === "string" && listaStatus.includes(s)
        ? s
        : "pending";
};

// 4. Um ajudante só para transformar e validar IDs
const parsearId = (idParam: string): number | null => {
    const id = Number(idParam);
    // Number("12abc") vira NaN imediatamente, o que é mais seguro!
    return isNaN(id) ? null : id;
};

// Middleware para ler o corpo das requisições em formato JSON
app.use(express.json());

// ============================================================================
// LACUNA 2: leitura do .env com detecção de BOM
// ============================================================================
// O .env fica ao lado deste arquivo (.env, na raiz do projeto) e NUNCA vai
// para o Git: o .gitignore da raiz já ignora ".env".
const ARQUIVO_ENV = path.join(__dirname, ".env");

/**
 * Carrega o .env com uma checagem defensiva contra o BOM do Windows.
 *
 * O Bloco de Notas e o PowerShell antigo salvam UTF-8 com três bytes
 * invisíveis no começo (0xEF 0xBB 0xBF). Aí a primeira chave vira
 * "﻿TURSO_URL", a TURSO_URL "some" sem erro nenhum e o servidor volta
 * para o arquivo local. Em vez de torcer, olhamos os primeiros bytes.
 */
function carregarEnv(): void {
    if (!fs.existsSync(ARQUIVO_ENV)) return;

    const bruto = fs.readFileSync(ARQUIVO_ENV);
    if (bruto.length >= 3 && bruto[0] === 0xef && bruto[1] === 0xbb && bruto[2] === 0xbf) {
        console.warn(
            "\n[ATENÇÃO] O seu .env foi salvo COM BOM (marca de bytes 0xEF 0xBB 0xBF).\n" +
            "          Consequência: a PRIMEIRA variável do arquivo é ignorada sem erro.\n" +
            "          Salve de novo em UTF-8 SEM BOM e confira se a primeira\n" +
            "          variável é mesmo a TURSO_URL.\n",
        );
    }

    // O que já estiver no ambiente do sistema (ex.: variáveis do Render ou de
    // um container Docker) tem prioridade sobre o arquivo.
    process.loadEnvFile(ARQUIVO_ENV);
}

carregarEnv();

// ============================================================================
// LACUNA 3: de onde vêm os dados? Nuvem (Turso) ou arquivo local
// ============================================================================
const TURSO_URL = process.env.TURSO_URL;
const TURSO_TOKEN = process.env.TURSO_TOKEN;

// Só vamos para a nuvem com as DUAS informações. Faltou uma, usamos o arquivo.
const usandoNuvem = Boolean(TURSO_URL && TURSO_TOKEN);
const MODO_BANCO = usandoNuvem ? "Turso / libSQL (nuvem)" : "arquivo local (SQLite)";

// ============================================================================
// LACUNA 4: o cliente do banco
// ============================================================================
// Mesmo pacote, dois destinos: "libsql://..." vai pela internet até o Turso;
// "file:./tarefas.db" abre um arquivo na pasta em que o servidor foi iniciado
// (aqui, a raiz do projeto), útil sem internet ou sem conta no Turso.
const db = createClient({
    url: usandoNuvem ? TURSO_URL! : "file:./tarefas.db",
    authToken: usandoNuvem ? TURSO_TOKEN : undefined,
});

// ============================================================================
// LACUNA 5: banner que diz, sem adivinhação, onde os dados estão sendo gravados
// ============================================================================
function exibirBannerBanco(): void {
    console.log("============================================================");
    console.log("  Banco de dados");
    console.log("------------------------------------------------------------");
    console.log(`  Modo  : ${MODO_BANCO}`);
    console.log(`  Onde  : ${usandoNuvem ? TURSO_URL : path.resolve("tarefas.db")}`);
    // O token é uma senha: dizemos se ele existe, mas nunca o imprimimos.
    console.log(`  Token : ${usandoNuvem ? "presente (nunca será mostrado)" : "não informado"}`);
    if (!usandoNuvem) {
        console.log("  Para usar o Turso, crie o arquivo .env na raiz do projeto com:");
        console.log("    TURSO_URL=libsql://seu-banco.turso.io");
        console.log("    TURSO_TOKEN=seu-token");
    }
    console.log("============================================================");
}

// ============================================================================
// LACUNA 6: o SQL de criação das tabelas, um comando por constante
// ============================================================================
const SQL_USUARIOS = `
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        senha_hash TEXT NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`;

const SQL_TAREFAS = `
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        titulo TEXT NOT NULL,
        descricao TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        prioridade TEXT NOT NULL DEFAULT 'medium',
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
    );
`;

// ============================================================================
// LACUNA 7: preparar o banco antes de abrir as portas
// ============================================================================
async function inicializarBanco(): Promise<void> {
    try {
        // No better-sqlite3, um db.exec("a; b;") rodava os dois comandos.
        // No libSQL, um execute() com dois comandos roda só o PRIMEIRO e ignora
        // o resto em silêncio: a tabela tarefas nunca nasceria. O batch manda
        // cada comando separado e é atômico: falhou um, nada fica pela metade.
        await db.batch([SQL_USUARIOS, SQL_TAREFAS], "write");

        // Bancos criados antes da Aula 09 não têm a coluna atualizado_em.
        try {
            await db.execute(
                "ALTER TABLE tarefas ADD COLUMN atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP",
            );
        } catch (alterErro: unknown) {
            const mensagem = alterErro instanceof Error ? alterErro.message : String(alterErro);
            if (!mensagem.includes("duplicate column")) {
                console.warn("  Não foi possível adicionar a coluna atualizado_em:", mensagem);
            }
            // "duplicate column" = a coluna já existe, que é o caso normal.
        }

        // Usuário semente para facilitar o login no laboratório
        const adminEmail = "admin@senai.com";
        const { rows } = await db.execute({
            sql: "SELECT id FROM usuarios WHERE email = ?",
            args: [adminEmail],
        });

        if (rows.length === 0) {
            const hash = await bcrypt.hash("123456", 10);
            await db.execute({
                sql: "INSERT INTO usuarios (email, senha_hash) VALUES (?, ?)",
                args: [adminEmail, hash],
            });
        }
    } catch (erro: unknown) {
        const e = erro as { code?: string; message?: string };
        console.error("\n[ERRO] Não consegui preparar o banco de dados.");
        console.error(`  Modo   : ${MODO_BANCO}`);
        console.error(`  Onde   : ${usandoNuvem ? TURSO_URL : path.resolve("tarefas.db")}`);
        console.error(`  Código : ${e?.code || "DESCONHECIDO"}`);
        console.error(`  Detalhe: ${e?.message}`);
        if (usandoNuvem) {
            console.error("  O Turso devolve HTTP 404 tanto para URL errada quanto para token errado.");
            console.error("  Confira se a TURSO_URL não tem barra no final e se o TURSO_TOKEN está completo.\n");
        }
        process.exit(1);
    }
}

// ============================================================================
// LACUNA 8: helpers de consulta, agora assíncronos
// ============================================================================
// Antes: db.prepare(sql) uma vez no topo e stmt.get()/all()/run() nas rotas.
// Agora: await db.execute({ sql, args }). Com o banco do outro lado da
// internet, o que custa é a viagem pela rede, não compilar o SQL.
// O que NÃO muda: os valores vão sempre nos "?" + args, nunca colados no SQL.

/** O libSQL devolve linhas genéricas (Row); aqui damos a elas o tipo certo. */
function primeiraLinha<T>(rows: Row[]): T | undefined {
    return rows[0] as unknown as T | undefined;
}

const buscarUsuarioPorEmail = (email: string) =>
    db.execute({ sql: "SELECT * FROM usuarios WHERE email = ?", args: [email] });

const buscarUsuarioPorId = (id: number) =>
    db.execute({ sql: "SELECT id, email, criado_em FROM usuarios WHERE id = ?", args: [id] });

const inserirUsuario = (email: string, senhaHash: string) =>
    db.execute({
        sql: "INSERT INTO usuarios (email, senha_hash) VALUES (?, ?)",
        args: [email, senhaHash],
    });

const listarTarefasDoUsuario = (usuarioId: number, search?: string) => {
    if (search) {
        // O '%' entra DEPOIS, apenas dentro do parâmetro
        return db.execute({
            sql: `SELECT * FROM tarefas
                  WHERE usuario_id = ? AND (titulo LIKE ? OR descricao LIKE ?)
                  ORDER BY id DESC`,
            args: [usuarioId, `%${search}%`, `%${search}%`],
        });
    }
    return db.execute({
        sql: "SELECT * FROM tarefas WHERE usuario_id = ? ORDER BY id DESC",
        args: [usuarioId],
    });
};

const buscarTarefaPorIdEUsuario = (id: number, usuarioId: number) =>
    db.execute({
        sql: "SELECT * FROM tarefas WHERE id = ? AND usuario_id = ?",
        args: [id, usuarioId],
    });

const deletarTarefaPorIdEUsuario = (id: number, usuarioId: number) =>
    db.execute({
        sql: "DELETE FROM tarefas WHERE id = ? AND usuario_id = ?",
        args: [id, usuarioId],
    });

// Middleware de Autenticação
const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token ausente ou mal formatado." });
    }

    const token = header.split(" ")[1]; // Pega só o token após a palavra 'Bearer'

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { id: number };
        req.usuarioId = payload.id; // Injeta o id no req para a rota usar
        next(); // Tudo certo! Segue para a rota.
    } catch {
        return res.status(401).json({ error: "Token inválido ou expirado." });
    }
};

// ============================================================================
// LACUNA 9: health, register e login assíncronos
// ============================================================================

// Health check ATIVO: além de dizer que o Node está vivo, pergunta ao banco.
// O processo pode estar de pé enquanto o Turso está fora do ar.
app.get("/api/health", async (_req: Request, res: Response) => {
    try {
        await db.execute("SELECT 1");
        return res.json({
            status: "ok",
            message: "Servidor do Gestor de Tarefas ativo!",
            banco: MODO_BANCO,
        });
    } catch {
        return res.status(503).json({
            status: "erro",
            message: "O servidor está no ar, mas o banco de dados não respondeu.",
            banco: MODO_BANCO,
        });
    }
});

app.get("/api/version", (_req, res) => {
    res.json({ appName: "Gerenciador de Tarefas Multi-Usuário", version: "1.0.0" });
});

// O front (web/src/api.ts) envia { email, senha }.
app.post("/api/auth/register", async (req: Request, res: Response) => {
    const { email, senha } = req.body ?? {};

    // Validação inicial dos dados
    if (typeof email !== "string" || typeof senha !== "string") {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    if (senha.trim().length < 6) {
        return res.status(400).json({ error: "A senha deve ter ao menos 6 caracteres." });
    }

    try {
        // Criando a "impressão digital" da senha
        const hash = await bcrypt.hash(senha, 10);
        const resultado = await inserirUsuario(email.trim(), hash);

        // lastInsertRowid vem como bigint no libSQL; Number() converte.
        const { rows } = await buscarUsuarioPorId(Number(resultado.lastInsertRowid));
        const usuario = primeiraLinha<Usuario>(rows)!;

        return res.status(201).json({ id: usuario.id, email: usuario.email });
    } catch (erro: unknown) {
        // 409 só para o conflito de verdade: e-mail repetido (UNIQUE).
        // Antes, QUALQUER erro virava 409, inclusive o banco fora do ar.
        // O libSQL põe "SQLITE_CONSTRAINT" em erro.code (o detalhe UNIQUE fica
        // em erro.extendedCode); o startsWith aceita as duas formas.
        const codigo = String((erro as { code?: string })?.code);
        if (codigo.startsWith("SQLITE_CONSTRAINT")) {
            return res.status(409).json({ error: "E-mail já cadastrado." });
        }
        return res.status(500).json({ error: "Não foi possível cadastrar agora. Tente de novo." });
    }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, senha } = req.body ?? {};

    if (typeof email !== "string" || typeof senha !== "string") {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    // Banco fora do ar é 500, e NÃO "credenciais inválidas": senão o usuário
    // acharia que errou a senha quando o problema é a rede.
    let usuario: Usuario | undefined;
    try {
        const { rows } = await buscarUsuarioPorEmail(email.trim());
        usuario = primeiraLinha<Usuario>(rows);
    } catch {
        return res.status(500).json({ error: "Não foi possível entrar agora. Tente de novo." });
    }

    // Compara SEMPRE com um hash (mesmo se o usuário não existir) para a
    // resposta demorar o mesmo tempo e não revelar quais e-mails existem.
    const hashEsperado = usuario?.senha_hash ?? "$2a$10$fakehashparanaquebrarcomparacao";
    const senhaOk = await bcrypt.compare(senha, hashEsperado);

    if (!usuario || !senhaOk) {
        return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Gerando o "Crachá" de acesso
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, {
        expiresIn: "8h",
    });

    return res.json({ token });
});

// Rotas de tarefas: as mesmas regras de antes, agora com await.
app.get("/api/tasks", authenticate, async (req: AuthRequest, res) => {
    const usuarioId = req.usuarioId!; // Garantimos que existe pois o middleware já checou
    // Coerção Segura: forçamos uma String vazia caso tentem nos enviar um Array
    const search = typeof req.query.search === "string" ? req.query.search : "";

    try {
        const { rows } = await listarTarefasDoUsuario(usuarioId, search || undefined);
        return res.json(rows);
    } catch {
        // Erro Controlado: mensagem genérica para não vazar a estrutura do banco
        return res.status(500).json({ error: "Erro interno ao processar a listagem." });
    }
});

app.post("/api/tasks", authenticate, async (req: AuthRequest, res) => {
    const usuarioId = req.usuarioId!;
    const { titulo, prioridade } = req.body ?? {};
    const prioridadeValida = normalizarPrioridade(prioridade);

    // Validação via helper (type guard)
    if (!tituloValido(titulo)) {
        return res.status(400).json({
            error: "O título da tarefa é obrigatório e deve conter pelo menos 3 caracteres válidos."
        });
    }

    try {
        const resultado = await db.execute({
            sql: "INSERT INTO tarefas (titulo, status, prioridade, usuario_id) VALUES (?, 'pending', ?, ?)",
            args: [titulo.trim(), prioridadeValida, usuarioId],
        });
        const { rows } = await buscarTarefaPorIdEUsuario(Number(resultado.lastInsertRowid), usuarioId);

        return res.status(201).json(primeiraLinha<Tarefa>(rows));
    } catch {
        return res.status(500).json({ error: "Erro ao processar persistência" });
    }
});

app.delete("/api/tasks/:id", authenticate, async (req: AuthRequest, res) => {
    const usuarioId = req.usuarioId!;
    // Validação de ID padronizada (igual PUT/PATCH)
    const idParaDeletar = parsearId(String(req.params.id));

    if (idParaDeletar === null) {
        return res.status(400).json({ error: "ID inválido." });
    }

    try {
        const resultado = await deletarTarefaPorIdEUsuario(idParaDeletar, usuarioId);

        // better-sqlite3: resultado.changes  ->  libSQL: resultado.rowsAffected
        if (resultado.rowsAffected === 0) {
            return res.status(404).json({ error: "Tarefa não localizada para exclusão." });
        }

        return res.json({ message: "Tarefa excluída com sucesso!" });
    } catch {
        return res.status(500).json({ error: "Erro interno ao processar a exclusão." });
    }
});

app.put("/api/tasks/:id", authenticate, async (req: AuthRequest, res) => {
    const usuarioId = req.usuarioId!;
    const idParaAtualizar = parsearId(String(req.params.id));

    if (idParaAtualizar === null) {
        return res.status(400).json({ error: "ID inválido." });
    }

    const { titulo, prioridade, status } = req.body ?? {};

    // Validação via helpers
    if (!tituloValido(titulo)) {
        return res.status(400).json({
            error: "O título da tarefa é obrigatório e deve conter pelo menos 3 caracteres válidos."
        });
    }

    const prioridadeValida = normalizarPrioridade(prioridade);
    const statusValido = normalizarStatus(status);

    try {
        const resultado = await db.execute({
            sql: "UPDATE tarefas SET titulo = ?, status = ?, prioridade = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ? AND usuario_id = ?",
            args: [titulo.trim(), statusValido, prioridadeValida, idParaAtualizar, usuarioId],
        });

        if (resultado.rowsAffected === 0) {
            return res.status(404).json({ message: "Tarefa não encontrada para atualização!" });
        }

        const { rows } = await buscarTarefaPorIdEUsuario(idParaAtualizar, usuarioId);
        return res.status(200).json(primeiraLinha<Tarefa>(rows));
    } catch {
        return res.status(500).json({ error: "Erro ao processar a atualização no banco de dados." });
    }
});

app.patch("/api/tasks/:id", authenticate, async (req: AuthRequest, res) => {
    const usuarioId = req.usuarioId!;
    const idParaAtualizar = parsearId(String(req.params.id));

    if (idParaAtualizar === null) {
        return res.status(400).json({ error: "ID inválido." });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Nenhum campo fornecido para atualização." });
    }

    const { titulo, prioridade, status } = req.body;

    try {
        const { rows: rowsExistente } = await buscarTarefaPorIdEUsuario(idParaAtualizar, usuarioId);
        const tarefaExistente = primeiraLinha<Tarefa>(rowsExistente);

        // Atenção: o server-lacunas.ts da aula faz "return null" aqui. Numa rota
        // async isso não responde nada e a requisição fica pendurada até o
        // timeout. Tarefa que não existe (ou é de outro usuário) é 404.
        if (!tarefaExistente) {
            return res.status(404).json({ message: "Tarefa não encontrada para atualização parcial!" });
        }

        const camposParaAtualizar: string[] = [];
        const valoresParaAtualizar: InValue[] = [];

        // Título (se enviado)
        if (titulo !== undefined) {
            if (!tituloValido(titulo)) {
                throw new Error("O título da tarefa deve conter pelo menos 3 caracteres válidos.");
            }
            camposParaAtualizar.push("titulo = ?");
            valoresParaAtualizar.push(titulo.trim());
        }

        // Prioridade (se enviada)
        if (prioridade !== undefined) {
            if (!PRIORIDADES.includes(prioridade as typeof PRIORIDADES[number])) {
                throw new Error("Prioridade inválida. Use 'low', 'medium' ou 'high'.");
            }
            camposParaAtualizar.push("prioridade = ?");
            valoresParaAtualizar.push(prioridade);
        }

        // Status (se enviado)
        if (status !== undefined) {
            if (!STATUS_VALIDOS.includes(status as typeof STATUS_VALIDOS[number])) {
                throw new Error("Status inválido. Use 'pending' ou 'completed'.");
            }
            camposParaAtualizar.push("status = ?");
            valoresParaAtualizar.push(status);
        }

        if (camposParaAtualizar.length === 0) {
            return res.status(200).json(tarefaExistente);
        }

        // Query dinâmica SEGURA: os nomes das colunas vêm da nossa allowlist
        // acima, e os valores vão nos "?" + args.
        camposParaAtualizar.push("atualizado_em = CURRENT_TIMESTAMP");
        const sql = `UPDATE tarefas SET ${camposParaAtualizar.join(", ")} WHERE id = ? AND usuario_id = ?`;
        valoresParaAtualizar.push(idParaAtualizar, usuarioId);

        await db.execute({ sql, args: valoresParaAtualizar });

        const { rows } = await buscarTarefaPorIdEUsuario(idParaAtualizar, usuarioId);
        return res.status(200).json(primeiraLinha<Tarefa>(rows));
    } catch (erro) {
        // Distingue erro de validação (400) de erro interno (500)
        if (erro instanceof Error && (erro.message.includes("inválid") || erro.message.includes("caracteres"))) {
            return res.status(400).json({ error: erro.message });
        }
        return res.status(500).json({ error: "Erro ao processar a atualização parcial no banco." });
    }
});

// ============================================================================
// LACUNA 10: as três peças da Aula 08 (a ordem importa!)
// ============================================================================

// (a) Uma rota de API que não existe tem que responder JSON, e não HTML.
// Se esta linha ficasse depois do SPA fallback, "GET /api/typo" cairia nele e
// devolveria o index.html com status 200: um erro da API viraria uma página de
// "sucesso", e o front receberia HTML onde esperava JSON.
app.use("/api", (_req: Request, res: Response) => {
    res.status(404).json({ error: "Rota de API não encontrada." });
});

// (b) Os arquivos que o `npm run build:web` (Vite) produziu em web/dist.
// index.html, os .js com hash no nome, o .css e as imagens da public/.
app.use(express.static(FRONT_DIST));

// (c) Qualquer outro caminho não é API: é uma rota do React, que roda no
// navegador. Devolvemos o index.html para o app assumir. É o que permite
// abrir ou recarregar /tarefas sem o servidor responder "não encontrado".
//
// Sobre o /(.*)/: no Express 5 o curinga "*" deixou de existir e precisa ser
// escrito como regex (a outra forma seria o padrão nomeado "/*splat"). O ponto
// é que este curinga é bem mais largo que o do Express 4 — por isso a linha
// (a) acima precisa vir antes: é ela que impede "/api/qualquer-coisa" de cair
// aqui e virar uma página em vez de um erro.
app.get(/(.*)/, (_req: Request, res: Response) => {
    if (!fs.existsSync(FRONT_INDEX)) {
        return res.status(503).type("text/plain").send(SEM_BUILD);
    }

    return res.sendFile(FRONT_INDEX);
});

function verificarFront(): void {
    if (!fs.existsSync(FRONT_INDEX)) {
        console.warn("\n[ATENÇÃO] " + SEM_BUILD + "\n");
        return;
    }

    const fontes = path.join(FRONT_DIR, "src");
    const temFontes = fs.existsSync(fontes);

    if (temFontes && maisRecente(fontes) > fs.statSync(FRONT_INDEX).mtimeMs) {
        console.warn(
            "\n[ATENÇÃO] O build do front está VELHO: algum arquivo de web/src " +
            "mudou depois do último build.\n" +
            "          Rode `npm run build:web` para ver a mudança.\n",
        );
    }
}

// ============================================================================
// LACUNA 11: só aceitamos requisições depois que o banco estiver pronto
// ============================================================================
// Antes, o db.exec() síncrono terminava antes da próxima linha. Agora a
// criação das tabelas é uma Promise: se o app.listen() viesse direto, a
// primeira requisição poderia chegar antes de a tabela existir no Turso.
async function iniciarServidor(): Promise<void> {
    await inicializarBanco();

    // No Express 5, este callback também é chamado quando o listen FALHA (ex.:
    // porta já ocupada por outro servidor esquecido aberto). Sem checar o erro,
    // o terminal diria "Servidor rodando" enquanto as requisições iriam para o
    // outro processo.
    app.listen(PORT, (erro?: Error) => {
        if (erro) {
            console.error(`\n[ERRO] Não consegui abrir a porta ${PORT}: ${erro.message}`);
            console.error("  Outro servidor já está usando essa porta? Feche-o ou use outra PORT.\n");
            process.exit(1);
        }

        exibirBannerBanco();
        console.log(`Servidor rodando em: http://localhost:${PORT}`);
        console.log(`API:   http://localhost:${PORT}/api/health`);
        console.log(`Front: http://localhost:${PORT}`);
        verificarFront();
    });
}

iniciarServidor();
