
import axios, { type AxiosInstance } from "axios";

export const createAPI = (path: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_FRONTEND_URI}/${path}`,
    withCredentials: true,
  });

 
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

 
  instance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshRes = await axios.post(
            `${import.meta.env.VITE_FRONTEND_URI}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const newAccessToken = refreshRes.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return instance(originalRequest);
        } catch (refreshErr) {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(err);
    }
  );

  return instance;
};
