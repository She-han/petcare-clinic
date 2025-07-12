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
  withCredentials: true,
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

const apiService = {
  // Authentication API
  auth: {
    register: (userData) => apiClient.post('/auth/register', userData),
    login: (credentials) => apiClient.post('/auth/login', credentials),
    getProfile: (id) => apiClient.get(`/auth/profile/${id}`),
    updateProfile: (id, userData) => apiClient.put(`/auth/profile/${id}`, userData),
  },

  // Veterinarians API
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

  // Appointments API
  appointments: {
    getAll: () => apiClient.get('/appointments'),
    getById: (id) => apiClient.get(`/appointments/${id}`),
    create: (appointment) => apiClient.post('/appointments', appointment),
    update: (id, appointment) => apiClient.put(`/appointments/${id}`, appointment),
    delete: (id) => apiClient.delete(`/appointments/${id}`),
    getByVeterinarian: (veterinarianId) => apiClient.get(`/appointments/veterinarian/${veterinarianId}`),
    getByUser: (userId) => apiClient.get(`/appointments/user/${userId}`),
    checkAvailability: (veterinarianId, date, time) => 
      apiClient.get(`/appointments/check-availability?veterinarianId=${veterinarianId}&date=${date}&time=${time}`),
  },

  // Other APIs can be added here
};

export default apiService;