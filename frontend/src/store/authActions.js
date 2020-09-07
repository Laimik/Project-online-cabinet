import {createActions} from "redux-actions"

export const {loginUser,registerNewUser }=createActions({
    LOGIN_USER: (email,password) => ({email, password}),
    REGISTER_NEW_USER: (email,password) => ({email, password}),
})