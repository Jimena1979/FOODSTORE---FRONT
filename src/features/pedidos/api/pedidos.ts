import { axiosInstance } from "@/shared/api/axiosInstance";
import type {
  CambioEstado,
  PedidoCreate,
  PedidoRead,
  PedidosPaginados,
  PedidosQueryParams,
  ResumenPedidos,
} from "../types/pedido";

export async function crearPedido(data: PedidoCreate): Promise<PedidoRead> {
  const response = await axiosInstance.post<PedidoRead>("/pedidos", data);
  return response.data;
}

export async function listarPedidos(
  params: PedidosQueryParams = {}
): Promise<PedidosPaginados> {
  const cleanParams: Record<string, string | number> = {};
  if (params.skip !== undefined) {
    cleanParams.skip = params.skip;
  }
  if (params.limit !== undefined) {
    cleanParams.limit = params.limit;
  }
  if (params.estado && params.estado.trim().length > 0) {
    cleanParams.estado = params.estado.trim();
  }

  const response = await axiosInstance.get<PedidosPaginados>("/pedidos", {
    params: cleanParams,
  });
  return response.data;
}

export async function obtenerResumenPedidos(): Promise<ResumenPedidos> {
  const response = await axiosInstance.get<ResumenPedidos>("/pedidos/resumen");
  return response.data;
}

export async function obtenerPedidoPorId(id: number): Promise<PedidoRead> {
  const response = await axiosInstance.get<PedidoRead>(`/pedidos/${id}`);
  return response.data;
}

export async function cambiarEstadoPedido(
  id: number,
  data: CambioEstado
): Promise<PedidoRead> {
  const response = await axiosInstance.patch<PedidoRead>(
    `/pedidos/${id}/estado`,
    data
  );
  return response.data;
}

export async function cancelarPedido(id: number): Promise<PedidoRead> {
  const response = await axiosInstance.patch<PedidoRead>(
    `/pedidos/${id}/cancelar`
  );
  return response.data;
}