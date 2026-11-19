import { handleApiError } from "@/shared/api/handleApiError";
import { EstadoError } from "@/shared/components/EstadoError";
import { Skeleton } from "@/shared/components/Skeleton";
import { ResumenCards } from "../components/ResumenCards";
import { useResumenPedidos } from "../hooks/usePedidos";

export function AdminResumenPage() {
  const { data, isLoading, isError, error, refetch } = useResumenPedidos();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">
          Resumen del Negocio
        </h1>
        <p className="text-sm text-stone-600">
          Indicadores generales de pedidos e ingresos entregados.
        </p>
      </div>

      {isLoading && <Skeleton cantidad={6} />}

      {isError && (
        <EstadoError
          mensaje={handleApiError(error, "No se pudo cargar el resumen")}
          onReintentar={() => {
            void refetch();
          }}
        />
      )}

      {!isLoading && !isError && data && <ResumenCards resumen={data} />}
    </div>
  );
}