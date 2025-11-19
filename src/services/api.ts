import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // for Sanctum cookie flow
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
