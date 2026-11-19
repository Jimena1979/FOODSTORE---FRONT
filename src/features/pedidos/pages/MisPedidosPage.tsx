import { useState } from "react";
import { handleApiError } from "@/shared/api/handleApiError";
import { EstadoError } from "@/shared/components/EstadoError";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Paginacion } from "@/shared/components/Paginacion";
import { Skeleton } from "@/shared/components/Skeleton";
import { BadgeEstado } from "@/shared/ui/BadgeEstado";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { PedidoDetalleModal } from "../components/PedidoDetalleModal";
import { useCancelarPedido, usePedidos } from "../hooks/usePedidos";
import type { PedidoRead } from "../types/pedido";

const PAGE_SIZE = 10;

export function MisPedidosPage() {
  const [pagina, setPagina] = useState(0);
  const [pedidoSeleccionado, setPedidoSeleccionado] =
    useState<PedidoRead | null>(null);
  const [errorCancelar, setErrorCancelar] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = usePedidos({
    skip: pagina * PAGE_SIZE,
    limit: PAGE_SIZE,
  });

  const cancelarMutation = useCancelarPedido();

  const pedidos = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleCancelar = async (pedidoId: number): Promise<void> => {
    setErrorCancelar(null);
    try {
      await cancelarMutation.mutateAsync(pedidoId);
    } catch (err: unknown) {
      setErrorCancelar(handleApiError(err, "No se pudo cancelar el pedido"));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Mis pedidos</h1>
        <p className="text-sm text-stone-600">
          Consultá el estado de tus pedidos y cancelá los que estén pendientes.
        </p>
      </div>

      {errorCancelar && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorCancelar}
        </div>
      )}

      {isLoading && <Skeleton cantidad={3} />}

      {isError && (
        <EstadoError
          mensaje={handleApiError(error, "No se pudieron cargar tus pedidos")}
          onReintentar={() => {
            void refetch();
          }}
        />
      )}

      {!isLoading && !isError && pedidos.length === 0 && (
        <EstadoVacio
          titulo="Todavía no realizaste pedidos"
          descripcion="Cuando confirmes un pedido desde el carrito aparecerá acá."
        />
      )}

      {!isLoading && !isError && pedidos.length > 0 && (
        <>
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <Card
                key={pedido.id}
                className="flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-stone-900">
                      Pedido #{pedido.id}
                    </span>
                    <BadgeEstado estado={pedido.estado} />
                    <span className="text-xs text-stone-500">
                      {new Date(pedido.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600">
                    Entrega: {pedido.direccion_entrega} · Pago:{" "}
                    <strong>{pedido.forma_pago}</strong>
                  </p>
                  <p className="text-base font-bold text-stone-900">
                    Total: ${pedido.total.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPedidoSeleccionado(pedido)}
                  >
                    Ver detalle
                  </Button>

                  {pedido.estado === "PENDIENTE" && (
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={cancelarMutation.isPending}
                      onClick={() => void handleCancelar(pedido.id)}
                    >
                      Cancelar pedido
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Paginacion
            paginaActual={pagina}
            totalItems={total}
            pageSize={PAGE_SIZE}
            onCambiarPagina={(nuevaPagina) => setPagina(nuevaPagina)}
          />
        </>
      )}

      <PedidoDetalleModal
        pedido={pedidoSeleccionado}
        onClose={() => setPedidoSeleccionado(null)}
      />
    </div>
  );
}