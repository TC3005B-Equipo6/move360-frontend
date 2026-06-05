import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

// Per-request override for endpoints that recompute a snapshot server-side
// (graph/indicator POST + query-affecting PATCH). SEMOVI detail tables aggregate
// raw rows and can exceed the 5s default; without this the client aborts while the
// backend persists, leaving a stale UI. Default 5s stays for fast endpoints.
export const COMPUTE_TIMEOUT_MS = 60000;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["Content-Type"] = "application/json";

  return config;
});

export default api;