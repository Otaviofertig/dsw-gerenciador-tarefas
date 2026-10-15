function Tarefa({tarefa, onAlterar, onRemover}) {
    return (
        <li key={tarefa.id}>
            <span
                style={{
                    textDecoration: tarefa.concluida ? 'line-through' : 'none'
                }}
            >
                {tarefa.titulo}
            </span>
            {''}
            <button onClick={() => onAlterar(tarefa.id)}>
                {tarefa.concluida ? 'Reabrir' : 'Concluir'}
            </button>
            {''}
            <button onClick={() => onRemover(tarefa.id)}>
                Remover
            </button>
        </li>
    );
}

export default Tarefa;  