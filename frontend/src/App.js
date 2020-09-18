import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {BrowserRouter, Route } from 'react-router-dom';
import LoginForm from './Components/auth/loginForm/loginForm';
import ResetPasswordForm from './Components/auth/resetPasswordForm';
import SignIn from "./Screens/SignIn";
import SignUp from "./Screens/SignUp";
import Profile from "./Screens/Profile";
import MainScreen from "./Screens/MainScreen"
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
            <Route exact path='/' component={MainScreen} />
            <Route exact path='/auth' component={LoginForm} />
            <Route exact path='/auth/reset' component={ResetPasswordForm} />
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
