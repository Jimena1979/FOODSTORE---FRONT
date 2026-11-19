import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cambiarEstadoPedido,
  cancelarPedido,
  crearPedido,
  listarPedidos,
  obtenerResumenPedidos,
} from "../api/pedidos";
import type {
  CambioEstado,
  PedidoCreate,
  PedidosQueryParams,
} from "../types/pedido";

export const PEDIDOS_QUERY_KEY = ["pedidos"] as const;
export const RESUMEN_PEDIDOS_QUERY_KEY = ["pedidos", "resumen"] as const;

export function usePedidos(params: PedidosQueryParams = {}) {
  return useQuery({
    queryKey: [...PEDIDOS_QUERY_KEY, params],
    queryFn: () => listarPedidos(params),
  });
}

export function useResumenPedidos() {
  return useQuery({
    queryKey: RESUMEN_PEDIDOS_QUERY_KEY,
    queryFn: obtenerResumenPedidos,
  });
}

export function useCrearPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PedidoCreate) => crearPedido(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useCambiarEstadoPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CambioEstado }) =>
      cambiarEstadoPedido(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}

export function useCancelarPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cancelarPedido(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PEDIDOS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}