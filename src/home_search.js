import React, { useState } from "react";
import Navbar from './navbar';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Receitas_searched from "./search_recipe";
import MobileMenu from "./mobileMenu";

const HomeSearch = () => {
  const { uuid, name } = useParams() 
  const [mobileMenu, setMobileMenu] = useState(false)
    const changeMobileMenu = () => {
        setMobileMenu(!mobileMenu)
      }

    console.log(uuid, name)  

    const navigate = useNavigate();
  
    var logged = false
    if (uuid){
      logged = true
    }

    const goToEditarReceita = (id, uuid) => {
      if (!logged){
        navigate(`/receita/${id}`)
      } else{
        navigate(`/${uuid}/receita/${id}`)
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
                    <h1>Resultados para a pesquisa "{name}"</h1>
        </div>
          <Receitas_searched clickNavigate={goToEditarReceita} uuid={uuid} name={name}></Receitas_searched>
        </div>
        </>
      );
}

export default HomeSearch