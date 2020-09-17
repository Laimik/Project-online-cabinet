const TOKEN_KEY = 'token';

export async function isAuthenticated() {
    return !!(await getToken());
}

export async function signIn(email, password) {
    const response = await fetch(
       // `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/auth/sign_in`, {
       `http://localhost:3000/auth/sign_in`, {
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
        return await json
    }
    else if (response.status === 401) {
        return null
    }
}

export async function signUp(email, password, name, phoneNumber) {
    const response = await fetch(
        //`http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/auth/sign_up`, {
        `http://localhost:3000/auth/sign_up`, {
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

        if (response.ok) {
            return "registred"
          } else if (response.status===302){
            return "dublicate"
          } else {
            alert ("При регистрации возникла ошибка")
          }
}

export async function signOut() {
   localStorage.removeItem(TOKEN_KEY);
}

export async function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}
