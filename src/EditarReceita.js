import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";
import img1 from './imgs/recipe_img.png'
import UploadFile from "./upload";
import { UpdateRecipe } from "./database";
import { useNavigate } from "react-router-dom";
import { GetThePub } from "./database"
import Publis_default from "./publicacoes_default";
import NavBarDefault from "./navbar_default";
import MobileMenu from "./mobileMenu";




const EditReceita = () => {
    const { uuid, id } = useParams(); // Pega o uuid e o id da receita
    const is_logged = typeof(uuid) !== 'undefined';

    const [ingredientes, setIngredientes] = useState([]);
    const [inPasso, setPasso] = useState([]);
    const [imageSrc, setImageSrc] = useState(img1);

    const name_ref = useRef(null);
    const img_ref = useRef(null);
    const ingredientes_ref = useRef([]);
    const modoPreparo_ref = useRef([]);

    const [nameRecipe, setNameRecipe] = useState(''); // Corrigindo o erro: estado `nameRecipe` adicionado
    const [imgurl, setImgUrl] = useState('');
    const [recipeToEdit, setRecipeToEdit] = useState(null);

    const [loading, setLoading] = useState(false)

    const [mobileMenu, setMobileMenu] = useState(false)
    const changeMobileMenu = () => {
        setMobileMenu(!mobileMenu)
      }

    const top_ref = useRef(null)

    const navigate = useNavigate();

    // Função para buscar a receita com base no ID e preencher os campos
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const recipe = await GetThePub(id); // Função que busca receita pelo ID
                if (recipe) {
                    setRecipeToEdit(recipe);
    
                    // Preenche os valores dos campos
                    setNameRecipe(recipe.Nome[0].toUpperCase() + recipe.Nome.substring(1)); // Atualiza o estado nameRecipe
                    setImageSrc(recipe.url || img1);
                    
                    // Corrigindo o problema do ";" no final, removendo strings vazias após o split
                    setIngredientes(recipe.Ingredientes.split(";").filter(ingrediente => ingrediente.trim() !== ""));
                    setPasso(recipe.ModoPreparo.split(";").filter(passo => passo.trim() !== ""));
                    
                    setImgUrl(recipe.url);
                }
            } catch (error) {
                console.error("Erro ao buscar a receita:", error);
            }
        };
    
        fetchRecipe();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (top_ref.current) {
            top_ref.current.scrollIntoView({ behavior: 'auto', block: 'end' });
          }
        setLoading(true)

        var nomeReceita = name_ref.current.value.trim();

        nomeReceita = nomeReceita.toLowerCase();
        
        const file = img_ref.current && img_ref.current.files.length > 0 ? img_ref.current.files[0] : imgurl;
        let ingredientesList = ''
        let modoPreparoList = ''
        console.log("Nome da Receita:", nomeReceita);
         
        console.log("Arquivo de Imagem:", file);

        ingredientes.forEach((el) => {
            if (el.length > 0){
                el = el[0].toUpperCase() + el.substring(1)
                ingredientesList += el + ";"
            }
        })
        inPasso.forEach((el) => {
            if (el.length > 0){
                el = el[0].toUpperCase() + el.substring(1)
                modoPreparoList += el + ";"
                }
        })
        console.log("Ingredientes:", ingredientesList);
        console.log("Modo de Preparo:", modoPreparoList); 
        if(file !== imgurl){
            try {
                // Faz o upload e aguarda a URL ser retornada
                setImgUrl(await new Promise((resolve, reject) => {
                    UploadFile(file, (url) => {
                        if (url) {
                            resolve(url); // Sucesso
                        } else {
                            reject('Falha ao fazer upload da imagem');
                        }
                    });
                }));
            } catch (error) {
                console.error('Erro ao fazer o upload da imagem:', error);
                setLoading(false)
                return;
            }
    }
    try {
        await UpdateRecipe(id, nomeReceita, imgurl, ingredientesList, modoPreparoList);
        navigate(`/${uuid}/receitas_editar`);
    } catch (error) {
        console.error('Erro ao adicionar receita:', error);
    }
    };

    // Função para lidar com a mudança da imagem (Corrigindo o erro)
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                setTimeout(() => {
                    document.querySelector('.image-preview').classList.add('loaded');
                }, 100); 
            };
            reader.readAsDataURL(file);
        } else {
            console.error("Arquivo selecionado não é uma imagem.");
        }
    };

    const removeIngrediente = (index) => {
        setIngredientes(prevIngredientes => {
            // Filtra os ingredientes para remover o item no índice fornecido
            const newIngredientes = prevIngredientes.filter((_, i) => i !== index);
            
            // Remove o ref correspondente
            const newRefs = ingredientes_ref.current.filter((_, i) => i !== index);
            ingredientes_ref.current = newRefs;
    
            return newIngredientes;
        });
    };
    
    const removePasso = (index) => {
        setPasso(prevPassos => {
            // Filtra os passos para remover o item no índice fornecido
            const newPassos = prevPassos.filter((_, i) => i !== index);
            
            // Remove o ref correspondente
            const newRefs = modoPreparo_ref.current.filter((_, i) => i !== index);
            modoPreparo_ref.current = newRefs;
    
            return newPassos;
        });
    };

    const addIngredientes = () => {
        setIngredientes(prevIngredientes => {
            const newCount = prevIngredientes.length;
            ingredientes_ref.current[newCount] = React.createRef(); // Atualiza o ref para o novo ingrediente
            return [...prevIngredientes, ""]; // Adiciona um campo vazio para o novo ingrediente
        });
    };
    
    const addPasso = () => {
        setPasso(prevPassos => {
            const newCount = prevPassos.length;
            modoPreparo_ref.current[newCount] = React.createRef(); // Atualiza o ref para o novo passo
            return [...prevPassos, ""]; // Adiciona um campo vazio para o novo passo
        });
    };

    if (!recipeToEdit) {
        return (<>
            <div className="App">
               <NavBarDefault/>
             </div>
             <div className='mural'>
               <Publis_default></Publis_default>
             </div>
             </>); // Exibe um loading enquanto busca a receita
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
                        <h1>Editar Receita</h1>
                    </div>
                    <div className="form">
                        <form onSubmit={handleSubmit}>
                            <label className="label">Nome da Receita:</label>
                            <input
                                type="text"
                                placeholder="Nome da Receita"
                                className="input_form"
                                name="recipeName"
                                required
                                defaultValue={nameRecipe} // Usando o estado nameRecipe
                                ref={name_ref}
                            />

                            <label className="label">Ingredientes:</label>
                            <div className="ingredientes">
                                {ingredientes.map((ingrediente, index) => (
                                    <div key={`ingrediente-${index}`} className="input_place">
                                        <input
                                            type="text"
                                            name={`ingredientes[${index}]`}
                                            placeholder={`Ingrediente ${index + 1}`}
                                            className="input_form"
                                            required
                                            value={ingrediente} // Usando o estado como valor controlado
                                            onChange={(e) => {
                                                const newIngredientes = [...ingredientes];
                                                newIngredientes[index] = e.target.value;
                                                setIngredientes(newIngredientes);
                                            }} // Atualiza o estado ao alterar o valor do input
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
                                    <div key={`passo-${index}`} className="input_place">
                                        <input
                                            type="text"
                                            name={`passo[${index}]`}
                                            placeholder={`passo ${index + 1}`}
                                            className="input_form"
                                            required
                                            value={passo} // Usando o estado como valor controlado
                                            onChange={(e) => {
                                                const newPassos = [...inPasso];
                                                newPassos[index] = e.target.value;
                                                setPasso(newPassos);
                                            }} // Atualiza o estado ao alterar o valor do input
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

                            <label htmlFor="img" className="file_btn" style={{cursor: 'pointer'}}>
                                {imageSrc != img1? (<><img src={imageSrc}  alt="Selected" style={{width: '100%', height:'auto', opacity:'100%', cursor: 'pointer'}} className="image-preview" /></>):(<><img src={imageSrc} style={{filter: 'invert(1)', width: '70%' }}  alt="Selected" className="image-preview" /></>)}
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
                            <button type="submit" className="submit">salvar</button>
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

export default EditReceita;
