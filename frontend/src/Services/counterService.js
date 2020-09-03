import {getToken} from "./authService";

export async function getCounters() {
    const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/counters`, {
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

export async function getCounterById(id) {
    const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/counters/${id}`,
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

export async function updateCounter(counter) {
    const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/addresses/${counter.id}`,
        {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getToken()
            },
            body: JSON.stringify({
                name: counter.name,
            }),
        });
    if (!response.ok){
        //ToDo обработка ошибок обновления
        //throw new Error( await response.json);
    }
}