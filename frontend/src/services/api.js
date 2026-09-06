import axios from 'axios';
import { auth } from '../config/firebase';

// Determine the API URL based on environment.
// Fallback to Render URL in production, localhost in development.
const isProd = import.meta.env.PROD; // true when deployed on Vercel
const defaultApiUrl = isProd 
  ? 'https://threadly-kzgs.onrender.com/api' 
  : 'http://localhost:5000/api';

const BASE_URL = import.meta.env.VITE_API_URL || defaultApiUrl;

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
