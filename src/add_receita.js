import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";
import img1 from './imgs/recipe_img.png'
import UploadFile from "./upload";
import { AddRecipe } from "./database";
import { useNavigate } from "react-router-dom";
import MobileMenu from "./mobileMenu";


const AddReceita = () => {
    const { uuid } = useParams();
    const is_logged = typeof(uuid) !== 'undefined';
    const [ingredientes, setIngredientes] = useState([]);

    const name_ref = useRef(null)
    const img_ref = useRef(null)
    const top_ref = useRef(null)

    const ingredientes_ref = useRef([]);

    const [inPasso, setPasso] = useState([]);
    const modoPreparo_ref = useRef([])

    const [imageSrc, setImageSrc] = useState(img1);
    const [imgurl, setImgUrl] = useState('')

    const [nameRecipe, setNameRecipe] = useState('')
    const [ingredients, setIngredients] = useState('')
    const [modo_preparo, setModo_preparo] = useState('')
    const [usuario, setUsuario] = useState('')
    const [totalAvaliacao, setTotalAvalicao] = useState(0)
    const [quantidadeAvaliacao, setQuantidadeAvaliacao] = useState(0)
    const [today, setToday] = useState('')

    const [mobileMenu, setMobileMenu] = useState(false)
    const changeMobileMenu = () => {
        setMobileMenu(!mobileMenu)
      }

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (top_ref.current) {
            top_ref.current.scrollIntoView({ behavior: 'auto', block: 'end' });
          }
        setLoading(true)
        var nomeReceita = name_ref.current.value.trim();
        nomeReceita = nomeReceita.toLowerCase()

        const usuario = uuid;
        const file = img_ref.current && img_ref.current.files.length > 0 ? img_ref.current.files[0] : null;
    
        let td = new Date();
        let dd = String(td.getDate()).padStart(2, '0');
        let mm = String(td.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
        let yyyy = td.getFullYear();
        const dataHoje = `${dd}/${mm}/${yyyy}`;
    
        // Modo de preparo e ingredientes
        let modo_preparo = '';
        if (modoPreparo_ref.current.length === 0) {
            alert('O modo de preparo precisa ter pelo menos um passo');
            return;
        } else {
            modoPreparo_ref.current.forEach((el) => {
                try {
                    if (el.current.value.length > 0){
                        let elemento = el.current.value
                        elemento = elemento[0].toUpperCase() + elemento.substring(1)
                        modo_preparo += `${elemento};`;
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        }
    
        let ingredients = '';
        if (ingredientes_ref.current.length === 0) {
            alert('É necessário pelo menos um ingrediente');
            return;
        } else {
            ingredientes_ref.current.forEach((el) => {
                try {
                    if (el.current.value.length > 0){
                        let elemento = el.current.value
                        elemento = elemento[0].toUpperCase() + elemento.substring(1)
                        ingredients += `${elemento};`;
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        }
    
        let imgurl = '';
        if (file) {
            try {
                // Faz o upload e aguarda a URL ser retornada
                imgurl = await new Promise((resolve, reject) => {
                    UploadFile(file, (url) => {
                        if (url) {
                            resolve(url); // Sucesso
                        } else {
                            reject('Falha ao fazer upload da imagem');
                        }
                    });
                });
            } catch (error) {
                console.error('Erro ao fazer o upload da imagem:', error);
                return;
            }
        }
    
        // Agora que temos a URL da imagem, chama a função para adicionar a receita
        try {
            await AddRecipe(nomeReceita, ingredients, modo_preparo, imgurl, usuario, totalAvaliacao, quantidadeAvaliacao, dataHoje);
            navigate(`/${uuid}/home`);
        } catch (error) {
            console.error('Erro ao adicionar receita:', error);
            setLoading(false)
        }
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                setTimeout(() => {
                    document.querySelector('.image-preview').classList.add('loaded');
                }, 100); // Delay para aplicar a classe
            };
            reader.readAsDataURL(file);
        }
    };
    
    const addIngredientes = () => {
        setIngredientes(prevIngredientes => {
            const newCount = prevIngredientes.length;
            const newIngredientes = [...prevIngredientes, `ingrediente-${newCount}`];
            
            // Cria uma nova ref para o novo input
            ingredientes_ref.current[newCount] = React.createRef();
            
            return newIngredientes;
        });
    };

    const addPasso = () => {
        setPasso(prevPassos => {
            const newCount = prevPassos.length;
            const newPasso = [...prevPassos, `Passo-${newCount}`];
            
            // Cria uma nova ref para o novo input
            modoPreparo_ref.current[newCount] = React.createRef();
            
            return newPasso;
        });
    };

    const removeIngrediente = (index) => {
        ingredientes_ref.current[index].current.style.animation = 'fadeOut 0.4s ease-in forwards'
        setTimeout(() => {
            setIngredientes(prevIngredientes => prevIngredientes.filter((_, i) => i !== index));
            ingredientes_ref.current.splice(index, 1);
        }, 400); // Tempo correspondente à transição
    };

    const removePasso = (index) => {
        modoPreparo_ref.current[index].current.style.animation = 'fadeOut 0.4s ease-in forwards'
        setTimeout(() => {
            setPasso(prevPassos => {
                const newPassos = prevPassos.filter((_, i) => i !== index);
                return newPassos;
            })
            modoPreparo_ref.current.splice(index, 1);
            }, 400); // Tempo correspondente à transição
    };
    if (imageSrc === img1){
    return (
        <>
            <div className="App">
                <Navbar uuid={uuid} is_logged={is_logged} />
                {mobileMenu?(<MobileMenu is_logged={is_logged} uuid={uuid} setMobileMenu={setMobileMenu}></MobileMenu>):(<></>)}
        <div className='button_mobile'>
          
          {mobileMenu?(<><button className="btn_menu closeMenuButton" onClick={changeMobileMenu}><span class="line-md--menu-to-close-transition"></span></button></>):(<><button className="btn_menu" onClick={changeMobileMenu}><span className="material-symbols--menu"></span></button></>)}
        </div>
            </div>
            <div className="mural" >
                <div className="LogInSingUp">
                    <div className="title" ref={top_ref}>
                        <h1>Adicionar Receita</h1>
                    </div>
                    <div className="form">
                        <form onSubmit={handleSubmit}>
                            <label className="label">Nome da Receita:</label>
                            <input type="text" placeholder="Nome da Receita" className="input_form"
                             name="recipeName" required
                             ref={name_ref}
                             />
                            
                            <label className="label">Ingredientes:</label>
                            <div className="ingredientes">
                                {ingredientes.map((ingrediente, index) => (
                                    <div key={ingrediente} className="input_place">
                                        <input
                                            type="text"
                                            name={`ingredientes[${index}]`}
                                            placeholder={`Ingrediente ${index + 1}`}
                                            className="input_form"
                                            required
                                            ref={ingredientes_ref.current[index]}
                                        />
                                        <button type="button" className="addInput" onClick={() => removeIngrediente(index)}>
                                            <span className="mingcute--delete-fill"></span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" className="addInput" onClick={addIngredientes}>
                                <span className="ph--plus-bold"></span>
                            </button>
                            
                            <label className="label">Modo de Preparo:</label>
                            <div className="modoPreparo">
                                {inPasso.map((passo, index) => (
                                    <div key={passo} className="input_place">
                                        <input
                                            type="text"
                                            name={`passo[${index}]`}
                                            placeholder={`Passo ${index + 1}`}
                                            className="input_form"
                                            required
                                            ref={modoPreparo_ref.current[index]}
                                        />
                                        <button type="button" className="addInput" onClick={() => removePasso(index)}>
                                            <span className="mingcute--delete-fill"></span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" className="addInput" onClick={addPasso}>
                                <span className="ph--plus-bold"></span>
                            </button>

                            <label className="label">Adicione uma foto</label>
                            <p>(opcional)</p>
                            <label htmlFor="img" className="file_btn" style={{cursor: 'pointer'}}>
                                <img src={imageSrc} style={{filter: 'invert(1)', width: '80%', height:'auto', opacity:'80%', cursor: 'pointer'}} alt="Selected" className="image-preview" />
                            </label>
                            <input
                                type="file"
                                className="file"
                                id="img"
                                onChange={handleFileChange}
                                style={{ display: 'none'}}
                                name="recipeImg"
                                ref={img_ref}
                            />
                            <button type="submit" className="submit" style={{marginTop: '2em'}}>Submit</button>
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
} else {
    return(
    <>
            <div className="App">
                <Navbar uuid={uuid} is_logged={is_logged} />
                {mobileMenu?(<MobileMenu is_logged={is_logged} uuid={uuid} setMobileMenu={setMobileMenu}></MobileMenu>):(<></>)}
        <div className='button_mobile'>
          
          {mobileMenu?(<><button className="btn_menu closeMenuButton" onClick={changeMobileMenu}><span class="line-md--menu-to-close-transition"></span></button></>):(<><button className="btn_menu" onClick={changeMobileMenu}><span className="material-symbols--menu"></span></button></>)}
        </div>
            </div>
            <div className="mural">
                <div className="LogInSingUp">
                    <div className="title">
                        <h1>Adicionar Receita</h1>
                    </div>
                    <div className="form">
                        <form onSubmit={handleSubmit}>
                            <label className="label">Nome da Receita:</label>
                            <input type="text" placeholder="Nome da Receita" className="input_form"
                             name="recipeName" required
                             ref={name_ref}
                             />
                            
                            <label className="label">Ingredientes:</label>
                            <div className="ingredientes">
                                {ingredientes.map((ingrediente, index) => (
                                    <div key={ingrediente} className="input_place">
                                        <input
                                            type="text"
                                            name={`ingredientes[${index}]`}
                                            placeholder={`Ingrediente ${index + 1}`}
                                            className="input_form"
                                            required
                                            ref={ingredientes_ref.current[index]}
                                        />
                                        <button type="button" className="addInput" onClick={() => removeIngrediente(index)}>
                                            <span className="mingcute--delete-fill"></span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" className="addInput" onClick={addIngredientes}>
                                <span className="ph--plus-bold"></span>
                            </button>
                            
                            <label className="label">Modo de Preparo:</label>
                            <div className="modoPreparo">
                                {inPasso.map((passo, index) => (
                                    <div key={passo} className="input_place">
                                        <input
                                            type="text"
                                            name={`passos[${index}]`}
                                            placeholder={`Passo ${index + 1}`}
                                            className="input_form"
                                            required
                                            ref={modoPreparo_ref.current[index]}
                                        />
                                        <button type="button" className="addInput" onClick={() => removePasso(index)}>
                                            <span className="mingcute--delete-fill"></span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" className="addInput" onClick={addPasso}>
                                <span className="ph--plus-bold"></span>
                            </button>

                            <label className="label">Adicione uma foto</label>
                            <p>(opcional)</p>
                            <label htmlFor="img" className="file_btn" style={{cursor: 'pointer'}}>
                                <img src={imageSrc}  alt="Selected" className="image-preview" />
                            </label>
                            <input
                                type="file"
                                className="file"
                                id="img"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                name="recipeImg"
                                ref={img_ref}
                            />
                            <button type="submit" className="submit" style={{marginTop: '2em'}}>Submit</button>
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
}
};

export default AddReceita;