import { useState, useEffect } from "react";

function Saudacao() {
  return <h1>Olá, turma! Minha primeira interface!</h1>;
}

export default function App() {
  const [n, setN] = useState(0);
  const [mensagem, setMensagem] = useState("Carregando...");

  // Simulando tarefas que virão do Back-end
  const [tarefas] = useState([
    { id: 1, titulo: "Configurar Vite e React" },
    { id: 2, titulo: "Entender useState e useEffect" },
    { id: 3, titulo: "Renderizar lista com map()" }
  ]);

  useEffect(() => {
    fetch("http://localhost:3000/api/health")
      .then(res => res.json())
      .then(data => {
        console.log("Dados recebidos do back-end:", data);
        setMensagem("Conexão estabelecida com sucesso!");
      })
      .catch(() => setMensagem("Erro ao conectar com o servidor"));
  }, []);

  return (
    <div>
      <Saudacao />
      <hr />
      <h2>Contador interativo</h2>
      <button onClick={() => setN(n + 1)}>
        Cliquei {n} vezes
      </button>
      <hr />
      <h2>Status do Servidor</h2>
      <p>{mensagem}</p>
      <hr />
      <h2>Minhas Tarefas</h2>
      <ul>
        {tarefas.map(tarefa => (
          <li key={tarefa.id}>{tarefa.titulo}</li>
        ))}
      </ul>
    </div>
  );
}
