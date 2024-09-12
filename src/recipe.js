import React, { useState, useEffect, useRef } from "react";
import { GetProfile, UpdateRecipeRate, UpdateRecipesLiked } from "./database";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GetThePub } from "./database";
import avatar1 from './imgs/avatar/avatar1.png';
import avatar2 from './imgs/avatar/avatar2.png';
import avatar3 from './imgs/avatar/avatar3.png';
import avatar4 from './imgs/avatar/avatar4.png';
import avatar5 from './imgs/avatar/avatar5.png';
import avatar6 from './imgs/avatar/avatar6.png';
import avatar7 from './imgs/avatar/avatar7.png';
import avatar8 from './imgs/avatar/avatar8.png';
import avatar9 from './imgs/avatar/avatar9.png';
import defaultRecipe from './imgs/th.jpg';

const Recipe_Area = ({ nome, url, data, modo_preparo, ingredientes, usúario, totalAvalicao, quantidadeAvaliacao, setLoading}) => {
    const [ingredienteList, setIngredienteList] = useState([]);
    const [PreparoList, setPreparoList] = useState([]);
    const [User, setUser] = useState([]);
    const [UserName, setUserName] = useState('user');
    const [UserAvatar, setUserAvatar] = useState(1);
    const [currentUserRating, setCurrentUserRating] = useState(0); // Guarda a avaliação do usuário
    const star1 = useRef(null);
    const star2 = useRef(null);
    const star3 = useRef(null);
    const star4 = useRef(null);
    const star5 = useRef(null);
    const mensagem_star_ref = useRef(null)
    const topRef = useRef(null)
    const starsRef = useRef(null)
    const navigate = useNavigate();
    const { uuid } = useParams();
    const { id } = useParams();

    if (!url) url = defaultRecipe;

    useEffect(() => {
        const fetchIngredients = async () => {
            if (ingredientes) {
                const result = await split(ingredientes);
                setIngredienteList(result);
            }
        };
        fetchIngredients();
    }, [ingredientes]);

    useEffect(() => {
        const fetchPreparo = async () => {
            if (modo_preparo) {
                const result = await split(modo_preparo);
                setPreparoList(result);
            }
        };
        fetchPreparo();
    }, [modo_preparo]);

    useEffect(() => {
        const fetchData = async () => {
            if (usúario) {
                const loaduser = await GetProfile(usúario);
                setUser(loaduser)
                setUserName(loaduser[0]['Nome'])
                switch (loaduser[0]['PP']) {
                    case 1: setUserAvatar(avatar1); break;
                    case 2: setUserAvatar(avatar2); break;
                    case 3: setUserAvatar(avatar3); break;
                    case 4: setUserAvatar(avatar4); break;
                    case 5: setUserAvatar(avatar5); break;
                    case 6: setUserAvatar(avatar6); break;
                    case 7: setUserAvatar(avatar7); break;
                    case 8: setUserAvatar(avatar8); break;
                    case 9: setUserAvatar(avatar9); break;
                    default: setUserAvatar(avatar1);
                };
            }
        };
        fetchData();
    }, [usúario]);

    // Nova função para buscar a avaliação do usuário
    useEffect(() => {
        const fetchUserRating = async () => {
            if (uuid && id) {
                const user = await GetProfile(uuid);
                if (user && user.length > 0) {
                    const receitas_liked = user[0]['Receitas'] ? JSON.parse(user[0]['Receitas']) : [];
                    const existingRate = receitas_liked.find(recipe => recipe.id === id);
                    if (existingRate) {
                        setCurrentUserRating(existingRate.rate); // Define a avaliação do usuário
                        updateStars(existingRate.rate); // Atualiza as estrelas na tela
                    }
                }
            }
        };
        fetchUserRating();
    }, [uuid, id]);


    const split = async (str) => str.split(/[;&]+/).map(ing => ing.trim()).slice(0, -1);

    

    const updateStars = (count) => {
        for (let i = 1; i <= 5; i++) {
            const star = `star${i}`;
            const ref = eval(star);
            if (i <= count) {
                ref.current.classList.remove('empty-star');
                ref.current.classList.add('full-star');
                ref.current.style.transform = 'scale(120%)';
            } else {
                ref.current.classList.remove('full-star');
                ref.current.classList.add('empty-star');
                ref.current.style.transform = 'scale(100%)';
            }
        }
    };

    const showMessage = async() =>{
        const message = mensagem_star_ref
        message.current.classList.remove('hidden');
        setTimeout(() => {
            message.current.classList.add('hidden');
            }, 3000);
            }

            const handleStarClick = async (count) => {
                if (typeof(uuid) !== 'undefined') {
                    try {
                        const recipe = await GetThePub(id);
                        if (topRef.current) {
                            topRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
                        }
                        setLoading(true);
                        if (recipe) {
                            let quantidadeAvaliacao = recipe.quantidadeAvaliacao || 0;
                            let totalAvalicao = recipe.totalAvalicao || 0;
                            console.log("Valor da nova avaliação (count):", count);
                            console.log("Total antes de somar nova avaliação:", totalAvalicao);
                            totalAvalicao += count;
                            console.log("Total após somar nova avaliação:", totalAvalicao);
            
                            const user = await GetProfile(uuid);
                            if (user && user.length > 0) {
                                let receitas_liked = user[0]['Receitas'] ? JSON.parse(user[0]['Receitas']) : [];
                                const existingRateIndex = receitas_liked.findIndex(r => r.id === id);
            
                                // Se o usuário já avaliou a receita antes
                                if (existingRateIndex !== -1) {
                                    // Subtrair a avaliação anterior do total
                                    const previousRate = receitas_liked[existingRateIndex].rate;
                                    totalAvalicao -= previousRate;
            
                                    // Adicionar a nova avaliação ao total
                                    totalAvalicao += count;
            
                                    // Atualizar a avaliação do usuário
                                    receitas_liked[existingRateIndex].rate = count;
                                } else {
                                    // Nova avaliação: incrementar quantidade e somar nova avaliação ao total
                                    quantidadeAvaliacao += 1;
                                    totalAvalicao += count;
            
                                    receitas_liked.push({ id: id, rate: count });
                                }
            
                                if (starsRef.current) {
                                    starsRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
                                }
                                 // Atualizar a receita com a nova avaliação total e quantidade de avaliações
                                 await UpdateRecipeRate(id, totalAvalicao, quantidadeAvaliacao);
            
                                 // Atualizar o perfil do usuário com as receitas avaliadas
                                 await UpdateRecipesLiked(uuid, JSON.stringify(receitas_liked));
                                setLoading(false);
                                await showMessage();
            
                                // Atualizar a avaliação atual do usuário no estado
                                setCurrentUserRating(count);
                                console.log("Valor da nova avaliação (count):", count);
                                console.log("Total antes de somar nova avaliação:", totalAvalicao);
                                totalAvalicao += count;
                                console.log("Total após somar nova avaliação:", totalAvalicao);
                            }
                        }
                    } catch (error) {
                        console.error('Erro ao atualizar receitas curtidas:', error);
                    }
                } else {
                    navigate('/SignUp');
                }
            };

    return (
        <>
            <div className="paper">
            <div className="recipe_area">
                <div className="img_recipe_area" ref={topRef}>
                    <img src={url} alt="Recipe" />
                </div>
                <h1>{nome}</h1>
                <h3>Ingredientes</h3>
                <div className="place_ingrediente">
                    <div className="recipe_ingrediente">
                        {ingredienteList.map(el => (
                            <p key={el} className="list">- {el}</p>
                        ))}
                    </div>
                </div>
                <h3>Modo de Preparo</h3>
                <div className="place_ingrediente">
                    <div className="recipe_ingrediente">
                        {PreparoList.map(el => (
                            <p key={el} className="list">- {el}</p>
                        ))}
                    </div>
                </div>
                <div className="mensagem_star hidden" ref={mensagem_star_ref}>
                    <h1>Avaliação Atualizada</h1>
                </div>
                <div className="rate">
                <p>Deixe sua Avaliação</p>
                <div className="estrelas">
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <span
                                    key={i}
                                    className="empty-star"
                                    ref={eval(`star${i + 1}`)}
                                    onMouseOver={() => updateStars(i + 1)}
                                    onClick={() => handleStarClick(i + 1)}
                                ></span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="footer_recipe" ref={starsRef}>
                    <div className="footer_recipe_left">
                        <img src={UserAvatar} alt="User Avatar" />
                    </div>
                    <div className="footer_recipe_right">
                        <h3>{UserName}</h3>
                        <p>{data}</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Recipe_Area;