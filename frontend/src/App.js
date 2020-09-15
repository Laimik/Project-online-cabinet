import React from 'react';
import logo from './logo.svg';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dashboard from '../src/Components/Dashboard'
import {BrowserRouter, Route } from 'react-router-dom'
import  Pokazania from './Components/Pokazania'
import LoginForm from './Components/auth/loginForm/loginForm'

import {Provider} from 'react-redux';
import {initStore} from './store'
import {signIn,signUp,logOut}from './store/authActions'
const store = initStore();
//store.dispatch(signUp("pika@chu.poke","pikapika","pikachu", "+7(123)456-78-90"));
//store.dispatch(signIn("pika@chu.poke","pikapika",));
//store.dispatch(logOut());
function App() {
  return (
    <Provider store = {store}>
    <div>
     <BrowserRouter> 
     <Route exact path='/' component={Dashboard} />
     <Route path='/pokazania' component={Pokazania} />    
     <Route path='/auth' component={LoginForm} />
    </BrowserRouter>
  
    

    </div>
    </Provider>
  );
}

export default App;
