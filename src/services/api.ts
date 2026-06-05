import axios from "axios";
import { auth } from "./auth/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

// Per-request override for endpoints that recompute a snapshot server-side
// (graph/indicator POST + query-affecting PATCH). SEMOVI detail tables aggregate
// raw rows and can exceed the 5s default; without this the client aborts while the
// backend persists, leaving a stale UI. Default 5s stays for fast endpoints.
export const COMPUTE_TIMEOUT_MS = 60000;

// Firebase ID tokens expire after ~1h. The session token captured at login goes
// stale, so we refresh it per-request: `getIdToken()` returns the cached token
// when still valid and only hits the network when it is about to expire. While
// Firebase restores the session on reload `currentUser` is null, so we fall back
// to the localStorage token for that window.
api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("token");

  const user = auth.currentUser;
  if (user) {
    try {
      token = await user.getIdToken();
      localStorage.setItem("token", token);
    } catch {
      // Keep the localStorage token as a fallback if the refresh fails.
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["Content-Type"] = "application/json";

  return config;
});

export default api;