import { useState } from "react";
import { useCategorias } from "@/features/categorias/hooks/useCategorias";
import { handleApiError } from "@/shared/api/handleApiError";
import { EstadoError } from "@/shared/components/EstadoError";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Paginacion } from "@/shared/components/Paginacion";
import { Skeleton } from "@/shared/components/Skeleton";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { ProductoCard } from "../components/ProductoCard";
import { useProductos } from "../hooks/useProductos";

const PAGE_SIZE = 6;

export function CatalogoPage() {
  const [pagina, setPagina] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    number | undefined
  >(undefined);

  const { data: categorias = [] } = useCategorias();

  const { data, isLoading, isError, error, refetch } = useProductos({
    skip: pagina * PAGE_SIZE,
    limit: PAGE_SIZE,
    search: busqueda,
    categoria_id: categoriaSeleccionada,
  });

  const productos = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleBuscarChange = (valor: string): void => {
    setBusqueda(valor);
    setPagina(0);
  };

  const handleCategoriaChange = (valor: string): void => {
    setCategoriaSeleccionada(valor ? Number(valor) : undefined);
    setPagina(0);
  };

  const handleLimpiarFiltros = (): void => {
    setBusqueda("");
    setCategoriaSeleccionada(undefined);
    setPagina(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Catálogo</h1>
        <p className="text-sm text-stone-600">
          Explorá nuestros platos disponibles y armá tu pedido.
        </p>
      </div>

      {/* Filtros: búsqueda y categoría */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Input
            label="Buscar por nombre"
            value={busqueda}
            onChange={(e) => handleBuscarChange(e.target.value)}
            placeholder="Ej. Hamburguesa, Pizza, Empanada..."
          />
        </div>

        <div>
          <label
            htmlFor="filtro-categoria"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Categoría
          </label>
          <select
            id="filtro-categoria"
            value={categoriaSeleccionada ?? ""}
            onChange={(e) => handleCategoriaChange(e.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <Skeleton cantidad={PAGE_SIZE} />}

      {isError && (
        <EstadoError
          mensaje={handleApiError(error, "No se pudo cargar el catálogo")}
          onReintentar={() => {
            void refetch();
          }}
        />
      )}

      {!isLoading && !isError && productos.length === 0 && (
        <EstadoVacio
          titulo="No se encontraron productos"
          descripcion="Probá cambiando el término de búsqueda o limpiando los filtros."
          accion={
            <Button variant="secondary" onClick={handleLimpiarFiltros}>
              Limpiar filtros
            </Button>
          }
        />
      )}

      {!isLoading && !isError && productos.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
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
    </div>
  );
}