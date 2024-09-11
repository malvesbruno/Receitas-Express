import React from "react";


const PromptLogOut = ({ChangePrompt, logginOut}) =>{
    return(
        <div className="prompt">
            <h1>Deseja Realmente fazer Log Out?</h1>
            <div className="btn_space">
                <button className="btnYes" onClick={() => logginOut()}>Sim</button>
                <button className="btnNo" onClick={() => ChangePrompt()}>Não</button>
            </div>
        </div>
    )
}

export default PromptLogOut;