import { axiosInstance } from "@/shared/api/axiosInstance";
import type { UsuarioAdminRead } from "../types/usuario";

export async function listarUsuarios(): Promise<UsuarioAdminRead[]> {
  const response = await axiosInstance.get<UsuarioAdminRead[]>(
    "/admin/usuarios"
  );
  return response.data;
}

export async function activarUsuario(id: number): Promise<UsuarioAdminRead> {
  const response = await axiosInstance.post<UsuarioAdminRead>(
    `/admin/usuarios/${id}/activar`
  );
  return response.data;
}

export async function desactivarUsuario(id: number): Promise<UsuarioAdminRead> {
  const response = await axiosInstance.post<UsuarioAdminRead>(
    `/admin/usuarios/${id}/desactivar`
  );
  return response.data;
}
