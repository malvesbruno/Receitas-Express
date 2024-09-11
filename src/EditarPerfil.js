import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";
import img1 from './imgs/recipe_img.png'
import UploadFile from "./upload";
import { useNavigate } from "react-router-dom";
import { DelAccount, DelAllReceitas, DeleteAccountAuth, GetProfile, UpdateEmailAuth } from "./database"
import avatar1 from './imgs/avatar/avatar1.png';
import avatar2 from './imgs/avatar/avatar2.png';
import avatar3 from './imgs/avatar/avatar3.png';
import avatar4 from './imgs/avatar/avatar4.png';
import avatar5 from './imgs/avatar/avatar5.png';
import avatar6 from './imgs/avatar/avatar6.png';
import avatar7 from './imgs/avatar/avatar7.png';
import avatar8 from './imgs/avatar/avatar8.png';
import avatar9 from './imgs/avatar/avatar9.png';
import { UpdatePerfil } from "./database";
import PromptDelProfile from "./delete_profile_prompt";
import MobileMenu from "./mobileMenu";


const EditUser = () => {
    const { uuid } = useParams(); // Pega o uuid e o id da receita
    const is_logged = typeof(uuid) !== 'undefined';

    const [mobileMenu, setMobileMenu] = useState(false)
    const changeMobileMenu = () => {
        setMobileMenu(!mobileMenu)
      }

    const img1_ref = useRef(null);
    const img2_ref = useRef(null);
    const img3_ref = useRef(null);
    const img4_ref = useRef(null);
    const img5_ref = useRef(null);
    const img6_ref = useRef(null);
    const img7_ref = useRef(null);
    const img8_ref = useRef(null);
    const img9_ref = useRef(null);
    const name_ref = useRef(null);
    const email_ref = useRef(null)
    const top_ref = useRef(null)

    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [pp, setPp] = useState(1)
    const [UserToEdit, setUserToEdit] = useState(null);
    const [errorMessage, setErrorMassage] = useState('');
    const [promptState, setPromptState] = useState(false);
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const delPerfil = async(uuid) =>{
        const delete_auth = await DeleteAccountAuth()
        const delete_account = await DelAccount(uuid)
        if(delete_auth && delete_account){
            navigate('/')
        }
    }

    const delPerfilEReceitas = async(uuid) =>{
        const delete_allRecipes = await DelAllReceitas(uuid)
        const delete_auth = await DeleteAccountAuth()
        const delete_account = await DelAccount(uuid)
        if(delete_auth && delete_account && delete_allRecipes){
            navigate('/')
        }
    }

    // Função para buscar a receita com base no ID e preencher os campos
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await GetProfile(uuid)
                setUserToEdit(user)
                setName(user[0].Nome)
                setEmail(user[0].Email)
                setPp(user[0].PP)
                console.log(user[0].Email)
            } catch (error) {
                console.error("Erro ao buscar a receita:", error);
            }
        };
    
        fetchUserData();
    }, [uuid]);

    useEffect(() =>{
        const showImgSelected = async() =>{
            console.log(pp)
            if (img1_ref.current){
            switch(pp){
                case 1:
                    img1_ref.current.classList.add('checked')
                    break
                case 2:
                    img2_ref.current.classList.add('checked')
                    break
                case 3:
                    img3_ref.current.classList.add('checked')
                    break
                case 4:
                    img4_ref.current.classList.add('checked')
                    break
                case 5:
                    img5_ref.current.classList.add('checked')
                    break
                case 6:
                    img6_ref.current.classList.add('checked')
                    break
                case 7:
                    img7_ref.current.classList.add('checked')
                    break
                case 8:
                    img8_ref.current.classList.add('checked')
                    break
                case 9:
                    img9_ref.current.classList.add('checked')
                    break
                default:
                    img1_ref.current.classList.add('checked')

            }
        }
        }
        showImgSelected()
    }, [pp])

    const error_change_color = (ref) =>{
        ref.current.style.borderColor = 'red'
    }

    const ChangePrompt = () =>{
        setPromptState(!promptState)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (top_ref.current) {
            top_ref.current.scrollIntoView({ behavior: 'auto', block: 'end' });
          }
        setLoading(true)

        try{
            const user_check = await GetProfile(uuid)
            if (name === ''){
                setErrorMassage('O nome precisa ser preenchido')
                error_change_color(name_ref)
            } else if(email === ''){
                setErrorMassage('O e-mail precisa ser preenchido')
                error_change_color(email_ref)
            } else{
                await UpdatePerfil(uuid, name, email, pp).then(async(result) => {
                    if(result){
                        console.log(result)
                        await UpdateEmailAuth(email).then((result) => {
                            if(result){
                                console.log(result)
                                navigate(`/${uuid}/home`)
                            }
                        })
                    }
                })
            }

        } catch(error){
            console.log(error)
            setLoading(false)
        }
    };

    const handlePPchange = async(ref) => {
        switch(pp){
            case 1:
                img1_ref.current.classList.remove('checked')
                break
            case 2:
                img2_ref.current.classList.remove('checked')
                break
            case 3:
                img3_ref.current.classList.remove('checked')
                break
            case 4:
                img4_ref.current.classList.remove('checked')
                break
            case 5:
                img5_ref.current.classList.remove('checked')
                break
            case 6:
                img6_ref.current.classList.remove('checked')
                break
            case 7:
                img7_ref.current.classList.remove('checked')
                break
            case 8:
                img8_ref.current.classList.remove('checked')
                break
            case 9:
                img9_ref.current.classList.remove('checked')
                break
            }
            if (ref == pp){
                setPp(1)
                console.log(pp)
            } else{
                setPp(ref)
            }
    }
    
    if (!UserToEdit) {
        return <>
         <div className="App">
                <Navbar uuid={uuid} is_logged={is_logged} />
                {mobileMenu?(<MobileMenu is_logged={is_logged} uuid={uuid} setMobileMenu={setMobileMenu}></MobileMenu>):(<></>)}
        <div className='button_mobile'>
          
          {mobileMenu?(<><button className="btn_menu closeMenuButton" onClick={changeMobileMenu}><span class="line-md--menu-to-close-transition"></span></button></>):(<><button className="btn_menu" onClick={changeMobileMenu}><span className="material-symbols--menu"></span></button></>)}</div>
            </div>
        <div className="mural">
            <div className="LogInSingUp">
                <div className="title" ref={top_ref}>
                        <h1 style={{color: '#8C062B'}}>oi</h1>
                </div>
                <div className="form">
                <form onSubmit={handleSubmit}>
                            <label className="label">Nome:</label>
                            <input
                                type="text"
                                name={`Name`}
                                placeholder={`Name`}
                                className="input_form"
                            />
                            <label className="label">Email:</label>
                            <input
                                type="text"
                                name={`Email`}
                                placeholder={`Email`}
                                className="input_form"
                            />
                            <label className="label">Profile Picture</label>
                            <div className="profile_pictures">
                                <img src={avatar1}></img>
                                <img src={avatar2}></img>
                                <img src={avatar3}></img>
                                <img src={avatar4}></img>
                                <img src={avatar5}></img>
                                <img src={avatar6}></img>
                                <img src={avatar7}></img>
                                <img src={avatar8}></img>
                                <img src={avatar9}></img>
                            </div>
                    </form>
                </div>
            </div>
        </div>
        </>;
    }

    return (
        <>
            <div className="App">
                <Navbar uuid={uuid} is_logged={is_logged} />
                {mobileMenu?(<MobileMenu is_logged={is_logged} uuid={uuid} setMobileMenu={setMobileMenu}></MobileMenu>):(<></>)}
        <div className='button_mobile'>
          
          {mobileMenu?(<><button className="btn_menu closeMenuButton" onClick={changeMobileMenu}><span class="line-md--menu-to-close-transition"></span></button></>):(<><button className="btn_menu" onClick={changeMobileMenu}><span className="material-symbols--menu"></span></button></>)}</div>
            </div>
            <div className="mural">
                <div className="LogInSingUp">
                    <div className="title" ref={top_ref}>
                        <h1>Editar seu Perfil</h1>
                    </div>
                    <div className="form">
                        <form onSubmit={handleSubmit}>
                            <label className="label">Nome:</label>
                            <input
                                type="text"
                                name={`Name`}
                                placeholder={`Name`}
                                className="input_form"
                                value={name}
                                ref={name_ref}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                 // Usando o estado como valor controlado
                            />
                            <label className="label">Email:</label>
                            <input
                                type="text"
                                name={`Email`}
                                placeholder={`Email`}
                                className="input_form"
                                value={email}
                                ref={email_ref}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }} // Usando o estado como valor controlado
                            />
                            <label className="label">Profile Picture</label>
                            <div className="profile_pictures">
                                <img src={avatar1} ref={img1_ref} onClick={() => handlePPchange(1)}></img>
                                <img src={avatar2} ref={img2_ref} onClick={() => handlePPchange(2)}></img>
                                <img src={avatar3} ref={img3_ref} onClick={() => handlePPchange(3)}></img>
                                <img src={avatar4} ref={img4_ref} onClick={() => handlePPchange(4)}></img>
                                <img src={avatar5} ref={img5_ref} onClick={() => handlePPchange(5)}></img>
                                <img src={avatar6} ref={img6_ref} onClick={() => handlePPchange(6)}></img>
                                <img src={avatar7} ref={img7_ref} onClick={() => handlePPchange(7)}></img>
                                <img src={avatar8} ref={img8_ref} onClick={() => handlePPchange(8)}></img>
                                <img src={avatar9} ref={img9_ref} onClick={() => handlePPchange(9)}></img>
                            </div>
                            <div className="credits">
                                <a href="https://br.freepik.com/vetores-gratis/colecao-desenhada-a-mao-de-icones-de-perfis-diferentes_17786262.htm#from_view=detail_alsolike">Imagem de freepik</a>
                            </div>
                            <p className="error">{errorMessage}</p>
                            <button type="submit" className="submit">salvar</button>

                            <label className="label_del">Deletar o Perfil:</label>
                            {promptState ? (
                                <PromptDelProfile ChangePrompt={ChangePrompt} DelConta={delPerfil} DelContaEReceitas={delPerfilEReceitas} uuid={uuid}></PromptDelProfile>
                            ):''}
                            <button type="button" className="deleteAccount" onClick={() => ChangePrompt()}>
                                <span class="uiw--user-delete"></span>
                            </button>
                        </form>
                    </div>
                </div>
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
};

export default EditUser;
