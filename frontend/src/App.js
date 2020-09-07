import React from 'react';
import logo from './logo.svg';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dashboard from '../src/Components/Dashboard'
import {BrowserRouter, Route } from 'react-router-dom'
import  Pokazania from './Components/Pokazania'
import SignIn from "./Screens/SignIn";
import SignUp from "./Screens/SignUp";
import Profile from "./Screens/Profile";
import Feedback from "./Screens/Feedback";


function App() {
    return (
        <BrowserRouter>
            <Route exact path='/sign_in' component={SignIn} />
            <Route exact path='/sign_up' component={SignUp} />
            <Route exact path='/' component={Dashboard} />
            <Route path='/pokazania' component={Pokazania} />
            <Route path='/profile' component={Profile}/>
            <Route path={'/feedback'} component={Feedback}/>
        </BrowserRouter>
    );
}

export default App;
