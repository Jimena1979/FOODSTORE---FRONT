import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "@/shared/api/axiosInstance";

export type UserRole = "user" | "admin";

export interface AuthUser {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: UserRole;
  disabled: boolean;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthState {
  usuario: AuthUser | null;
  cargando: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      login: async (credentials: LoginCredentials) => {
        const formBody = new URLSearchParams();
        formBody.set("username", credentials.username);
        formBody.set("password", credentials.password);

        await axiosInstance.post("/auth/token", formBody, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        const meResponse = await axiosInstance.get<AuthUser>("/auth/me");
        set({ usuario: meResponse.data, cargando: false });
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
        } finally {
          set({ usuario: null, cargando: false });
        }
      },

      checkSession: async () => {
        set({ cargando: true });
        try {
          const response = await axiosInstance.get<AuthUser>("/auth/me");
          set({ usuario: response.data, cargando: false });
        } catch {
          set({ usuario: null, cargando: false });
        }
      },

      clearSession: () => {
        set({ usuario: null, cargando: false });
      },
    }),
    {
      name: "foodstore-auth",
      partialize: (state) => ({ usuario: state.usuario }),
    }
  )
);