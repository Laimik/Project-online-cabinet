import {getToken} from "./authService";

export async function getHistory(options) {
    let url = `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/stats/history`;
    let parameters = '';
    if (options) {
        if (options.addresses) {
            parameters +=  options.addresses.map(address => `addresses[]=${address.id}`).join('&');
        }

        if (options.counterTypes) {
            if (parameters) parameters += '&'
            parameters +=  options.counterTypes.map(counterType => `counter_types[]=${counterType.id}`).join('&');
        }

        if (options.counters) {
            if (parameters) parameters += '&'
            parameters +=  options.counters.map(counter => `counters[]=${counter.id}`).join('&');
        }

        if (parameters) url = url + '?' + parameters;
    }

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

export async function getDynamic(options) {
    let url = `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/stats/dynamic`;
    let parameters = '';
    if (options) {
        if (options.addresses) {
            parameters +=  options.addresses.map(address => `addresses[]=${address.id}`).join('&');
        }

        if (options.counterTypes) {
            if (parameters) parameters += '&'
            parameters +=  options.counterTypes.map(counterType => `counter_types[]=${counterType.id}`).join('&');
        }

        if (options.counters) {
            if (parameters) parameters += '&'
            parameters +=  options.counters.map(counter => `counters[]=${counter.id}`).join('&');
        }

        if (parameters) url = url + '?' + parameters;
    }

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