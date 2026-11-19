import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useForm } from "@tanstack/react-form";
import { useCategorias } from "@/features/categorias/hooks/useCategorias";
import { handleApiError } from "@/shared/api/handleApiError";
import { EstadoError } from "@/shared/components/EstadoError";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Skeleton } from "@/shared/components/Skeleton";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";
import { Modal } from "@/shared/ui/Modal";
import {
  useActualizarProducto,
  useActualizarStockProducto,
  useCrearProducto,
  useEliminarProducto,
  useProductos,
} from "../hooks/useProductos";
import type { ProductoRead } from "../types/producto";

const columnHelper = createColumnHelper<ProductoRead>();

interface ProductoFormValues {
  nombre: string;
  descripcion: string;
  precio_base: string;
  imagen_url: string;
  stock: string;
  disponible: boolean;
  categoria_id: string;
}

interface StockFormValues {
  stock: string;
  disponible: boolean;
}

const defaultProductoValues: ProductoFormValues = {
  nombre: "",
  descripcion: "",
  precio_base: "0",
  imagen_url: "",
  stock: "0",
  disponible: true,
  categoria_id: "",
};

const defaultStockValues: StockFormValues = {
  stock: "0",
  disponible: true,
};

export function AdminProductosPage() {
  const { data, isLoading, isError, error, refetch } = useProductos({
    skip: 0,
    limit: 100,
  });
  const { data: categorias = [] } = useCategorias();

  const crearMutation = useCrearProducto();
  const actualizarMutation = useActualizarProducto();
  const stockMutation = useActualizarStockProducto();
  const eliminarMutation = useEliminarProducto();

  const productos = data?.items ?? [];

  const [modalFormAbierto, setModalFormAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState<ProductoRead | null>(
    null
  );
  const [errorForm, setErrorForm] = useState<string | null>(null);

  const [modalStockAbierto, setModalStockAbierto] = useState(false);
  const [productoStock, setProductoStock] = useState<ProductoRead | null>(null);
  const [errorStock, setErrorStock] = useState<string | null>(null);

  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  const productoForm = useForm({
    defaultValues: defaultProductoValues,
    onSubmit: async ({ value }) => {
      setErrorForm(null);
      const precioNum = Number(value.precio_base);
      const stockNum = Number(value.stock);
      const categoriaNum = Number(value.categoria_id);

      if (Number.isNaN(precioNum) || precioNum < 0) {
        setErrorForm("El precio base debe ser mayor o igual a 0");
        return;
      }
      if (!Number.isInteger(stockNum) || stockNum < 0) {
        setErrorForm("El stock debe ser un entero mayor o igual a 0");
        return;
      }
      if (!categoriaNum || categoriaNum <= 0) {
        setErrorForm("Seleccioná una categoría válida");
        return;
      }

      const descripcionVal =
        value.descripcion.trim().length > 0 ? value.descripcion.trim() : null;
      const imagenVal =
        value.imagen_url.trim().length > 0 ? value.imagen_url.trim() : null;

      try {
        if (productoEditando) {
          await actualizarMutation.mutateAsync({
            id: productoEditando.id,
            data: {
              nombre: value.nombre.trim(),
              descripcion: descripcionVal,
              precio_base: precioNum,
              imagen_url: imagenVal,
              stock: stockNum,
              disponible: value.disponible,
              categoria_id: categoriaNum,
            },
          });
        } else {
          await crearMutation.mutateAsync({
            nombre: value.nombre.trim(),
            descripcion: descripcionVal,
            precio_base: precioNum,
            imagen_url: imagenVal,
            stock: stockNum,
            disponible: value.disponible,
            categoria_id: categoriaNum,
          });
        }
        cerrarModalForm();
      } catch (err: unknown) {
        setErrorForm(handleApiError(err, "No se pudo guardar el producto"));
      }
    },
  });

  const stockForm = useForm({
    defaultValues: defaultStockValues,
    onSubmit: async ({ value }) => {
      if (!productoStock) {
        return;
      }
      setErrorStock(null);
      const stockNum = Number(value.stock);
      if (!Number.isInteger(stockNum) || stockNum < 0) {
        setErrorStock("El stock debe ser un entero mayor o igual a 0");
        return;
      }

      try {
        await stockMutation.mutateAsync({
          id: productoStock.id,
          data: {
            stock: stockNum,
            disponible: value.disponible,
          },
        });
        cerrarModalStock();
      } catch (err: unknown) {
        setErrorStock(handleApiError(err, "No se pudo actualizar el stock"));
      }
    },
  });

  const abrirCrear = (): void => {
    setErrorForm(null);
    setProductoEditando(null);
    productoForm.reset({
      nombre: "",
      descripcion: "",
      precio_base: "0",
      imagen_url: "",
      stock: "0",
      disponible: true,
      categoria_id: categorias[0] ? String(categorias[0].id) : "",
    });
    setModalFormAbierto(true);
  };

  const abrirEditar = (prod: ProductoRead): void => {
    setErrorForm(null);
    setProductoEditando(prod);
    productoForm.reset({
      nombre: prod.nombre,
      descripcion: prod.descripcion ?? "",
      precio_base: String(prod.precio_base),
      imagen_url: prod.imagen_url ?? "",
      stock: String(prod.stock),
      disponible: prod.disponible,
      categoria_id: String(prod.categoria_id),
    });
    setModalFormAbierto(true);
  };

  const cerrarModalForm = (): void => {
    setModalFormAbierto(false);
    setProductoEditando(null);
    setErrorForm(null);
  };

  const abrirStock = (prod: ProductoRead): void => {
    setErrorStock(null);
    setProductoStock(prod);
    stockForm.reset({
      stock: String(prod.stock),
      disponible: prod.disponible,
    });
    setModalStockAbierto(true);
  };

  const cerrarModalStock = (): void => {
    setModalStockAbierto(false);
    setProductoStock(null);
    setErrorStock(null);
  };

  const handleBajaLogica = async (prod: ProductoRead): Promise<void> => {
    setErrorAccion(null);
    try {
      await eliminarMutation.mutateAsync(prod.id);
    } catch (err: unknown) {
      setErrorAccion(handleApiError(err, "No se pudo dar de baja el producto"));
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
      }),
      columnHelper.accessor("nombre", {
        header: "Producto",
        cell: (info) => (
          <span className="font-medium text-stone-900">{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: "categoria",
        header: "Categoría",
        cell: ({ row }) => row.original.categoria?.nombre ?? "—",
      }),
      columnHelper.accessor("precio_base", {
        header: "Precio",
        cell: (info) => `$${info.getValue().toFixed(2)}`,
      }),
      columnHelper.accessor("stock", {
        header: "Stock",
      }),
      columnHelper.accessor("disponible", {
        header: "Disponibilidad",
        cell: (info) =>
          info.getValue() ? (
            <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              Disponible
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
              No disponible
            </span>
          ),
      }),
      columnHelper.display({
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
          const prod = row.original;
          return (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => abrirEditar(prod)}
              >
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="border border-stone-300"
                onClick={() => abrirStock(prod)}
              >
                Stock
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={eliminarMutation.isPending}
                onClick={() => void handleBajaLogica(prod)}
              >
                Dar de baja
              </Button>
            </div>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eliminarMutation.isPending]
  );

  const table = useReactTable({
    data: productos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            Administración de Productos
          </h1>
          <p className="text-sm text-stone-600">
            Gestioná productos, precios, stock, disponibilidad y bajas lógicas.
          </p>
        </div>
        <Button variant="primary" onClick={abrirCrear}>
          Nuevo producto
        </Button>
      </div>

      {errorAccion && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorAccion}
        </div>
      )}

      {isLoading && <Skeleton cantidad={3} />}

      {isError && (
        <EstadoError
          mensaje={handleApiError(error, "Error al cargar los productos")}
          onReintentar={() => {
            void refetch();
          }}
        />
      )}

      {!isLoading && !isError && productos.length === 0 && (
        <EstadoVacio
          titulo="No hay productos activos"
          descripcion="Creá un producto para mostrarlo en el catálogo."
          accion={
            <Button variant="primary" onClick={abrirCrear}>
              Crear producto
            </Button>
          }
        />
      )}

      {!isLoading && !isError && productos.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-stone-200 text-left text-sm">
            <thead className="bg-stone-100 text-xs uppercase text-stone-600">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-stone-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-stone-200 px-4 py-3 text-sm text-stone-600">
            <span>
              Página{" "}
              <strong className="text-stone-900">
                {table.getState().pagination.pageIndex + 1}
              </strong>{" "}
              de{" "}
              <strong className="text-stone-900">
                {Math.max(1, table.getPageCount())}
              </strong>
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Modal Crear / Editar Producto */}
      <Modal
        open={modalFormAbierto}
        title={productoEditando ? "Editar producto" : "Nuevo producto"}
        onClose={cerrarModalForm}
      >
        {errorForm && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {errorForm}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void productoForm.handleSubmit();
          }}
          className="space-y-4"
        >
          <productoForm.Field
            name="nombre"
            validators={{
              onChange: ({ value }) => {
                const len = value.trim().length;
                if (len < 2 || len > 100) {
                  return "El nombre debe tener entre 2 y 100 caracteres";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <Input
                label="Nombre"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors[0]
                    : undefined
                }
                placeholder="Ej. Pizza Muzza"
              />
            )}
          </productoForm.Field>

          <productoForm.Field
            name="categoria_id"
            validators={{
              onChange: ({ value }) =>
                !value ? "Seleccioná una categoría" : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor="prod-categoria"
                  className="mb-1 block text-sm font-medium text-stone-700"
                >
                  Categoría
                </label>
                <select
                  id="prod-categoria"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none"
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                {field.state.meta.isTouched && field.state.meta.errors[0] && (
                  <p className="mt-1 text-xs text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </productoForm.Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <productoForm.Field
              name="precio_base"
              validators={{
                onChange: ({ value }) => {
                  const num = Number(value);
                  if (value === "" || Number.isNaN(num) || num < 0) {
                    return "Precio >= 0";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <Input
                  label="Precio base"
                  type="number"
                  step="0.01"
                  min="0"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={
                    field.state.meta.isTouched
                      ? field.state.meta.errors[0]
                      : undefined
                  }
                />
              )}
            </productoForm.Field>

            <productoForm.Field
              name="stock"
              validators={{
                onChange: ({ value }) => {
                  const num = Number(value);
                  if (value === "" || !Number.isInteger(num) || num < 0) {
                    return "Stock entero >= 0";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <Input
                  label="Stock"
                  type="number"
                  step="1"
                  min="0"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={
                    field.state.meta.isTouched
                      ? field.state.meta.errors[0]
                      : undefined
                  }
                />
              )}
            </productoForm.Field>
          </div>

          <productoForm.Field name="descripcion">
            {(field) => (
              <Input
                label="Descripción (opcional)"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Descripción breve del producto"
              />
            )}
          </productoForm.Field>

          <productoForm.Field name="imagen_url">
            {(field) => (
              <Input
                label="URL de imagen (opcional)"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="https://..."
              />
            )}
          </productoForm.Field>

          <productoForm.Field name="disponible">
            {(field) => (
              <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-600"
                />
                Disponible para la venta
              </label>
            )}
          </productoForm.Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={cerrarModalForm}>
              Cancelar
            </Button>
            <productoForm.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              )}
            </productoForm.Subscribe>
          </div>
        </form>
      </Modal>

      {/* Modal Cambio de Stock y Disponibilidad */}
      <Modal
        open={modalStockAbierto}
        title={
          productoStock
            ? `Stock y disponibilidad — ${productoStock.nombre}`
            : "Actualizar stock"
        }
        onClose={cerrarModalStock}
      >
        {errorStock && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {errorStock}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void stockForm.handleSubmit();
          }}
          className="space-y-4"
        >
          <stockForm.Field
            name="stock"
            validators={{
              onChange: ({ value }) => {
                const num = Number(value);
                if (value === "" || !Number.isInteger(num) || num < 0) {
                  return "El stock debe ser un entero >= 0";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <Input
                label="Stock"
                type="number"
                step="1"
                min="0"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors[0]
                    : undefined
                }
              />
            )}
          </stockForm.Field>

          <stockForm.Field name="disponible">
            {(field) => (
              <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-600"
                />
                Disponible
              </label>
            )}
          </stockForm.Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={cerrarModalStock}>
              Cancelar
            </Button>
            <stockForm.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Actualizando..." : "Actualizar stock"}
                </Button>
              )}
            </stockForm.Subscribe>
          </div>
        </form>
      </Modal>
    </div>
  );
}