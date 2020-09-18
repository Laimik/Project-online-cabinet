import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter, Route } from 'react-router-dom';
import LoginForm from './Components/auth/loginForm/loginForm';
import ResetPasswordForm from './Components/auth/resetPasswordForm';
import Profile from "./Screens/Profile";
import Dashboard from "./Screens/Dashboard"
import moment from "moment";
import localization from 'moment/locale/ru';
import Values from "./Screens/Values";

function App() {

    useEffect(() => {
        moment.locale('ru', localization);
    }, []);

    return (
        <BrowserRouter>
            <Route exact path='/' component={Dashboard} />
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
