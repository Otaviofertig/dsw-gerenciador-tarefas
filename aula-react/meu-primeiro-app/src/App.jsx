import { useState } from "react";

import ( useState)

function App () {
  const [contador, setContador] = useState(0);
  
  function incrementar() {
    setContador(contador + 1);

  }

  function decrementar() {
    setContador(contador - 1);

  }

  return(
    <>
      <h2>Total de cliques: { contador }</h2>
  
      <button onClick={incrementar}>
        +
      </button>

      <button onClick={decrementar}>
        -
      </button>
    </>
  )
}

export default App;
