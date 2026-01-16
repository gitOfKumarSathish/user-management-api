import axios from 'axios';

// Create Axios instance with base configuration
const client = axios.create({
    baseURL: 'http://localhost:4000/api', // Adjusted to include /api as seen in services/api.js
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Optional: Handle unauthorized access globally if needed
        }
        return Promise.reject(error);
    }
);

// ============================================================================
// Authentication API
// Handles login, registration, and user session retrieval
// ============================================================================
const authApi = {
    login: (credentials) => client.post('/auth/sign-in', credentials),
    signUp: (data) => client.post('/auth/sign-up', data),
    register: (data) => client.post('/auth/register', data),
    // getMe is used for profile card and auth check (if API supports it for initial load)
    getMe: () => client.get('/users/me'),
    getCurrentUser: () => client.get('/admin/users'),
    changePassword: (data) => client.patch('/auth/change-password', data),
};

// ============================================================================
// User Management API
// Handles user CRUD operations, profile updates, and password changes
// ============================================================================
const userApi = {
    // Admin User CRUD
    getAll: (page = 1, limit = 10) => client.get(`/admin/users?page=${page}&limit=${limit}`),
    create: (data) => client.post('/admin/users', data),
    update: (id, data) => client.put(`/admin/users/${id}/update`, data),
    deactivate: (id) => client.post(`/admin/users/${id}/deactivate`),
    activate: (id) => client.post(`/admin/users/${id}/activate`),
    delete: (id) => client.delete(`/admin/users/${id}/delete`),

    // User Profile Management
    updateProfile: (data) => client.patch(`/admin/users/${data.id}/update`, data),
    changePassword: (data) => client.patch('/auth/change-password', data),
};

// Combine for export
const api = {
    auth: authApi,
    user: userApi
};

export default api;
