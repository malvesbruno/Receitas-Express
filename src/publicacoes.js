import React, { useState, useEffect, useRef } from "react";
import { GetPubs, GetMorePubs } from "./database";
import defaultRecipe from './imgs/th.jpg';
import Publis_default from "./publicacoes_default";
import { useNavigate } from "react-router-dom";

const Publis = ({ clickNavigate, uuid }) => {
    const [receitas, setReceitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastVisible, setLastVisible] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false); // Para controlar o estado de carregamento
    const lastItemRef = useRef(null);
    const [cont, setCont] = useState(10)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loadreceita = await GetPubs(cont);
                setCont(cont + 10)
                if (loadreceita.length > 0) {
                    setReceitas(loadreceita);
                    setLastVisible(loadreceita[loadreceita.length - 1].id);
                }
            } catch (error) {
                console.error("Failed to fetch recipes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!lastItemRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !loadingMore && lastVisible) {
                    loadMoreRecipes();
                }
            },
            { threshold: 1.0 } // O último item deve estar totalmente visível para carregar mais receitas
        );

        observer.observe(lastItemRef.current);

        return () => {
            if (lastItemRef.current) {
                observer.unobserve(lastItemRef.current);
            }
        };
    }, [lastVisible, loadingMore]);

    const loadMoreRecipes = async () => {
        setLoadingMore(true);
        try {
            const moreReceitas = await GetMorePubs(lastVisible, receitas, cont);
            setCont(cont + 10)
            if (moreReceitas.length > 0) {
                setReceitas(prevReceitas => [...prevReceitas, ...moreReceitas]);
                setLastVisible(moreReceitas[moreReceitas.length - 1].id);
            }
        } catch (error) {
            console.error("Failed to load more recipes", error);
        } finally {
            setLoadingMore(false);
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

    if (loading) {
        return <Publis_default />;
    }
    
    if (receitas.length > 0) {
        return (
            <div className="recipes-container">
                {receitas.map((recipe, index) => (
                    <div
                        className="item_recipe"
                        key={recipe.Nome}
                        ref={index === receitas.length - 1 ? lastItemRef : null}
                        id={recipe.id}
                    >
                        <div className="img_obj">
                            {recipe.url? (<><img src={recipe.url || defaultRecipe} alt={recipe.Nome} /></>):(<><img src={defaultRecipe} alt={recipe.Nome} /></>)}
                        </div>
                        <div className="desc_obj">
                            <h1>{recipe.Nome[0].toUpperCase() + recipe.Nome.substring(1)}<br /> <p>{recipe.data}</p></h1>
                            <div className="estrelas">
                                <div className="stars">
                                    {getStars(recipe.quantidadeAvaliacao, recipe.totalAvaliacao)}
                                </div>
                            </div>
                        </div>
                        <div className="btn_obj">
                            <button onClick={() => clickNavigate(recipe.id, uuid)}>
                                <span className="ic--round-play-arrow"></span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    } else {
        return (
            <div className="noRecipe">
                <h3>Aparentemente não há receitas aqui</h3>
                <span className="solar--sad-circle-outline"></span>
                <button className="button" onClick={() => navigate(`/${uuid}/add_receita`)}>
                    Criar Receita
                </button>
            </div>
        );
    }
};

export default Publis;
