import React, { useState, useEffect } from "react";
import { DeleteRecipe, GetReceitasProfile } from "./database";
import defaultRecipe from './imgs/th.jpg';
import PromptDelReceita from "./delete_recipe_prompt";
import { useNavigate } from "react-router-dom";
import Publis_default from "./publicacoes_default";



const Receitas_editar = ({ clickNavigate, uuid }) => {
    const [receitas, setReceitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loadreceita = await GetReceitasProfile(uuid);
                setReceitas(loadreceita);
            } catch (error) {
                console.error("Failed to fetch recipes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [uuid]);

    const DelReceita = async (id, url) => {
        try {
            await DeleteRecipe(id, url);
            setReceitas((prevReceitas) => prevReceitas.filter((recipe) => recipe.id !== id));
            navigate(0);
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
        setSelectedRecipeId(id);
    };

    return (
        <>
            {loading && <Publis_default />}

            {receitas.map((recipe, index) => (
                <div className="item_recipe" key={recipe.id}>
                    <div className="img_obj">
                        {/* Exibe a imagem da receita ou a imagem padrão */}
                        <img src={recipe.url || defaultRecipe} alt={recipe.Nome} />
                    </div>
                    <div className="desc_obj">
                        <h1>
                            {recipe.Nome[0].toUpperCase() + recipe.Nome.substring(1)}
                            <br />
                            <p>{recipe.data}</p>
                        </h1>
                        <div className="btn-space">
                            <div className="estrelas">
                                <div className="stars">{getStars(recipe.quantidadeAvaliacao, recipe.totalAvaliacao)}</div>
                            </div>
                            <button onClick={() => ChangePrompt(recipe.id)}>
                                <span className="solar--trash-bin-trash-linear"></span>
                            </button>
                        </div>
                    </div>
                    <div className="btn_obj">
                        <button onClick={() => clickNavigate(recipe.id, uuid)}>
                            <span className="material-symbols-light--edit-outline-rounded"></span>
                        </button>
                    </div>

                    {selectedRecipeId === recipe.id && (
                        <PromptDelReceita
                            ChangePrompt={() => setSelectedRecipeId(null)}
                            DelReceita={() => DelReceita(recipe.id, recipe.url)}
                            name={recipe.Nome}
                            id={recipe.id}
                        />
                    )}
                </div>
            ))}
        </>
    );
};

export default Receitas_editar;
