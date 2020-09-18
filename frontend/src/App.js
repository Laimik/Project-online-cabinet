import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dashboard from '../src/Components/Dashboard'
import {BrowserRouter, Route } from 'react-router-dom'
import  Pokazania from './Components/Pokazania'

import LoginForm from './Components/auth/loginForm/loginForm'
import ResetPasswordForm from './Components/auth/loginForm/resetPasswordForm'

import SignIn from "./Screens/SignIn";
import SignUp from "./Screens/SignUp";
import Profile from "./Screens/Profile";
import moment from "moment";
import localization from 'moment/locale/ru';
import Values from "./Screens/Values";



function App() {

    useEffect(() => {
        moment.locale('ru', localization);
    }, []);

    return (
        <BrowserRouter>
            <Route exact path='/sign_in' component={SignIn} />
            <Route exact path='/sign_up' component={SignUp} />
            <Route exact path='/auth' component={LoginForm} />
            <Route exact path='/auth/reset' component={ResetPasswordForm} />
            <Route exact path='/' component={Dashboard} />
            <Route path='/pokazania' component={Pokazania} />
            <Route path='/profile' component={Profile}/>
            <Route path='/gas' render={(props) => (
                <Values {...props} types={['Газ']} />
            )}/>
            <Route path='/electricity' render={(props) => (
                <Values {...props} types={['Электричество']} />
            )}/>
            <Route path='/water' render={(props) => (
                <Values {...props} types={['Холодная вода', 'Горячая вода']} />
            )}/>
        </BrowserRouter>
    );
}

export default App;
