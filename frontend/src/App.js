import React from 'react';
import logo from './logo.svg';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dashboard from '../src/Components/Dashboard'
import {BrowserRouter, Route } from 'react-router-dom'
import  Pokazania from './Components/Pokazania'


function App() {
  return (
    <div>
     <BrowserRouter> 
     <Route exact path='/' component={Dashboard} />
     <Route path='/pokazania' component={Pokazania} />    
    
    </BrowserRouter>
  
    

    </div>
  );
}

export default App;
