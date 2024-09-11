import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";
import { GetThePub } from "./database";
import { useEffect, useState } from "react";
import Recipe_Area from "./recipe";
import MobileMenu from "./mobileMenu";

const Receita = () => {
    const { id } = useParams();
    const { uuid } = useParams();
    const [loading, setLoading] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false)
    const changeMobileMenu = () => {
        setMobileMenu(!mobileMenu)
      }

    var is_logged = uuid?true:false
    
    console.log(id)

    const [receita, setReceita] = useState([]);

    useEffect(()=> {
        const fetchData = async() =>{
            const loadreceita = await GetThePub(id);
            setReceita(loadreceita);
        };

        fetchData()
    }, [])

    var receita_act = {}


    return (
        <>
        <div className="App">
          <Navbar uuid={uuid} is_logged={is_logged}></Navbar>
          {mobileMenu?(<MobileMenu is_logged={is_logged} uuid={uuid} setMobileMenu={setMobileMenu}></MobileMenu>):(<></>)}
        <div className='button_mobile'>
          
          {mobileMenu?(<><button className="btn_menu closeMenuButton" onClick={changeMobileMenu}><span class="line-md--menu-to-close-transition"></span></button></>):(<><button className="btn_menu" onClick={changeMobileMenu}><span className="material-symbols--menu"></span></button></>)}</div>
        </div>
        <div className='mural'>
          <Recipe_Area nome={receita.Nome} data={receita.data} url={receita.url}
          ingredientes={receita.Ingredientes} modo_preparo={receita.ModoPreparo}
          usúario={receita.usuario} totalAvalicao={receita.totalAvaliacao} quantidadeAvaliacao={receita.quantidadeAvaliacao}
          setLoading={setLoading}></Recipe_Area>
        </div>
         {loading?(
          <>
              <div className="loading_place">
                  <div className="loading">
                  <span class="line-md--loading-twotone-loop"></span>
                  </div>
              </div>
          </>
      ):(<></>)}
      </>
      );
    }


export default Receita;