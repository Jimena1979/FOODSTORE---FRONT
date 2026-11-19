import { axiosInstance } from "@/shared/api/axiosInstance";
import type {
  CategoriaCreate,
  CategoriaRead,
  CategoriaUpdate,
} from "../types/categoria";

export async function obtenerCategorias(): Promise<CategoriaRead[]> {
  const response = await axiosInstance.get<CategoriaRead[]>("/categorias");
  return response.data;
}

export async function obtenerCategoriaPorId(id: number): Promise<CategoriaRead> {
  const response = await axiosInstance.get<CategoriaRead>(`/categorias/${id}`);
  return response.data;
}

export async function crearCategoria(data: CategoriaCreate): Promise<CategoriaRead> {
  const response = await axiosInstance.post<CategoriaRead>("/categorias", data);
  return response.data;
}

export async function actualizarCategoria(
  id: number,
  data: CategoriaUpdate
): Promise<CategoriaRead> {
  const response = await axiosInstance.put<CategoriaRead>(`/categorias/${id}`, data);
  return response.data;
}

export async function eliminarCategoria(id: number): Promise<void> {
  await axiosInstance.delete(`/categorias/${id}`);
}