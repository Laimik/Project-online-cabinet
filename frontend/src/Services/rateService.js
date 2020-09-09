import {getToken} from "./authService";

export async function getRate() {
    const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/rate/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getToken()
            }
        });
    if (response.ok){
        return await response.json();
    } else {
        return null;
    }
}

export async function getRateById(id) {
    const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/rate/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getToken()
            }
        });
    if (response.ok){
        return await response.json();
    } else {
        return null;
    }
}