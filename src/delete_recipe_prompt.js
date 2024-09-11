import React from "react";


const PromptDelReceita = ({ChangePrompt, DelReceita, name, id}) =>{
    return(
        <div className="prompt">
            <h1>Deseja realmente deletar "{name}"?</h1>
            <div className="btn_space">
                <button className="btnYes" onClick={() => DelReceita(id)}>Sim</button>
                <button className="btnNo" onClick={() => ChangePrompt()}>Não</button>
            </div>
        </div>
    )
}

export default PromptDelReceita;