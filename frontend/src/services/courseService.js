import apiClient from '../helpers/axios';

const courseService = {
    
    getCategories: () => apiClient.get('/categories'),
    getLevels: () => apiClient.get('/fetch-levels'),
    getLanguages: () => apiClient.get('/fetch-languages'),
    getFeaturedCourses: () => apiClient.get('/featured-courses'),
    getCourses: (params) => apiClient.get('/fetch-courses', { params }),
    getCourseDetails: (id) => apiClient.get(`/course-details/${id}`),

    
    enrollCourse: (data) => apiClient.post('/enroll-course', data),
    getEnrollments: () => apiClient.get('/enrollments'),
    getCourseAccess: (id) => apiClient.get(`/course-access/${id}`),

  
    getMyCourses: () => apiClient.get('/my-courses'),
    getMetaData: () => apiClient.get('/courses/metadata'),
    createCourse: (data) => apiClient.post('/courses', data),
    getCourse: (id) => apiClient.get(`/courses/${id}`),
    updateCourse: (id, data) => apiClient.put(`/courses/${id}`, data),
    saveCourseImage: (id, data) => apiClient.post(`/save-course-image/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    changeCourseStatus: (id) => apiClient.post(`/change-course-status/${id}`),
    deleteCourse: (id) => apiClient.delete(`/courses/${id}`),

    getChapters: (courseId) => apiClient.get('/chapters', { params: { course_id: courseId } }),
    createChapter: (data) => apiClient.post('/chapters', data),
    updateChapter: (id, data) => apiClient.put(`/chapters/${id}`, data),
    deleteChapter: (id) => apiClient.delete(`/chapters/${id}`),

    getLessons: (chapterId) => apiClient.get('/lessons', { params: { chapter_id: chapterId } }),
    createLesson: (data) => apiClient.post('/lessons', data),
    getLesson: (id) => apiClient.get(`/lessons/${id}`),
    updateLesson: (id, data) => apiClient.put(`/lessons/${id}`, data),
    deleteLesson: (id) => apiClient.delete(`/lessons/${id}`),
    saveLessonVideo: (id, data) => apiClient.post(`/save-lesson-video/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    getOutcomes: (courseId) => apiClient.get('/outcomes', { params: { course_id: courseId } }),
    createOutcome: (data) => apiClient.post('/outcomes', data),
    updateOutcome: (id, data) => apiClient.put(`/outcomes/${id}`, data),
    deleteOutcome: (id) => apiClient.delete(`/outcomes/${id}`),

    getRequirements: (courseId) => apiClient.get('/requirements', { params: { course_id: courseId } }),
    createRequirement: (data) => apiClient.post('/requirements', data),
    updateRequirement: (id, data) => apiClient.put(`/requirements/${id}`, data),
    deleteRequirement: (id) => apiClient.delete(`/requirements/${id}`),
};

export default courseService;