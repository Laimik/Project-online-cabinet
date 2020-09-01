export async function isAuthenticated() {
    return !!(await getToken());
}

export async function signIn(email, password) {
    const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/auth/sign_in`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

    if (response.ok){
        const json = await response.json();
        await setToken(json.accessToken);
    }
}

export async function signUp(email, password, name, phoneNumber) {
    const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/auth/sign_up`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                name,
                phone_number: phoneNumber
            }),
        });

    if (!response.ok){
        //ToDo обработка ошибок регистрации
        //throw new Error( await response.json);
    }
}

export async function setToken(token) {
    localStorage.setItem('token', token);
}

export async function getToken() {
    return localStorage.getItem('token');
}