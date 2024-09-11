import React, { useState, useEffect } from "react";
import defaultRecipe from './imgs/th.jpg';
import { useNavigate } from "react-router-dom";
import { ReceitasNomeIgual, ReceitasMesmoPrefixo } from "./database";
import Publis_default from "./publicacoes_default";

const Receitas_searched = ({ clickNavigate, uuid, name }) => {
    const [receitas, setReceitas] = useState([]);
    const [receitasPrefix, setReceitasPrefix] = useState([])
    const [loading, setLoading] = useState(true);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const navigate = useNavigate()

    const generatePrefix = (name, length = 3) => {
        if (name.length < length) {
            return name; // Se o nome for menor que o comprimento do prefixo desejado, retorna ele inteiro
        }
        return name.substring(0, length); // Retorna os primeiros 'n' caracteres do nome
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let ReceitaNameIgual = await ReceitasNomeIgual(name)
                setReceitas(ReceitaNameIgual)
                let namePrefix = await generatePrefix(name)
                console.log(namePrefix)
                let ReceitasamePrefixo = await ReceitasMesmoPrefixo(namePrefix)
                setReceitasPrefix(ReceitasamePrefixo)
            } catch (error) {
                console.error("Failed to fetch recipes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [name]);




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



    if (loading) {
        return <Publis_default />;
    }

    if(receitas.length > 0 || receitasPrefix.length > 0){
        return (
            <>
                {receitas? receitas.map(recipe => (
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
                            </div>
                        </div>
                        <div className="btn_obj">
                            <button onClick={() => clickNavigate(recipe.id, uuid)}>
                                <span className="ic--round-play-arrow"></span>
                            </button>
                        </div>
                    </div>
                )): (<></>)}
                <h3>Pesquisa Semelhantes</h3>
                {receitasPrefix ? receitasPrefix.map(recipe => (
                    <div className="item_recipe" key={recipe.Nome}>
                        <div className="img_obj">
                            <img src={recipe.url || defaultRecipe} alt={recipe.Nome} />
                        </div>
                        <div className="desc_obj">
                            <h1>
                                <div className="title_receita">
                                <span className="marker">
                                    {recipe.Nome[0].toUpperCase() + recipe.Nome.substring(1, 3)}
                                    </span>
                                {recipe.Nome.substring(3)}
                                </div>
                                <p>{recipe.data}</p>
                                </h1>
                            <div className="btn-space">
                                <div className="estrelas">
                                    <div className="stars">
                                        {getStars(recipe.quantidadeAvaliacao, recipe.totalAvaliacao)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="btn_obj">
                            <button onClick={() => clickNavigate(recipe.id, uuid)}>
                                <span className="ic--round-play-arrow"></span>
                            </button>
                        </div>
                    </div>
                )): (<></>)}
            </>
        );
    } else{
        return (
            <div className="noRecipe">
            <h3>Aparentemente não temos a receita "{name}"</h3>
            <span className="solar--sad-circle-outline"></span>
            <button className="button" onClick={() => navigate(`/${uuid}/add_receita`)}>
                Criar Receita
            </button>
        </div>
                )
    }
};

export default Receitas_searched;
