import {getToken} from "./authService";

export async function getCounterValues(options) {
    let url = `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/counter_values`;

    const response = await fetch(
        url, {
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
