import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging for mobile
    if (window.innerWidth <= 768) {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        hasToken: !!token,
        headers: config.headers
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Debug logging for mobile
    if (window.innerWidth <= 768) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    
    // If it's a 401 error, try without authentication as fallback
    if (error.response?.status === 401) {
      // Check if this is a retry attempt
      if (!error.config._retry) {
        error.config._retry = true;
        delete error.config.headers.Authorization;
        
        // Debug logging for mobile
        if (window.innerWidth <= 768) {
          console.log('Retrying request without authentication:', error.config.url);
        }
        
        return apiClient.request(error.config);
      } else {
        // If retry also failed, clear auth and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuth');
        window.location.href = '/signin';
      }
    }
    
    return Promise.reject(error);
  }
); 