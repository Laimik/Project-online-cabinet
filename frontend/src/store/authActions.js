import {createActions} from "redux-actions"

export const {signIn, signUp, logOut }=createActions({
    SIGN_IN: (email,token) => ({email, token}),
    SIGN_UP: (email) => ({email}),
    LOG_OUT:()=>{},
})