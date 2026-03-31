// api/Axios.js
import Axios from "axios";

let authState = null;
let setAuthState = null;

// helper to access auth outside React
export const initAuthStore = (auth, setAuth) => {
  authState = auth;
  setAuthState = setAuth;
};

const api = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (authState?.accessToken) {
    config.headers.Authorization = `Bearer ${authState.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const res = await Axios.post(
        "/auth/refresh",
        {},
        { withCredentials: true }
      );

      setAuthState((prev) => ({
        ...prev,
        accessToken: res.data.accessToken,
      }));

      originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
