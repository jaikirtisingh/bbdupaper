import axios from 'axios';

// In production on Vercel, points to Render backend URL (e.g. https://eduvault-backend.onrender.com/api)
// In local development, falls back to '/api' via Vite proxy
const baseURL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to inject admin JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eduvault_admin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Academic endpoints (Public for Students)
export const getUniversities = () => api.get('/academic/universities');
export const getColleges = (universityId) => api.get(`/academic/universities/${universityId}/colleges`);
export const getCourses = () => api.get('/academic/courses');
export const getBranches = (courseId) => api.get('/academic/branches', { params: { courseId } });
export const getSubjects = (params) => api.get('/academic/subjects', { params });
export const getSubjectById = (id) => api.get(`/academic/subjects/${id}`);
export const getAnnouncements = () => api.get('/academic/announcements');

// Resource endpoints (Public for Students)
export const getResources = (params) => api.get('/resources', { params });
export const getResourceById = (id) => api.get(`/resources/${id}`);
export const recordView = (id) => api.post(`/resources/${id}/view`);
export const recordDownload = (id) => api.post(`/resources/${id}/download`);

// Admin Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const getProfile = () => api.get('/auth/profile');

// Admin Resource Management
export const getAdminStats = () => api.get('/admin/stats');
export const uploadResource = (formData) => api.post('/admin/resources', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateResource = (id, data) => {
  if (data instanceof FormData) {
    return api.put(`/admin/resources/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  return api.put(`/admin/resources/${id}`, data);
};
export const deleteResource = (id) => api.delete(`/admin/resources/${id}`);
export const createSubject = (data) => api.post('/admin/subjects', data);
export const deleteSubject = (id) => api.delete(`/admin/subjects/${id}`);

export default api;
