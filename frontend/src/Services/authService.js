export function isAuthenticated() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(false);
        }, 500)
    });
}