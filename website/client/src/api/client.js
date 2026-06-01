import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('evo-admin-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem('evo-admin-token');
    }
    return Promise.reject(err);
  }
);

export default apiClient;
