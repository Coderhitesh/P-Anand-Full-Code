// auth.js

export const getToken = () => sessionStorage.getItem('token');
export const getUser = () => JSON.parse(sessionStorage.getItem('user'));

export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

export const isAdmin = () => {
    const user = getUser();
    return user && user.Role === 'Admin';
};

export const login = (userData) => {
    sessionStorage.setItem('token', userData.token);
    sessionStorage.setItem('user', JSON.stringify(userData.user));
};

export const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
};
