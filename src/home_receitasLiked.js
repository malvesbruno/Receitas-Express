import React, { useState } from "react";
import Navbar from './navbar';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Receitas_liked from "./receitas_liked";
import MobileMenu from "./mobileMenu";

const HomeReceitasLiked = () => {
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
        navigate(`/${uuid}/receita/${id}`)
      };
    }



    return (
        <>
        <div className="App">
          <Navbar is_logged={logged} uuid={uuid} searchPage={true}></Navbar>
          {mobileMenu?(<MobileMenu is_logged={logged} uuid={uuid} setMobileMenu={setMobileMenu} searchPage={true}></MobileMenu>):(<></>)}
        <div className='button_mobile'>
          
          {mobileMenu?(<><button className="btn_menu closeMenuButton" onClick={changeMobileMenu}><span class="line-md--menu-to-close-transition"></span></button></>):(<><button className="btn_menu" onClick={changeMobileMenu}><span className="material-symbols--menu"></span></button></>)}</div>
        </div>
        <div className='mural'>
        <div className="title">
                    <h1>Receitas Curtidas</h1>
        </div>
          <Receitas_liked clickNavigate={goToEditarReceita} uuid={uuid}></Receitas_liked>
        </div>
        </>
      );
}

export default HomeReceitasLiked