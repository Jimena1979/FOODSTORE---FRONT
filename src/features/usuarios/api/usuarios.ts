import { axiosInstance } from "@/shared/api/axiosInstance";
import type { UsuarioAdminRead } from "../types/usuario";

export async function listarUsuarios(): Promise<UsuarioAdminRead[]> {
  const response = await axiosInstance.get<UsuarioAdminRead[]>(
    "/auth/admin/usuarios"
  );
  return response.data;
}

export async function activarUsuario(id: number): Promise<UsuarioAdminRead> {
  const response = await axiosInstance.post<UsuarioAdminRead>(
    `/auth/admin/usuarios/${id}/activar`
  );
  return response.data;
}

export async function desactivarUsuario(id: number): Promise<UsuarioAdminRead> {
  const response = await axiosInstance.post<UsuarioAdminRead>(
    `/auth/admin/usuarios/${id}/desactivar`
  );
  return response.data;
}
