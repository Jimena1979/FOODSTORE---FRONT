import { useCallback, useState } from "react";
import { handleApiError } from "@/shared/api/handleApiError";
import { EstadoError } from "@/shared/components/EstadoError";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Paginacion } from "@/shared/components/Paginacion";
import { Skeleton } from "@/shared/components/Skeleton";
import type { EstadoPedido } from "@/shared/ui/BadgeEstado";
import { PedidoDetalleModal } from "../components/PedidoDetalleModal";
import { PedidosAdminTable } from "../components/PedidosAdminTable";
import { useCambiarEstadoPedido, usePedidos } from "../hooks/usePedidos";
import type { PedidoRead } from "../types/pedido";

const PAGE_SIZE = 20;

export function AdminPedidosPage() {
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPedido | "">("");
  const [pagina, setPagina] = useState(0);
  const [pedidoDetalle, setPedidoDetalle] = useState<PedidoRead | null>(null);
  const [errorEstado, setErrorEstado] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = usePedidos({
    skip: pagina * PAGE_SIZE,
    limit: PAGE_SIZE,
    estado: estadoFiltro,
  });

  const cambiarEstadoMutation = useCambiarEstadoPedido();

  const pedidos = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleCambiarEstado = useCallback(
    (pedidoId: number, nuevoEstado: EstadoPedido): void => {
      setErrorEstado(null);
      cambiarEstadoMutation.mutate(
        { id: pedidoId, data: { estado: nuevoEstado } },
        {
          onError: (err: unknown) => {
            setErrorEstado(
              handleApiError(err, "No se pudo cambiar el estado del pedido")
            );
          },
        }
      );
    },
    [cambiarEstadoMutation]
  );

  const handleVerDetalle = useCallback((pedido: PedidoRead): void => {
    setPedidoDetalle(pedido);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            Gestión de Pedidos
          </h1>
          <p className="text-sm text-stone-600">
            Filtrá por estado y avanzá o cancelá pedidos según la máquina de
            estados.
          </p>
        </div>

        <div className="w-full sm:w-56">
          <label
            htmlFor="filtro-estado-pedido"
            className="mb-1 block text-xs font-medium text-stone-700"
          >
            Filtrar por estado
          </label>
          <select
            id="filtro-estado-pedido"
            value={estadoFiltro}
            onChange={(e) => {
              setEstadoFiltro(e.target.value as EstadoPedido | "");
              setPagina(0);
            }}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="EN_PREPARACION">EN_PREPARACION</option>
            <option value="ENTREGADO">ENTREGADO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>
      </div>

      {errorEstado && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorEstado}
        </div>
      )}

      {isLoading && <Skeleton cantidad={3} />}

      {isError && (
        <EstadoError
          mensaje={handleApiError(error, "No se pudieron cargar los pedidos")}
          onReintentar={() => {
            void refetch();
          }}
        />
      )}

      {!isLoading && !isError && pedidos.length === 0 && (
        <EstadoVacio
          titulo="No hay pedidos para el filtro seleccionado"
          descripcion="Probá cambiando el estado del filtro."
        />
      )}

      {!isLoading && !isError && pedidos.length > 0 && (
        <>
          <PedidosAdminTable
            pedidos={pedidos}
            isUpdating={cambiarEstadoMutation.isPending}
            onCambiarEstado={handleCambiarEstado}
            onVerDetalle={handleVerDetalle}
          />

          <Paginacion
            paginaActual={pagina}
            totalItems={total}
            pageSize={PAGE_SIZE}
            onCambiarPagina={(nuevaPagina) => setPagina(nuevaPagina)}
          />
        </>
      )}

      <PedidoDetalleModal
        pedido={pedidoDetalle}
        onClose={() => setPedidoDetalle(null)}
      />
    </div>
  );
}