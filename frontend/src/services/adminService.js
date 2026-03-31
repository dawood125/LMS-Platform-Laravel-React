import apiClient from '../helpers/axios';

const adminService = {
    getDashboard: () => apiClient.get('/admin/dashboard'),
    getUsers: (params) => apiClient.get('/admin/users', { params }),
    updateUserRole: (id, data) => apiClient.put(`/admin/users/${id}/role`, data),
    deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
    getCourses: (params) => apiClient.get('/admin/courses', { params }),
    updateCourseStatus: (id, data) => apiClient.put(`/admin/courses/${id}/status`, data),
};

export default adminService;