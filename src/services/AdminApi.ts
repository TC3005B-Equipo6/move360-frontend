import axios from "axios";



// Function that help us to the passsword recovery | connect to the admin-back

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL,
  timeout: 5000,
});

adminApi.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/json";
  return config;
});

export default adminApi;