import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to automatically add token from cookie
api.interceptors.request.use((config) => {
  // Get token from cookie
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear cookies and redirect to login
      document.cookie = 'token=; path=/; max-age=-1';
      document.cookie = 'user=; path=/; max-age=-1';
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;