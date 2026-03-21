import axios from 'axios';

// Create a centralized Axios instance
const axiosInstance = axios.create({
  // Use the environment variable if set (production/Vercel), otherwise fallback to relative 
  // path for Vite's local proxy
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
});

export default axiosInstance;
