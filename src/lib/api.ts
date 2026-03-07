import axios, { type AxiosRequestConfig } from "axios";

const TOKEN_KEY = "foda_access_token";
const SESSION_KEY = "foda_session";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send HTTP-only refresh token cookie automatically
  headers: { "Content-Type": "application/json" },
});

// ── Request: attach Bearer token ──────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: silent token refresh on 401, then normalise errors ──────────────
type QueueEntry = { resolve: (t: string) => void; reject: (e: unknown) => void };
let refreshing = false;
let waitQueue: QueueEntry[] = [];

function drainQueue(err: unknown, token: string | null) {
  waitQueue.forEach(({ resolve, reject }) => (err ? reject(err) : resolve(token!)));
  waitQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config as AxiosRequestConfig & { _retry?: boolean };
    const status: number | undefined = err.response?.status;

    // ── Silent token refresh on 401 ──────────────────────────────────────────
    const isRefreshRoute = original.url?.includes("/auth/refresh");
    if (status === 401 && !original._retry && !isRefreshRoute) {
      // Queue subsequent 401s while a refresh is already running
      if (refreshing) {
        return new Promise<string>((resolve, reject) =>
          waitQueue.push({ resolve, reject }),
        ).then((token) => {
          if (original.headers) {
            original.headers["Authorization"] = `Bearer ${token}`;
          }
          return api(original);
        });
      }

      original._retry = true;
      refreshing = true;

      try {
        const { data } = await axios.get<{ accessToken: string }>(
          `${BASE_URL}/auth/refresh`,
          { withCredentials: true },
        );
        setStoredToken(data.accessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        drainQueue(null, data.accessToken);
        if (original.headers) {
          original.headers["Authorization"] = `Bearer ${data.accessToken}`;
        }
        return api(original);
      } catch (refreshErr) {
        drainQueue(refreshErr, null);
        // Session expired — clear local state so UI re-renders as logged out
        removeStoredToken();
        return Promise.reject(
          new Error("Session expired. Please log in again."),
        );
      } finally {
        refreshing = false;
      }
    }

    // ── Normalise all other errors to a plain message string ─────────────────
    const message: string =
      err?.response?.data?.error?.message ??
      err?.response?.data?.message ??
      err?.message ??
      "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default api;
