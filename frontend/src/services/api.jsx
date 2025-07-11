import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service object with all endpoints
const apiService = {
  // Users API
  users: {
    getAll: () => apiClient.get('/users'),
    getById: (id) => apiClient.get(`/users/${id}`),
    create: (user) => apiClient.post('/users', user),
    update: (id, user) => apiClient.put(`/users/${id}`, user),
    delete: (id) => apiClient.delete(`/users/${id}`),
    search: (query) => apiClient.get(`/users/search?q=${query}`),
    getActive: () => apiClient.get('/users/active'),
  },

  // Products API
  products: {
    getAll: () => apiClient.get('/products'),
    getById: (id) => apiClient.get(`/products/${id}`),
    create: (product) => apiClient.post('/products', product),
    update: (id, product) => apiClient.put(`/products/${id}`, product),
    delete: (id) => apiClient.delete(`/products/${id}`),
    search: (query) => apiClient.get(`/products/search?q=${query}`),
    getByCategory: (category) => apiClient.get(`/products/category/${category}`),
    getFeatured: () => apiClient.get('/products/featured'),
  },

  // Veterinarians API
  veterinarians: {
    getAll: () => apiClient.get('/veterinarians'),
    getById: (id) => apiClient.get(`/veterinarians/${id}`),
    create: (vet) => apiClient.post('/veterinarians', vet),
    update: (id, vet) => apiClient.put(`/veterinarians/${id}`, vet),
    delete: (id) => apiClient.delete(`/veterinarians/${id}`),
    getAvailable: () => apiClient.get('/veterinarians/available'),
  },

  // Appointments API
  appointments: {
    getAll: () => apiClient.get('/appointments'),
    getById: (id) => apiClient.get(`/appointments/${id}`),
    create: (appointment) => apiClient.post('/appointments', appointment),
    update: (id, appointment) => apiClient.put(`/appointments/${id}`, appointment),
    delete: (id) => apiClient.delete(`/appointments/${id}`),
    getByUser: (userId) => apiClient.get(`/appointments/user/${userId}`),
    getByVet: (vetId) => apiClient.get(`/appointments/vet/${vetId}`),
    getToday: () => apiClient.get('/appointments/today'),
    getUpcoming: () => apiClient.get('/appointments/upcoming'),
  },

  // Testimonials API
  testimonials: {
    getAll: () => apiClient.get('/testimonials'),
    getById: (id) => apiClient.get(`/testimonials/${id}`),
    create: (testimonial) => apiClient.post('/testimonials', testimonial),
    update: (id, testimonial) => apiClient.put(`/testimonials/${id}`, testimonial),
    delete: (id) => apiClient.delete(`/testimonials/${id}`),
    getApproved: () => apiClient.get('/testimonials/approved'),
    getFeatured: () => apiClient.get('/testimonials/featured'),
    getPending: () => apiClient.get('/testimonials/pending'),
  },
};

export default apiService;