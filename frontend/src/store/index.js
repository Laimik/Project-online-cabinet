import {createStore} from 'redux';
const reducer =() => {}
export function initStore(preloadedState=undefined){
    return createStore({}, preloadedState)
}