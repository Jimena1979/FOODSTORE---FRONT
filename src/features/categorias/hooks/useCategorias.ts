import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  obtenerCategorias,
} from "../api/categorias";
import type { CategoriaCreate, CategoriaUpdate } from "../types/categoria";

export const CATEGORIAS_QUERY_KEY = ["categorias"] as const;

export function useCategorias() {
  return useQuery({
    queryKey: CATEGORIAS_QUERY_KEY,
    queryFn: obtenerCategorias,
  });
}

export function useCrearCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoriaCreate) => crearCategoria(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CATEGORIAS_QUERY_KEY });
    },
  });
}

export function useActualizarCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaUpdate }) =>
      actualizarCategoria(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CATEGORIAS_QUERY_KEY });
    },
  });
}

export function useEliminarCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eliminarCategoria(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CATEGORIAS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}