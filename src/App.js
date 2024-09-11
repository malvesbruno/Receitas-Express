import logo from './logo.svg';
import './App.css';
import React from 'react';
import Home from './home';
import HomeEditar from './home_editar';

import {BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Receita from './receita';
import SignUpPage from './SignUp';
import AddReceita from './add_receita';
import EditReceita from './EditarReceita';
import HomeReceitasLiked from './home_receitasLiked';
import HomeSearch from './home_search';
import EditUser from './EditarPerfil';
import Reset_senha from './reset_senha';


function App() {
  return (
  <Router>
  <div>
    <Routes>
      <Route path="/" element={<Home></Home>} />
      <Route path='/receita/:id' element={<Receita></Receita>}></Route>
      <Route path='/SignUp' element={<SignUpPage></SignUpPage>}></Route>
      <Route path="/reset_senha" element={<Reset_senha></Reset_senha>} />
      <Route path='/:uuid/home' element={<Home></Home>}></Route>
      <Route path='/:uuid/add_receita' element={<AddReceita></AddReceita>}></Route>
      <Route path='/:uuid/receita/:id' element={<Receita></Receita>}></Route>
      <Route path='/:uuid/receitas_editar/' element={<HomeEditar></HomeEditar>}></Route>
      <Route path='/:uuid/editar_receita/:id' element={<EditReceita></EditReceita>}></Route>
      <Route path='/:uuid/receitas_curtidas/' element={<HomeReceitasLiked></HomeReceitasLiked>}></Route>
      <Route path='/:uuid/search_for/:name' element={<HomeSearch></HomeSearch>}></Route>
      <Route path='/:uuid/edit-user' element={<EditUser></EditUser>}></Route>
    </Routes>
  </div>
</Router>
  )
}

export default App;
