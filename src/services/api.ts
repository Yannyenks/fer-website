import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, // PHP backend uses API key headers instead of cookies
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
