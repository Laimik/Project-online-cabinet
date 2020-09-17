import {getToken} from "./authService";

export async function getCounterValues(counter) {
    const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/counters/${counter.id}/values`, {
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
        return [];
    }
}

export async function getCounterValueById(counter, id) {
    const response = await fetch(
        `http://${process.env.EACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/${counter.id}/value/${id}`,
        {
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

export async function createCounterValue(counter, value) {
    const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/counters/${counter.id}/values`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getToken()
            },
            body: JSON.stringify({
                value
            }),
        });

    if (!response.ok){
        //ToDo обработка ошибок регистрации
        //throw new Error( await response.json);
    }
}