import axios from 'axios';

// Automatically normalize baseURL: ensure /api suffix and strip trailing slashes
let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
rawBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '');
if (!rawBaseUrl.endsWith('/api')) {
  rawBaseUrl = `${rawBaseUrl}/api`;
}
const API_BASE_URL = rawBaseUrl;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request Interceptor: Attach JWT Token only when valid and not on login/register
axiosClient.interceptors.request.use(
  (config) => {
    const isAuthEndpoint = config.url && (config.url.includes('/auth/login') || config.url.includes('/auth/register'));
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null' && !isAuthEndpoint) {
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
      const data = error.response.data;
      const message = (data && (data.message || data.error)) || 'Authentication error';
      return Promise.reject({ message, status: error.response.status, ...data });
    }
    return Promise.reject({ message: error.message || 'Network error, please check connection' });
  }
);

export default axiosClient;
