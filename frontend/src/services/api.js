import axios from 'axios';
import { auth } from '../config/firebase';

// VITE_API_URL must be set in Vercel / hosting env vars pointing to your Render backend.
// Only VITE_-prefixed vars are injected into the browser bundle by Vite.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
