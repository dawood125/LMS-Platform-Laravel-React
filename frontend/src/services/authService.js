import apiClient from '../helpers/axios';

const authService = {
    register: (data) => apiClient.post('/register', data),
    login: (data) => apiClient.post('/login', data),
    logout: () => apiClient.post('/logout'),
    getUser: () => apiClient.get('/user'),
};

export default authService;