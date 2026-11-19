import type { UserRole } from "@/store/authStore";

export interface UsuarioAdminRead {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: UserRole;
  disabled: boolean;
  created_at: string;
}