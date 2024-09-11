import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import hat from './imgs/hat.png'
import { useNavigate } from "react-router-dom";
import avatar1 from './imgs/avatar/avatar1.png'
import avatar2 from './imgs/avatar/avatar2.png'
import avatar3 from './imgs/avatar/avatar3.png'
import avatar4 from './imgs/avatar/avatar4.png'
import avatar5 from './imgs/avatar/avatar5.png'
import avatar6 from './imgs/avatar/avatar6.png'
import avatar7 from './imgs/avatar/avatar7.png'
import avatar8 from './imgs/avatar/avatar8.png'
import avatar9 from './imgs/avatar/avatar9.png'
import { GetProfile } from './database';
import PromptLogOut from './logout_prompt';
import { Logout } from './database';

const Navbar = ({is_logged, uuid, searchPage=false, cookiesAllowed=false}) => {
    const navigate = useNavigate()
    const toSearch = useRef(null)
    console.log(is_logged)
    

    const SingUp = () =>{
        navigate("/SignUp", { state: { cookiesAllowed: cookiesAllowed } })
    }

    const add_receita = () => {
        navigate(`/${uuid}/add_receita`)
    }

    const editar_receita = () => {
        navigate(`/${uuid}/receitas_editar`)
    }

    const receitas_liked = () => {
        navigate(`/${uuid}/receitas_curtidas/`)
    }

    const home = () => {
        if (is_logged && uuid){
            navigate(`/${uuid}/home`)
        } else{
            navigate("/")
        }
    }

    const edit_user = () => {
        navigate(`/${uuid}/edit-user`)
    }

    const [user, setUser] = useState({Nome: '', PP: 1})

    useEffect(() => {
        const get_profile = async() => {
            console.log(user)
            const response = await GetProfile(uuid)
            const res = response[0]
            setUser(res);
        }
        get_profile()
    }, [])


    const [prompt, setPrompt] = useState(false)
    const ChangePrompt = () => {
        setPrompt(!prompt)
    }

    const logginOut = () =>{
        Logout()
        navigate("/", { state: { logginOut: true } })
        uuid = ''
        is_logged = false
        setPrompt(false)
        navigate(0)
    }

    const handleSearch = () =>{
        let name_search = toSearch.current.value
        name_search = name_search.toLowerCase().trim()
        if(name_search.length > 0 || name_search !== ''){
            if (searchPage){
                navigate(0)
            } else{
                navigate(`/${uuid}/search_for/${name_search}`)
            }
        }
    }


    if (is_logged && user && user.PP !== undefined){
        var avatar = avatar1

        switch (user.PP){
            case 1:
                avatar = avatar1;
                break;
            case 2:
                avatar = avatar2;
                break;
            case 3:
                avatar = avatar3;
                break;
            case 4:
                avatar = avatar4;
                break;
            case 5:
                avatar = avatar5;
                break;
            case 6:
                avatar = avatar6;
                break;
            case 7:
                avatar = avatar7;
                break;
            case 8:
                avatar = avatar8;
                break;
            case 9:
                avatar = avatar9;
                break;
            default:
                avatar = avatar1;

        }
        if (!prompt){
            return(
                <>
                <nav className='navbar'>
                    <div className='navbar_list'>
                        <button className='btn_menu'>
                            <span className="material-symbols--menu"></span>
                        </button>
                        <div className='menu_dropdown' style={{height: '60%'}}>
                            
                            <div className='options'>
                                <div className='color_option'>
                                    <div className='color_option_inner'>
                                        <div className='cracha'>
                                            <img src={avatar}></img>
                                            <div className='text_area'>
                                                <p>{user['Nome']}</p>
                                                <button onClick={() => edit_user()}> Editar Perfil</button>
                                            </div>
                                        </div>
                                    <button className='btn_option' onClick={() => add_receita()}>Criar Receitas</button>
                                    <button className='btn_option' onClick={() => editar_receita()}>Editar Receita</button>
                                    <button className='btn_option' onClick={() => receitas_liked()}>Receitas curtidas</button>
                                    <button className='btn_option' onClick={() => ChangePrompt()}>LogOut</button>
                                    </div>
                            </div>
                            </div>
                        </div>

                    </div>
                    <div className='navbar_logo'>
                        <img src={hat} onClick={() => home()}></img>
                    </div>
                    <div className='navbar_search'>
                        <input type='text' placeholder='Search' className='input' ref={toSearch}></input>
                        <button><span className="majesticons--search" onClick={() => handleSearch()}></span></button>
                    </div>
                </nav>
                </>
            )
        } else{
            return(
                <>
                <nav className='navbar'>
                    <div className='navbar_list'>
                        <button className='btn_menu'>
                            <span className="material-symbols--menu"></span>
                        </button>
                        <div className='menu_dropdown' style={{height: '60%'}}>
                            
                            <div className='options'>
                                <div className='color_option'>
                                    <div className='color_option_inner'>
                                        <div className='cracha'>
                                            <img src={avatar}></img>
                                            <div className='text_area'>
                                                <p>{user['Nome']}</p>
                                                <button onClick={() => edit_user()}> Editar Perfil</button>
                                            </div>
                                        </div>
                                    <button className='btn_option' onClick={() => add_receita()}>Criar Receitas</button>
                                    <button className='btn_option' onClick={() => editar_receita()}>Editar Receita</button>
                                    <button className='btn_option' onClick={() => receitas_liked()}>Receitas curtidas</button>
                                    <button className='btn_option' onClick={() => ChangePrompt()}>LogOut</button>
                                    </div>
                            </div>
                            </div>
                        </div>

                    </div>
                    <div className='navbar_logo'>
                        <img src={hat} onClick={() => home()}></img>
                    </div>
                    <div className='navbar_search'>
                        <input type='text' placeholder='Search' className='input' ref={toSearch}></input>
                        <button><span className="majesticons--search" onClick={() => handleSearch()}></span></button>
                    </div>
                </nav>
                <PromptLogOut ChangePrompt={ChangePrompt} logginOut={logginOut}></PromptLogOut>
                </>
            )
        }

    } else{
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
                                <button className='btn_option' onClick={() => SingUp()}>Criar Receitas</button>
                                <button className='btn_option' onClick={() => SingUp()}>Editar Receita</button>
                                <button className='btn_option' onClick={() => SingUp()}>Sign Up / LogIn</button>
                                </div>
                        </div>
                        </div>
                    </div>

                </div>
                <div className='navbar_logo'>
                    <img src={hat} onClick={() => home()}></img>
                </div>
                <div className='navbar_search'>
                    <input type='text' placeholder='Search' className='input' ref={toSearch}></input>
                    <button><span className="majesticons--search"></span></button>
                </div>
            </nav>
            </>
        )
}
}

export default Navbar