import axios from 'axios';

// Create a centralized Axios instance
const axiosInstance = axios.create({
  // Hardcoded the backend URL so it works automatically on Vercel without environment variables
  baseURL: import.meta.env.DEV ? '' : 'https://decisiondevbackend.vercel.app',
});

export default axiosInstance;
