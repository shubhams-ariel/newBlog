import axios, { type AxiosInstance } from "axios";
import { jwtDecode } from "jwt-decode";

export const createAPI = (path: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_FRONTEND_URI}/${path}`, 
    withCredentials: true,
  });

  instance.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decoded: { exp: number } = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp - currentTime < 10) {
          const refreshRes = await axios.post(
            `${import.meta.env.VITE_FRONTEND_URI}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newAccessToken = refreshRes.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);

          if (config.headers) config.headers.Authorization = `Bearer ${newAccessToken}`;
        } else {
          if (config.headers) config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Token error:", err);
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return config;
  });

  return instance;
};
