import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6868/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token for admin requests
api.interceptors.request.use(
  (config) => {
    // Only attach token if the request is for an admin route or requires auth
    // We can also check if the URL contains '/admin' or similar patterns if needed
    // For now, we'll try to attach it if it exists in localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken'); // Assuming we store it as accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401/403 errors (optional but good practice)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      // window.location.href = '/admin/login'; // careful with infinite loops
    }
    return Promise.reject(error);
  }
);

export default api;
