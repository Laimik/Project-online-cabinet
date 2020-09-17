import {handleActions}from 'redux-actions';
import {signIn,signUp,logOut} from './authActions'
const initialState = {};

export default handleActions({
    [signIn]:(state,action)=>{
        //console.log(state,action);
        return {sessionInfo:{
            email:action.payload.email,
            accessToken: action.payload.token
        }};
    },
    [signUp]:(state,action)=>{
        //console.log(state,action);
        return {...state,
            sessionInfo:{
            email:action.payload.email,
            accessToken: null
        }};
    },
    [logOut]:(state,action)=>{
        //console.log(state,action);
        return {...state,
            sessionInfo:{
            accessToken: null
        }};
    }
},initialState)