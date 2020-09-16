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
const store = initStore();

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
