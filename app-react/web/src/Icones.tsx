/**
 * Icones.tsx — os pequenos desenhos do tema de caderno.
 *
 * São SVGs desenhados à mão aqui mesmo, para não depender de biblioteca de
 * ícones. Todos são decorativos (aria-hidden): o texto ao lado já diz tudo
 * para quem usa leitor de tela.
 */

interface IconeProps {
    className?: string;
}

/** Um livro aberto. */
export function IconeLivro({ className }: IconeProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={className}
        >
            <path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5V5.5z" />
            <path d="M12 6v13.5" />
        </svg>
    );
}

interface IconeCheckProps extends IconeProps {
    /** Tarefa concluída: círculo preenchido com o visto. */
    feito: boolean;
}

/** O quadradinho de "feito" do caderno: vazio ou com o visto. */
export function IconeCheck({ feito, className }: IconeCheckProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={className}
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                className={feito ? "fill-emerald-700 stroke-emerald-700" : "stroke-ink-soft"}
            />
            {feito && <path d="M8 12.5l2.8 2.8L16.2 9.6" className="stroke-white" />}
        </svg>
    );
}

/** Uma lupa, para o campo de busca. */
export function IconeLupa({ className }: IconeProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
            className={className}
        >
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
        </svg>
    );
}
