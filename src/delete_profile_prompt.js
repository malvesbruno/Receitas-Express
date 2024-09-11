import React, { useRef, useState } from "react";


const PromptDelProfile = ({ChangePrompt, DelConta, DelContaEReceitas, uuid}) =>{
    const title_ref = useRef()
    const [delAccount, setDelAccount] = useState(false)

    const handleYes = () =>{
        setDelAccount(true)
    }
    return(
        <div className="prompt">
            {!delAccount? (
                <>
            <h1 ref={title_ref}>Deseja realmente deletar sua conta?<button className="close_Button" type="button" onClick={() => {
                setDelAccount(false)
                ChangePrompt()
                }}><span class="ic--sharp-close"></span></button></h1>
            <div className="btn_space">
                <button type="button" className="btnYes" onClick={() => handleYes()}>Sim</button>
                <button type="button" className="btnNo" onClick={() => ChangePrompt()}>Não</button>
            </div>
            </>) : (
                <>
                <h1 ref={title_ref}>Deseja deletar também suas receitas?<button className="close_Button" type="button" onClick={() => {
                setDelAccount(false)
                ChangePrompt()
                }}><span class="ic--sharp-close"></span></button></h1>
            <div className="btn_space">
                <button type="button" className="btnYes" onClick={() => DelContaEReceitas(uuid)}>Sim</button>
                <button type="button" className="btnNo" onClick={() => DelConta(uuid)}>Não</button>
            </div>
            </>)}
        </div>
    )
}

export default PromptDelProfile;