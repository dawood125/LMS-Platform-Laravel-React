import apiClient from '../helpers/axios';

const authService = {
    register: (data) => apiClient.post('/register', data),
    login: (data) => apiClient.post('/login', data),
    logout: () => apiClient.post('/logout'),
    getUser: () => apiClient.get('/user'),
    getProfile: () => apiClient.get('/profile'),
    updateProfile: (data) => apiClient.put('/profile', data),
    changePassword: (data) => apiClient.post('/change-password', data),
};

export default authService;