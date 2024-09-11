import React, { useRef, useState } from "react";
import Navbar from "./navbar";
import { CheckEmail, ResetSenha } from "./database";
import MobileMenu from "./mobileMenu";


const Reset_senha = () =>{
    const [error, setError] = useState('')
    const [emailEnviado, setEmailEnviado] = useState(false)
    const [email_touse, setEmail_touse] = useState('')
    const [mobileMenu, setMobileMenu] = useState(false)
    const changeMobileMenu = () => {
        setMobileMenu(!mobileMenu)
      }


    const email_ref = useRef(null)

    const error_change_color = (ref) =>{
        ref.current.style.borderColor = 'red'
    }

    const handleSubmit = async(e) =>{
        e.preventDefault()
        const email = email_ref.current.value
        setEmail_touse(email)
        if (!email.includes('@')){
            setError('Email inválido')
            error_change_color(email_ref)
        }
        const email_used = await CheckEmail(email)
        if (email_used){
            ResetSenha(email)
            setEmailEnviado(true)
        }
    }

    return(
    <>
            <div className="App">
                <Navbar/>
                {mobileMenu?(<MobileMenu is_logged={false} setMobileMenu={setMobileMenu}></MobileMenu>):(<></>)}
        <div className='button_mobile'>
          
          {mobileMenu?(<><button className="btn_menu closeMenuButton" onClick={changeMobileMenu}><span class="line-md--menu-to-close-transition"></span></button></>):(<><button className="btn_menu" onClick={changeMobileMenu}><span className="material-symbols--menu"></span></button></>)}</div>
            </div>
            <div className="mural">
                <div className="LogInSingUp">
                    {!emailEnviado?
                    (<><div className="title">
                    <h1>Informe o email</h1>
                    </div>
                    <div className="form">
                        <form onSubmit={handleSubmit}>
                            <p>Informe um email para a redefinção de senha</p>
                            <input type="text" className="input_form" placeholder="Email" ref={email_ref}></input>
                            <p className="error">{error}</p>
                            <button type="submit" className="submit">enviar</button>
                        </form>
                    </div></>):
                    (<><div className="title">
                        <h1>Email Enviado com Sucesso</h1>
                        </div>
                        <div className="form">
                                <p className="message">Email de redefinição de senha foi enviado para {email_touse}</p>
                        </div></>)}
                    
                </div>
            </div>
        </>
    )
}

export default Reset_senha