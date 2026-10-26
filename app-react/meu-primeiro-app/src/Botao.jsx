
function Botao (props) {
    const estiloBotao = {
        padding: '10px 20px' ,
        backgroundColor: props.cor || '#030303' ,
        color: 'white' ,
        border: 'none' ,
        borderRadius: '5px' ,
        cursor: 'pointer',
        margin:'5px',
        fontSize: '14px',
        fontWeight: 'bold'
};

    return(
        <button style={estiloBotao}>
            {props.texto}
        </button>
    )
}

export default Botao;
