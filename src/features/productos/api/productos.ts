import { axiosInstance } from "@/shared/api/axiosInstance";
import type {
  ProductoCreate,
  ProductoRead,
  ProductosPaginados,
  ProductosQueryParams,
  ProductoStockUpdate,
  ProductoUpdate,
} from "../types/producto";

export async function listarProductos(
  params: ProductosQueryParams = {}
): Promise<ProductosPaginados> {
  const cleanParams: Record<string, string | number | boolean> = {};

  if (params.skip !== undefined) {
    cleanParams.skip = params.skip;
  }
  if (params.limit !== undefined) {
    cleanParams.limit = params.limit;
  }
  if (params.search && params.search.trim().length > 0) {
    cleanParams.search = params.search.trim();
  }
  if (params.categoria_id !== undefined) {
    cleanParams.categoria_id = params.categoria_id;
  }
  if (params.disponible !== undefined) {
    cleanParams.disponible = params.disponible;
  }

  const response = await axiosInstance.get<ProductosPaginados>("/productos", {
    params: cleanParams,
  });
  return response.data;
}

export async function obtenerProductoPorId(id: number): Promise<ProductoRead> {
  const response = await axiosInstance.get<ProductoRead>(`/productos/${id}`);
  return response.data;
}

export async function crearProducto(data: ProductoCreate): Promise<ProductoRead> {
  const response = await axiosInstance.post<ProductoRead>("/productos", data);
  return response.data;
}

export async function actualizarProducto(
  id: number,
  data: ProductoUpdate
): Promise<ProductoRead> {
  const response = await axiosInstance.put<ProductoRead>(`/productos/${id}`, data);
  return response.data;
}

export async function actualizarStockProducto(
  id: number,
  data: ProductoStockUpdate
): Promise<ProductoRead> {
  const response = await axiosInstance.patch<ProductoRead>(
    `/productos/${id}/stock`,
    data
  );
  return response.data;
}

export async function eliminarProducto(id: number): Promise<void> {
  await axiosInstance.delete(`/productos/${id}`);
}