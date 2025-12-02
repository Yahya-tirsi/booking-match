export const storeToken = (token: string): void => {
    localStorage.setItem('authToken', token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('authToken');
};

export const clearToken = (): void => {
    localStorage.removeItem('authToken');
};

export const isTokenValid = (): boolean => {
    const token = getToken();
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!payload.exp) return true;
        return payload.exp > Math.floor(Date.now() / 1000);
    } catch {
        return false;
    }
};