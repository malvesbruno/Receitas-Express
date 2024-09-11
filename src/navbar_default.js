import React from "react"
import hat from './imgs/hat.png'
import { useNavigate } from "react-router-dom"

const NavBarDefault = () => {
    const navigate = useNavigate
    const home = () => {
            navigate("/")
        
    }

    return(
        <>
        <nav className='navbar'>
            <div className='navbar_list'>
                <button className='btn_menu'>
                    <span className="material-symbols--menu"></span>
                </button>
                <div className='menu_dropdown'>
                    
                    <div className='options'>
                        <div className='color_option'>
                            <div className='color_option_inner'>
                            <button className='btn_option'>Criar Receitas</button>
                            <button className='btn_option'>Editar Receita</button>
                            <button className='btn_option'>Sign Up / LogIn</button>
                            </div>
                    </div>
                    </div>
                </div>

            </div>
            <div className='navbar_logo'>
                <img src={hat} onClick={() => home()}></img>
            </div>
            <div className='navbar_search'>
                <input type='text' placeholder='Search' className='input'></input>
                <button><span className="majesticons--search"></span></button>
            </div>
        </nav>
        </>
    )
}

export default NavBarDefault