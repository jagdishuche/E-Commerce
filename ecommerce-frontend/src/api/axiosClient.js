import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token
axiosClient.interceptors.request.use(
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

// Response Interceptor: Handle errors and 401 Unauthorized
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // If 401 Unauthorized, token expired or invalid
      if (error.response.status === 401) {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Dispatch custom event so AuthContext can synchronize instantly
          window.dispatchEvent(new Event('auth:unauthorized'));
        }
      }
      return Promise.reject(error.response.data || error.response);
    }
    return Promise.reject({ message: error.message || 'Network error, please check connection' });
  }
);

export default axiosClient;
