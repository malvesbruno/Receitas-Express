import React, { useEffect, useRef, useState } from "react";
import Navbar from './navbar';
import Publis from './publicacoes';
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { LogIn } from "./database";
import NavBarDefault from "./navbar_default";
import Publis_default from "./publicacoes_default";
import MobileMenu from "./mobileMenu";


const Home = () => {
  const { uuid } = useParams();  
  const [cookiesAllowed, setCookiesAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false)
  const message_ref = useRef(null);
  const navigate = useNavigate();

  const location = useLocation();
  const state = location.state || {};
  const logginOut = state.logginOut

  useEffect(() => {
    const Get_Cookies = async () => {
      const email = Cookies.get('email');
      const password = Cookies.get('password');
      if (email && password && !logginOut) {
        const user = await LogIn(email, password);
        if (user) {
          setLogged(true);
          const uuid = user.uid;
          navigate(`/${uuid}/home`);
        }
      }
      setLoading(false); // Set loading to false after attempting to log in
    };

    Get_Cookies();
  }, [navigate]);

  useEffect(()=> {
    const getCookieAllowed = async() => {
      const value = localStorage.getItem('cookieAllowed');
      console.log(value)
      if (value === 'true') {
        setCookiesAllowed(true)
      }
    }
    getCookieAllowed();
  })

  const changeMobileMenu = () => {
    setMobileMenu(!mobileMenu)
  }

  const goToReceita = (id, uuid) => {
    if (!logged) {
      navigate(`/receita/${id}`);
    } else {
      navigate(`/${uuid}/receita/${id}`);
    }
  };

  const changeCookieState = () => {
    setCookiesAllowed(true);
    message_ref.current.style.display = 'none';
    localStorage.setItem('cookieAllowed', 'true');
  };

  if (loading) {
    return (<>
     <div className="App">
        <NavBarDefault/>
      </div>
      <div className='mural'>
        <Publis_default></Publis_default>
      </div>
      </>); // Display loading indicator while waiting for cookies and login
  }

  return (
    <>
      <div className="App">
        <Navbar is_logged={logged} uuid={uuid} cookiesAllowed={cookiesAllowed} />
        {mobileMenu?(<MobileMenu is_logged={logged} uuid={uuid} cookiesAllowed={cookiesAllowed} setMobileMenu={setMobileMenu}></MobileMenu>):(<></>)}
        <div className='button_mobile'>
          
          {mobileMenu?(<><button className="btn_menu closeMenuButton" onClick={changeMobileMenu}><span class="line-md--menu-to-close-transition"></span></button></>):(<><button className="btn_menu" onClick={changeMobileMenu}><span className="material-symbols--menu"></span></button></>)}
        </div>
      </div>
      <div className='mural'>
        <Publis clickNavigate={goToReceita} uuid={uuid} />
      </div>
      {!cookiesAllowed && (
        <div className="messageCookies" ref={message_ref}>
          <p>Utilizamos cookies para aprimorar sua experiência de navegação. Ao clicar em “Aceitar todos”, você concorda com nosso uso de cookies.</p>
          <div className="btn_space">
            <button className="btnRecusar" onClick={() => {
              setCookiesAllowed(false);
              message_ref.current.style.display = 'none';
            }}>Recusar</button>
            <button className="btnAceitar" onClick={() => changeCookieState()}>Aceitar todos</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;