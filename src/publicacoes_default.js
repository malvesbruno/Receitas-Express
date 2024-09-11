import React, { useState, useEffect } from "react";
import { GetPubs } from "./database";
import defaultRecipe from './imgs/th.jpg';

const Publis_default = () => {
    return (
        <>
                <div className="item_recipe default"
                style={{animationDelay: `0.01s`}}>
                    <div className="img_obj default">
                    </div>
                    <div className="desc_obj default">
                        <h1><span className="title_default"></span><br></br><p><span className="date_default"></span></p></h1>
                        <div className="estrelas default">
                            <div className="stars default">
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            </div>
                        </div>
                    </div>
                    <div className="btn_obj default">
                        <button>
                        </button>
                    </div>
                    <div className="magic"></div>
                </div>
                <div className="item_recipe default"
                style={{animationDelay: `0.02s`}}>
                    <div className="img_obj default">
                    </div>
                    <div className="desc_obj default">
                        <h1><span className="title_default"></span><br></br><p><span className="date_default"></span></p></h1>
                        <div className="estrelas default">
                            <div className="stars default">
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            </div>
                        </div>
                    </div>
                    <div className="btn_obj default">
                        <button>
                        </button>
                    </div>
                    <div className="magic"></div>
                </div>
                <div className="item_recipe default"
                style={{animationDelay: `0.03s`}}>
                    <div className="img_obj default">
                    </div>
                    <div className="desc_obj default">
                        <h1><span className="title_default"></span><br></br><p><span className="date_default"></span></p></h1>
                        <div className="estrelas default">
                            <div className="stars default">
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            </div>
                        </div>
                    </div>
                    <div className="btn_obj default">
                        <button>
                        </button>
                    </div>
                    <div className="magic"></div>
                </div>
                <div className="item_recipe default"
                style={{animationDelay: `0.04s`}}>
                    <div className="img_obj default">
                    </div>
                    <div className="desc_obj default">
                        <h1><span className="title_default"></span><br></br><p><span className="date_default"></span></p></h1>
                        <div className="estrelas default">
                            <div className="stars default">
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            <span  className="full-star default"></span>
                            </div>
                        </div>
                    </div>
                    <div className="btn_obj default">
                        <button>
                        </button>
                    </div>
                    <div className="magic"></div>
                </div>
        </>
    );
};

export default Publis_default;
