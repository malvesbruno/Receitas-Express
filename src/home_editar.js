import React, { useState } from "react";
import Navbar from './navbar';
import Receitas_editar from "./receitas_editar";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Publis_default from "./publicacoes_default";
import MobileMenu from "./mobileMenu";

const HomeEditar = () => {
  const { uuid } = useParams()  

    const navigate = useNavigate();

    const [mobileMenu, setMobileMenu] = useState(false)
    const changeMobileMenu = () => {
        setMobileMenu(!mobileMenu)
      }
  
    var logged = false
    if (uuid){
      logged = true
    }

    const goToEditarReceita = (id, uuid) => {
      if (!logged){
        navigate(`/receita/${id}`)
      } else{
        navigate(`/${uuid}/editar_receita/${id}`)
      };
    }



    return (
        <>
        <div className="App">
          <Navbar is_logged={logged} uuid={uuid}></Navbar>
          {mobileMenu?(<MobileMenu is_logged={logged} uuid={uuid} setMobileMenu={setMobileMenu}></MobileMenu>):(<></>)}
        <div className='button_mobile'>
          
          {mobileMenu?(<><button className="btn_menu closeMenuButton" onClick={changeMobileMenu}><span class="line-md--menu-to-close-transition"></span></button></>):(<><button className="btn_menu" onClick={changeMobileMenu}><span className="material-symbols--menu"></span></button></>)}</div>
        </div>
        <div className='mural'>
        <div className="title">
                    <h1>Suas Receitas</h1>
        </div>
          <Receitas_editar clickNavigate={goToEditarReceita} uuid={uuid}></Receitas_editar>
        </div>
        </>
      );
}

export default HomeEditar