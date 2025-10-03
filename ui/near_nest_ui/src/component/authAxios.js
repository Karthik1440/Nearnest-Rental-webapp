import axios from "axios";
import Cookies from "js-cookie";

const authAxios = axios.create({
  baseURL: "http://localhost:8000",
});

// Request interceptor to add access token header
authAxios.interceptors.request.use((config) => {
  const accessToken = Cookies.get("access");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor to handle token expiration
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refresh");
      if (refreshToken) {
        try {
          // Call refresh endpoint
          const response = await axios.post("/api/token/refresh/", {
            refresh: refreshToken,
          });
          // Save new access token
          Cookies.set("access", response.data.access);
          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh token failed (expired or invalid)
          Cookies.remove("access");
          Cookies.remove("refresh");
          window.location.href = "/login"; // Redirect to login
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default authAxios;
