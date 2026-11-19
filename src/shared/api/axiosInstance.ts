import axios from "axios";
import { useAuthStore } from "@/store/authStore";

interface ErrorResponseData {
  detail?: unknown;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<ErrorResponseData>(error)) {
      const status = error.response?.status;
      const detail = error.response?.data?.detail;
      const requestUrl = error.config?.url ?? "";

      const esRutaAuthExcluida =
        requestUrl.includes("/auth/token") || requestUrl.includes("/auth/me");

      const cuentaDesactivada =
        status === 400 && detail === "Cuenta de usuario desactivada";

      if ((!esRutaAuthExcluida && status === 401) || cuentaDesactivada) {
        useAuthStore.getState().clearSession();
        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
      }
    }
    return Promise.reject(error);
  }
);