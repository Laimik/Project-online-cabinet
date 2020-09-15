import {createStore, combineReducers} from 'redux';
import authReducer from './authReducer'
const reducer = combineReducers({auth: authReducer}) ;
export function initStore(preloadedState=undefined){
    return createStore(reducer, preloadedState)
}