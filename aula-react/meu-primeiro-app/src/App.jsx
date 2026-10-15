import { useState } from 'react';
import Tarefa from './Tarefa';  

function App() {

    const[tarefas, setTarefas] = useState([]);
    const[novoTitulo, setNovoTitulo] = useState('')

    function AdicionarTarefa(evento) {
        evento.preventDefault();

        const tituloLimpo = novoTitulo.trim();

        if (tituloLimpo === '') {
            return;
        }

        const novaTarefa = {
            id: Date.now(),
            titulo: tituloLimpo,
            concluida: false
        };

        setTarefas(listaAtual => [...listaAtual, novaTarefa])
        setNovoTitulo(''); 
    }

    function AlternarTarefa(id) {
        setTarefas(listaAtual => 
            listaAtual.map(tarefa => 
                tarefa.id === id
                    ? { ...tarefa, concluida: !tarefa.concluida }
                    : tarefa

            )
        );
    }


    function removerTarefa(id) {
        setTarefas(listaAtual =>
            listaAtual.filter(tarefa => tarefa.id !== id)
        );
    }

    const totalPendentes = tarefas.filter(
        tarefa => !tarefa.concluida
    ).length;

    const todasConcluidas = tarefas.length > 0 && totalPendentes === 0;

    return (
        <main>
            <h1>Minhas tarefas</h1>
            <p>Organize sua rotina...</p>

            <form onSubmit={AdicionarTarefa}>
                <label htmlFor="tituloTarefa"> Nova tarefa </label>
                <br />
                <input 
                id='tituloTarefa'
                type="text" 
                value={novoTitulo}
                onChange={evento => setNovoTitulo(evento.target.value)}
                placeholder='Estudando...'
                />

                <button type='submit'>Adicionar</button>

            </form>

            <ul>
                {tarefas.map((tarefa) => (
                    <Tarefa
                        key={tarefa.id}
                        tarefa={tarefa}
                        onAlterar={AlternarTarefa}
                        onRemover={removerTarefa}
                    />
                ))}
            </ul>

            <p>Total de tarefas: {tarefas.length}</p>
            <p>Tarefas pendentes: {todasConcluidas ? 'Parabéns!!! você é um campeão!' : totalPendentes}</p>

            
        </main>
    );

}
export default App
