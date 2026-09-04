import axios from 'axios';
import { auth } from '../config/firebase';

// Uses VITE_API_URL (local dev) or API_URL (Vercel env var without prefix)
// Falls back to localhost for local development
const BASE_URL = import.meta.env.VITE_API_URL 
  || import.meta.env.API_URL 
  || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor for adding the auth token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
