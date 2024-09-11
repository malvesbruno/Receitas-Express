import React from "react";
import Navbar from "./navbar";
import { useState } from "react";
import { AddUser } from "./database";
import { useRef } from "react";
import { CheckEmail } from "./database";
import { SignUp, LogIn } from "./database";
import { json, useNavigate } from "react-router-dom";
import { GetProfile } from './database';
import { useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import MobileMenu from "./mobileMenu";


const SignUpPage = () =>{
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMassage] = useState('')
    const [login, setLogin] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false)
    const changeMobileMenu = () => {
        setMobileMenu(!mobileMenu)
      }

    const password_ref = useRef(null)
    const email_ref = useRef(null)
    const nome_ref = useRef(null)

    const navigate = useNavigate()

    const location = useLocation();
    const state = location.state || {};
    const cookies_allowed = state.cookiesAllowed

    const error_change_color = (ref) =>{
        ref.current.style.borderColor = 'red'
    }

    const restart_errors = () =>{
        try{
        setErrorMassage('')
        nome_ref.current.style.borderColor = 'transparent'
        email_ref.current.style.borderColor = 'transparent'
        password_ref.current.style.borderColor = 'transparent'
        } catch (error){
            console.error(error)
        }
    }

    const reset_senha = () => {
        navigate('/reset_senha')
    }


    const GoLogin = () => {
        setLogin(!login)
        restart_errors()
    }

    const handleSubmitLogIn = async(e) =>{
        e.preventDefault()
        if (password.length < 8){
            error_change_color(password_ref)
            setErrorMassage('A senha tem que ter no mínimo 8 caractéres')
        } else {
            console.log(email, password)
            try{
                const user = await LogIn(email, password)
                if (!user || !cookies_allowed){
                    setErrorMassage('Email ou senha inválidos')
                    error_change_color(email_ref)
                    error_change_color(password_ref)
                } else{
                    var uuid = user.uid
                    Cookies.set('email', email, { expires: 60 })
                    Cookies.set('password', password, { expires: 60 })
                    navigate(`/${uuid}/home`);
                }
            } catch (error) {
                console.log(error)
                setErrorMassage('Email ou senha incorretos')
                error_change_color(email_ref)
                error_change_color(password_ref)
            }
        }
    }



    const handleSubmitSignUp = async(e) => {
        e.preventDefault()
        if (password.length < 8){
            setErrorMassage('A senha tem que ter no mínimo 8 caractéres')
            error_change_color(password_ref)
        } else if(!email.includes('@')){
            setErrorMassage('Email não é válido')
            error_change_color(email_ref)
        }
         else{

            let pp = 1
            let receita = ''
            var user = await SignUp(email, password)
            if (user == 'email_already_in_use' || !user || !cookies_allowed){
                setErrorMassage('Email já cadastrado')
                error_change_color(email_ref)
            } else {
            let uuid = user.uid
            var AddedUser = await AddUser(email, nome, uuid, pp, receita)
            console.log(user, uuid, AddedUser)
            Cookies.set('email', email, { expires: 60 })
            Cookies.set('password', password, { expires: 60 })
            navigate(`/${uuid}/home`);
            }
        }
        
    }
    
    if (!login){
    return(
        <>
        <div className="App">
            <Navbar />
            {mobileMenu?(<MobileMenu is_logged={false} setMobileMenu={setMobileMenu}></MobileMenu>):(<></>)}
        <div className='button_mobile'>
          
          {mobileMenu?(<><button className="btn_menu closeMenuButton" onClick={changeMobileMenu}><span class="line-md--menu-to-close-transition"></span></button></>):(<><button className="btn_menu" onClick={changeMobileMenu}><span className="material-symbols--menu"></span></button></>)}</div>
        </div>
        <div className="mural">
            <div className="LogInSingUp">
                <div className="title">
                    <h1>Sign Up</h1>
                </div>
                <div className="form">
                    <form onSubmit={handleSubmitSignUp}>
                        <label className="label">Nome:</label>
                        <input className="input_form" type="text" name="username" required placeholder="name" value={nome}
                        onChange={(e) => setNome(e.target.value)} ref={nome_ref} />
                        
                        <label className="label">Email:</label>
                        <input className="input_form" type="text" name="email" placeholder="email" required value={email}
                        onChange={(e) => setEmail(e.target.value)} ref={email_ref} />
                        
                        <label className="label">Password:</label>
                        <input className="input_form" type="password" name="password" placeholder="password" required value={password}
                        onChange={(e) => setPassword(e.target.value)} ref={password_ref} />
                        <p className="error">{errorMessage}</p>
                        <p>Já tem uma conta? Faça <a onClick={GoLogin}>Log In</a></p>
                        <button type="submit" className="submit">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
} else {
    return (
        <>
        <div className="App">
            <Navbar />
        </div>
        <div className="mural">
            <div className="LogInSingUp">
                <div className="title">
                    <h1>LogIn</h1>
                </div>
                <div className="form">
                    <form onSubmit={handleSubmitLogIn}>
                        <label className="label">Email:</label>
                        <input className="input_form" type="text" name="email" placeholder="email" required value={email}
                        onChange={(e) => setEmail(e.target.value)} ref={email_ref} />
                        
                        <label className="label">Password:</label>
                        <input className="input_form" type="password" name="password" placeholder="password" required value={password}
                        onChange={(e) => setPassword(e.target.value)} ref={password_ref} />
                        <p className="error">{errorMessage}</p>
                        <a style={{color: 'rgb(103, 103, 253)', fontSize: '1em', textDecoration: 'underline', marginBottom:'2em', cursor: 'pointer'}} onClick={() => reset_senha()}>Esqueci Minha Senha</a>
                        <p>Não tem uma conta? Faça <a onClick={GoLogin}>Sign up</a></p>
                        <button type="submit" className="submit">LogIn</button>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}
}

export default SignUpPage