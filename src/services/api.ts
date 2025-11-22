import axios from 'axios';

// Toujours utiliser /api (relatif)
// En dev: proxy Vite redirige vers localhost:8000
// En prod: .htaccess redirige vers server/index.php
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, // PHP backend uses API key headers instead of cookies
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
