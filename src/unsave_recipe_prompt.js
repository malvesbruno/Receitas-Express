import React from "react";

const PromptUnsaveReceita = ({ChangePrompt, UnsaveReceita, name, id}) =>{
    return(
        <div className="prompt">
            <h1>Deseja realmente deletar "{name}"?</h1>
            <div className="btn_space">
                <button className="btnYes" onClick={() => UnsaveReceita(id)}>Sim</button>
                <button className="btnNo" onClick={() => ChangePrompt()}>Não</button>
            </div>
        </div>
    )
}

export default PromptUnsaveReceita;