/**
 * Tarefas.tsx — a tela principal do Gerenciador de Tarefas.
 *
 * É aqui que o front "conversa" com a API: lista, cria, conclui e exclui
 * tarefas. Tudo passa por api.ts, que por baixo coloca o token do usuário.
 *
 * A tela tem quatro partes visíveis:
 *   1. cabeçalho  — e-mail de quem está conectado e botão Sair
 *   2. formulário — campos de título/prioridade e busca
 *   3. lista      — as tarefas, com contador e rolagem
 *   4. modal      — confirmação antes de excluir
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
    atualizarTarefa,
    criarTarefa,
    deletarTarefa,
    listarTarefas,
    type Tarefa,
    type Usuario,
} from "./api";
import { IconeCheck, IconeLivro, IconeLupa } from "./Icones";

// Tipos derivados de Tarefa: se o back mudar o conjunto de valores,
// o TypeScript avisa aqui sem precisar mexer em nada.
type Prioridade = Tarefa["prioridade"];   // "low" | "medium" | "high"
type Status = Tarefa["status"];           // "pending" | "completed"

/**
 * A API fala inglês (low/medium/high) porque é o contrato com o banco,
 * mas a tela fala português. Este dicionário é a tradução.
 * O Record<Prioridade, string> garante que, se o back inventar uma prioridade
 * nova, o TypeScript reclame até você traduzir aqui.
 */
const PRIORIDADES_PT: Record<Prioridade, string> = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
};

/** As opções na ordem em que aparecem no <select>. */
const PRIORIDADES: Prioridade[] = ["low", "medium", "high"];

/**
 * Cores do marcador de página de cada prioridade: verde-sálvia (baixa),
 * dourado (média) e vermelho-fita (alta). O texto escuro mantém o contraste.
 */
const COR_PRIORIDADE: Record<Prioridade, string> = {
    low: "bg-emerald-200 text-emerald-950",
    medium: "bg-amber-200 text-amber-950",
    high: "bg-rose-200 text-rose-950",
};

/** Quanto tempo esperamos a pessoa parar de digitar antes de buscar. */
const DEBOUNCE_MS = 400;

/** Extrai a mensagem de erro de qualquer coisa que tenha sido lançada. */
function mensagemDe(erro: unknown, padrao: string): string {
    return erro instanceof Error ? erro.message : padrao;
}

// ---------------------------------------------------------------------------
// O componente
// ---------------------------------------------------------------------------

interface TarefasProps {
    /** Quem está logado — vem do App, que decodificou o token. */
    usuario: Usuario;
    /** Volta para a tela de login (o App é quem apaga o token). */
    aoSair: () => void;
}

export default function Tarefas({ usuario, aoSair }: TarefasProps) {
    // --- dados ---------------------------------------------------------------
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    // --- busca ---------------------------------------------------------------
    // Dois estados de propósito: `busca` é o que está na caixa de texto (muda a
    // cada tecla) e `buscaAplicada` é o que realmente vai para a API. Sem essa
    // separação, cada tecla dispararia uma requisição.
    const [busca, setBusca] = useState("");                 // muda a cada tecla
    const [buscaAplicada, setBuscaAplicada] = useState(""); // vai para a API

    // --- formulário de criação ----------------------------------------------
    const [titulo, setTitulo] = useState("");
    // Toda nova tarefa começa com prioridade Alta.
    const [prioridade, setPrioridade] = useState<Prioridade>("high");
    const [criando, setCriando] = useState(false);

    // --- modal de exclusão ---------------------------------------------------
    const [paraExcluir, setParaExcluir] = useState<Tarefa | null>(null);

    /**
     * Guarda o id da requisição em andamento. Serve para descartar respostas
     * antigas: se você digita "c", "ca", "cas" rápido, as três requisições saem
     * juntas e nem sempre voltam na ordem. Sem esta trava, a resposta do "c"
     * poderia chegar por último e sobrescrever a lista com o resultado errado.
     */
    const requisicaoAtual = useRef(0);

    /**
     * O termo que foi REALMENTE enviado para a API na última vez.
     *
     * Serve para o efeito de debounce saber se o valor mudou de verdade. Um
     * useState não serviria: aqui o valor só interessa lá dentro do setTimeout,
     * e não no próximo render.
     */
    const ultimaBusca = useRef("");

    /** Esta resposta ainda interessa, ou outra requisição já começou? */
    const aindaValida = (meuId: number): boolean =>
        meuId === requisicaoAtual.current;

    /**
     * Recarrega a lista. Usada pelos botões (criar, concluir, excluir) depois
     * de uma alteração, para a tela refletir o que o banco gravou.
     */
    const carregar = useCallback(async (): Promise<void> => {
        const meuId = ++requisicaoAtual.current;

        try {
            const dados = await listarTarefas(buscaAplicada);
            if (!aindaValida(meuId)) return;
            setTarefas(dados);
            // Limpamos o aviso só depois do sucesso, para uma falha antiga não
            // piscar na tela enquanto a nova requisição ainda está em voo.
            setErro("");
        } catch (e) {
            if (!aindaValida(meuId)) return;
            setErro(mensagemDe(e, "Não foi possível carregar suas tarefas."));
        } finally {
            if (aindaValida(meuId)) setCarregando(false);
        }
    }, [buscaAplicada]);

    /**
     * Efeito 1 — o "debounce". Espera a digitação parar antes de aplicar a busca.
     * O return é a função de limpeza: se a pessoa digitar mais, o React roda ela
     * primeiro, cancelando o setTimeout anterior. É o que evita o "efeito máquina
     * de escrever" na API.
     *
     * O setCarregando fica dentro do setTimeout de propósito: ali ele já roda
     * assíncrono, então não provoca um render extra logo no começo do efeito.
     *
     * E a linha do `if` é o que impede um bug muito confuso. Na montagem, `busca`
     * e `ultimaBusca` já valem "": o timer dispara 400ms depois e não muda nada.
     * Se marcássemos "carregando" assim mesmo, a tela entraria em "Carregando..."
     * e nunca mais sairia, porque sem busca nova não existe resposta para
     * desligar a flag. A lista apareceria por um instante e sumiria.
     */
    useEffect(() => {
        const temporizador = setTimeout(() => {
            const termo = busca.trim();

            // Nada mudou de verdade: não busca e não mexe no "carregando".
            if (termo === ultimaBusca.current) return;

            ultimaBusca.current = termo;
            setBuscaAplicada(termo);
            setCarregando(true);
        }, DEBOUNCE_MS);
        return () => clearTimeout(temporizador);
    }, [busca]);

    /**
     * Efeito 2 — busca os dados na abertura e a cada busca aplicada.
     *
     * Repare que o estado só é tocado DENTRO dos callbacks do .then, nunca no
     * corpo do efeito. É o padrão recomendado pelo React para buscar dados: se
     * atualizássemos estado direto aqui, teríamos um render em cascata
     * desnecessário logo na montagem.
     *
     * São duas proteções, com papeis diferentes:
     *   - `montado` é a limpeza do efeito. Se a tela sair (ou a busca mudar
     *     antes da resposta chegar), a resposta chega tarde e é ignorada.
     *   - `aindaValida(meuId)` é a trava contra respostas fora de ordem, e
     *     vale inclusive para as requisições disparadas pelos botões.
     */
    useEffect(() => {
        const meuId = ++requisicaoAtual.current;
        let montado = true;

        listarTarefas(buscaAplicada).then(
            (dados) => {
                if (!montado || !aindaValida(meuId)) return;
                setTarefas(dados);
                setErro("");
                setCarregando(false);
            },
            (e: unknown) => {
                if (!montado || !aindaValida(meuId)) return;
                setErro(mensagemDe(e, "Não foi possível carregar suas tarefas."));
                setCarregando(false);
            },
        );

        return () => {
            montado = false;
        };
    }, [buscaAplicada]);

    // --- criar ---------------------------------------------------------------
    const criar = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const tituloLimpo = titulo.trim();
        
        if (tituloLimpo.length < 3) {
            setErro("O título deve ter pelo menos 3 caracteres.");
            return;
        }

        setCriando(true);
        setErro("");

        try {
            await criarTarefa(tituloLimpo, prioridade);
            setTitulo("");
            setPrioridade("high");
            await carregar();
        } catch (e) {
            setErro(mensagemDe(e, "Não foi possível criar a tarefa."));
        } finally {
            setCriando(false);
        }
    };

    // --- concluir / reabrir --------------------------------------------------
    const alternarStatus = async (tarefa: Tarefa): Promise<void> => {
        const novoStatus: Status =
            tarefa.status === "completed" ? "pending" : "completed";

        setErro("");
        try {
            await atualizarTarefa(tarefa.id, { status: novoStatus });
            await carregar();
        } catch (e) {
            setErro(mensagemDe(e, "Não foi possível atualizar a tarefa."));
        }
    };

    // --- excluir -------------------------------------------------------------
    const confirmarExcluir = async (): Promise<void> => {
        if (!paraExcluir) return;
        const alvo = paraExcluir;

        // Fecha o modal na hora: o clique já foi confirmado, não faz sentido
        // deixar a janela aberta esperando a resposta da rede.
        setParaExcluir(null);
        setErro("");

        try {
            await deletarTarefa(alvo.id);
            await carregar();
        } catch (e) {
            setErro(mensagemDe(e, "Não foi possível excluir a tarefa."));
        }
    };

    // --- acessibilidade do modal --------------------------------------------
    // Ao abrir, o foco vai para o botão de confirmar, para quem navega só com o
    // teclado saber imediatamente onde está.
    const botaoConfirmar = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (paraExcluir) botaoConfirmar.current?.focus();
    }, [paraExcluir]);

    // Esc fecha o modal. Só fica de escuta quando o modal aberto.
    useEffect(() => {
        if (!paraExcluir) return;

        const aoTeclar = (e: KeyboardEvent): void => {
            if (e.key === "Escape") setParaExcluir(null);
        };

        document.addEventListener("keydown", aoTeclar);
        return () => document.removeEventListener("keydown", aoTeclar);
    }, [paraExcluir]);

    // --- contadores ----------------------------------------------------------
    const total = tarefas.length;
    const concluidas = tarefas.filter((t) => t.status === "completed").length;
    const pendentes = total - concluidas;

    return (
        <div className="min-h-screen px-3 py-6 sm:px-6 sm:py-10">
            {/* A folha do caderno: margem vermelha, furos de argola e folhas por baixo. */}
            <div className="caderno mx-auto w-full max-w-3xl">
                <div className="flex flex-col gap-6">
                    {/* ---------------------------------------------------------- 1. cabeçalho */}
                    <header className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <IconeLivro className="mt-1 h-10 w-10 shrink-0 text-leather" />
                            <div>
                                <p className="font-hand text-xl leading-none text-ribbon">
                                    Caderno de tarefas
                                </p>
                                <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
                                    Minhas Tarefas
                                </h1>
                                <p className="mt-1 text-sm text-ink-soft">
                                    Conectado como{" "}
                                    <span className="font-semibold text-ink">{usuario.email}</span>
                                </p>
                            </div>
                        </div>

                        <button type="button" onClick={aoSair} className="btn btn-contorno">
                            Sair
                        </button>
                    </header>

                    {/* ------------------------------------------------------- 2. criar tarefa */}
                    <form
                        onSubmit={criar}
                        className="flex flex-col gap-4 border-y border-dashed border-ink/30 py-4 sm:flex-row sm:items-end"
                    >
                        <div className="flex-1">
                            <label htmlFor="titulo" className="sr-only">
                                Título da nova tarefa
                            </label>
                            <input
                                id="titulo"
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                placeholder="O que precisa ser feito?"
                                maxLength={120}
                                className="campo font-hand text-2xl"
                            />
                        </div>

                        <div>
                            <label htmlFor="prioridade" className="sr-only">
                                Prioridade
                            </label>
                            <select
                                id="prioridade"
                                value={prioridade}
                                onChange={(e) => setPrioridade(e.target.value as Prioridade)}
                                className="campo w-full cursor-pointer sm:w-auto"
                            >
                                {PRIORIDADES.map((p) => (
                                    <option key={p} value={p}>
                                        {PRIORIDADES_PT[p]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={criando}
                            className="btn btn-primario"
                        >
                            {criando ? "Criando..." : "Nova Tarefa"}
                        </button>
                    </form>

                    {/* ------------------------------------------------------------- 3. busca */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="busca" className="text-sm font-semibold text-ink-soft">
                            Buscar por título
                        </label>
                        <div className="relative">
                            <IconeLupa className="pointer-events-none absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" />
                            <input
                                id="busca"
                                type="search"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Folheie o caderno..."
                                className="campo pl-8"
                            />
                        </div>
                    </div>

                    {/* -------------------------------------------------------------- 4. erro */}
                    {erro && (
                        <div
                            role="alert"
                            className="flex items-start justify-between gap-3 rounded-md border-l-4 border-ribbon bg-rose-50 px-4 py-3 text-sm text-rose-900"
                        >
                            <span>{erro}</span>
                            <button
                                type="button"
                                onClick={() => setErro("")}
                                aria-label="Fechar aviso"
                                className="shrink-0 cursor-pointer text-lg leading-none text-rose-800 transition hover:text-rose-950"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* ------------------------------------------------------------- 5. lista */}
                    <div>
                        {/* aria-live faz o leitor de tela anunciar a contagem a cada mudança */}
                        <p
                            aria-live="polite"
                            className="mb-1 font-hand text-2xl text-ink-soft"
                        >
                            {carregando
                                ? "Carregando..."
                                : `${pendentes} pendente(s) e ${concluidas} concluída(s).`}
                        </p>

                        {carregando ? (
                            <p className="py-6 text-center font-hand text-2xl text-ink-soft">
                                Buscando suas tarefas...
                            </p>
                        ) : total === 0 ? (
                            <div className="flex flex-col items-center py-10 text-center">
                                <IconeLivro className="h-12 w-12 text-ink-soft/50" />
                                <p className="mt-3 font-display text-lg font-semibold text-ink">
                                    {buscaAplicada
                                        ? `Nenhuma tarefa contém "${buscaAplicada}".`
                                        : "Nenhuma tarefa por aqui ainda."}
                                </p>
                                <p className="mt-1 font-hand text-xl text-ink-soft">
                                    {buscaAplicada
                                        ? "Tente outro termo de busca."
                                        : "Use o formulário acima para criar a primeira."}
                                </p>
                            </div>
                        ) : (
                            <ul className="flex max-h-[60vh] list-none flex-col overflow-y-auto border-t border-dashed border-ink/30 p-0 pr-1">
                                {tarefas.map((t) => {
                                    const feita = t.status === "completed";

                                    return (
                                        <li
                                            key={t.id}
                                            className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-ink/30 py-3"
                                        >
                                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                                <IconeCheck feito={feita} className="h-6 w-6 shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p
                                                        className={`truncate py-0.5 pr-2 font-hand text-2xl leading-snug ${feita
                                                            ? "text-ink-soft line-through decoration-ribbon/70 decoration-2"
                                                            : "text-ink"
                                                            }`}
                                                    >
                                                        {t.titulo}
                                                    </p>
                                                    <span
                                                        className={`marcador mt-1 ${COR_PRIORIDADE[t.prioridade]}`}
                                                    >
                                                        {PRIORIDADES_PT[t.prioridade]}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => void alternarStatus(t)}
                                                    className="btn btn-contorno px-3 py-1 text-xs"
                                                >
                                                    {feita ? "Reabrir" : "Concluir"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setParaExcluir(t)}
                                                    className="btn btn-contorno-perigo px-3 py-1 text-xs"
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* ------------------------------------------------------- 6. modal de exclusão */}
            {paraExcluir && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
                    // Clicar no fundo (fora do cartão) cancela.
                    onClick={() => setParaExcluir(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-modal"
                        onClick={(e) => e.stopPropagation()}
                        className="etiqueta w-full max-w-sm p-6"
                    >
                        <h2
                            id="titulo-modal"
                            className="font-display text-xl font-bold text-ink"
                        >
                            Excluir esta tarefa?
                        </h2>

                        <p className="mt-2 text-sm text-ink-soft">
                            <span className="font-semibold text-ink">{paraExcluir.titulo}</span> será
                            removida permanentemente. Não dá para desfazer.
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setParaExcluir(null)}
                                className="btn btn-contorno"
                            >
                                Cancelar
                            </button>

                            <button
                                ref={botaoConfirmar}
                                type="button"
                                onClick={() => void confirmarExcluir()}
                                className="btn btn-perigo"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
