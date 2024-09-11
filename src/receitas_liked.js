import React, { useState, useEffect } from "react";
import { GetThePub, GetProfile, GetReceitasLiked, UpdateRecipesLiked, UpdateRecipeRate } from "./database";
import defaultRecipe from './imgs/th.jpg';
import PromptUnsaveReceita from "./unsave_recipe_prompt";
import { useNavigate } from "react-router-dom";
import Publis_default from "./publicacoes_default";

const Receitas_liked = ({ clickNavigate, uuid }) => {
    const [receitas, setReceitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({});
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await GetProfile(uuid)
                setProfile(user)
                let listaJson = JSON.parse(user[0].Receitas)
                let lista_receitas = []
                listaJson.forEach((item) => {
                    lista_receitas.push(item.id)
                    })
                setReceitas(await GetReceitasLiked(lista_receitas))
            } catch (error) {
                console.error("Failed to fetch recipes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const UnsaveReceita = async(id) => {
        try{
            let rate = 0
            let quantity = 1

            let recipe = await GetThePub(id)
            console.log(recipe)

            let recipe_rate = recipe.totalAvaliacao
            let recipe_quantity = recipe.quantidadeAvaliacao
            if(recipe_quantity > 0){
                recipe_quantity -= quantity   
            }

            let listaJson = JSON.parse(profile[0].Receitas)
            
            listaJson.forEach((el) => {
                if(el.id === id){
                    rate =  el.rate
                }
            })
            
            if (recipe_rate > 0){
                recipe_rate -= rate
            }
            
            let lista_receitas = listaJson.filter((obj) => {
                return obj.id !== id
            })

            console.log(lista_receitas)
            let receitas_json = JSON.stringify(lista_receitas)
            await UpdateRecipeRate(id, recipe_rate, recipe_quantity)
            await UpdateRecipesLiked(uuid, receitas_json)
            navigate(0)
            
        } catch (error) {
            console.error("Erro ao deletar a receita: ", error);
        }
    };


    const getStars = (quantidadeAvaliacao, totalAvaliacao) => {
        const rating = quantidadeAvaliacao === 0 ? 0 : totalAvaliacao / quantidadeAvaliacao;
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <>
                {Array(fullStars).fill(null).map((_, index) => (
                    <span key={`full-${index}`} className="full-star"></span>
                ))}
                {hasHalfStar && <span className="half-star"></span>}
                {Array(emptyStars).fill(null).map((_, index) => (
                    <span key={`empty-${index}`} className="empty-star"></span>
                ))}
            </>
        );
    };

    const ChangePrompt = (id) => {
        setSelectedRecipeId(id); // Define o id da receita selecionada
    };


    if (loading) {
        return <Publis_default></Publis_default>;
    }

    if (receitas){
    return (
        <>
            {receitas.map(recipe => (
                <div className="item_recipe" key={recipe.Nome}>
                    <div className="img_obj">
                        <img src={recipe.url || defaultRecipe} alt={recipe.Nome} />
                    </div>
                    <div className="desc_obj">
                        <h1>{recipe.Nome[0].toUpperCase() + recipe.Nome.substring(1)}<br></br> <p>{recipe.data}</p></h1>
                        <div className="btn-space">
                            <div className="estrelas">
                                <div className="stars">
                                    {getStars(recipe.quantidadeAvaliacao, recipe.totalAvaliacao)}
                                </div>
                            </div>
                            <button onClick={() => ChangePrompt(recipe.id)}>
                                <span class="iconamoon--bookmark-off-bold"></span>
                            </button>
                        </div>
                    </div>
                    <div className="btn_obj">
                        <button onClick={() => clickNavigate(recipe.id, uuid)}>
                            <span className="ic--round-play-arrow"></span>
                        </button>
                    </div>
                    {selectedRecipeId == recipe.id && (
            <PromptUnsaveReceita 
                ChangePrompt={() => setSelectedRecipeId(null)} 
                UnsaveReceita={() => UnsaveReceita(selectedRecipeId)} 
                name={receitas.find(r => r.id === selectedRecipeId)?.Nome} 
                id={selectedRecipeId}
            />
            )}
                </div>
            ))}
        </>
    );} else{
        return (<>
            <div className="noRecipe">
                <h3>Aparentemente não há receitas aqui</h3>
                <span class="solar--sad-circle-outline"></span>
                <button className="button" onClick={() =>{
                    navigate(`/${uuid}/`)
                }}>Ir para Home</button>
            </div>
            </>)
    }
};

export default Receitas_liked;
