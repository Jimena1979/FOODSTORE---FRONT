import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  actualizarProducto,
  actualizarStockProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
} from "../api/productos";
import type {
  ProductoCreate,
  ProductosQueryParams,
  ProductoStockUpdate,
  ProductoUpdate,
} from "../types/producto";

export const PRODUCTOS_QUERY_KEY = ["productos"] as const;

export function useProductos(params: ProductosQueryParams = {}) {
  return useQuery({
    queryKey: [...PRODUCTOS_QUERY_KEY, params],
    queryFn: () => listarProductos(params),
  });
}

export function useCrearProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductoCreate) => crearProducto(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
  });
}

export function useActualizarProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoUpdate }) =>
      actualizarProducto(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
  });
}

export function useActualizarStockProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoStockUpdate }) =>
      actualizarStockProducto(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
  });
}

export function useEliminarProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eliminarProducto(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTOS_QUERY_KEY });
    },
  });
}