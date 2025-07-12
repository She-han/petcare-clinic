import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor to handle the new response format
apiClient.interceptors.response.use(
  (response) => {
    // If the response has the new format with success/data structure
    if (response.data && response.data.hasOwnProperty('success') && response.data.hasOwnProperty('data')) {
      // Return the data directly for easier use in components
      return {
        ...response,
        data: response.data.data, // Extract the actual data
        success: response.data.success,
        message: response.data.message
      };
    }
    return response;
  },
  (error) => {
    // Handle errors
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API service object with all endpoints
const apiService = {
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

getByEmail: (email) => apiClient.get(`/veterinarians/email/${email}`),

// Complete veterinarians API section:
veterinarians: {
  getAll: () => apiClient.get('/veterinarians'),
  getById: (id) => apiClient.get(`/veterinarians/${id}`),
  getByEmail: (email) => apiClient.get(`/veterinarians/email/${email}`),
  create: (veterinarian) => apiClient.post('/veterinarians', veterinarian),
  update: (id, veterinarian) => apiClient.put(`/veterinarians/${id}`, veterinarian),
  delete: (id) => apiClient.delete(`/veterinarians/${id}`),
  search: (query) => apiClient.get(`/veterinarians/search?q=${query}`),
  getBySpecialization: (specialization) => apiClient.get(`/veterinarians/specialization/${specialization}`),
  getAvailable: () => apiClient.get('/veterinarians/available'),
  getSpecializations: () => apiClient.get('/veterinarians/specializations'),
},

  // Users API
  users: {
    getAll: () => apiClient.get('/users'),
    getById: (id) => apiClient.get(`/users/${id}`),
    create: (user) => apiClient.post('/users', user),
    update: (id, user) => apiClient.put(`/users/${id}`, user),
    delete: (id) => apiClient.delete(`/users/${id}`),
    search: (query) => apiClient.get(`/users/search?q=${query}`),
  },
};

export default apiService;