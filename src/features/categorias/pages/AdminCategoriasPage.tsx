import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useForm } from "@tanstack/react-form";
import { handleApiError } from "@/shared/api/handleApiError";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";
import { Modal } from "@/shared/ui/Modal";
import { EstadoError } from "@/shared/components/EstadoError";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Skeleton } from "@/shared/components/Skeleton";
import {
  useActualizarCategoria,
  useCategorias,
  useCrearCategoria,
  useEliminarCategoria,
} from "../hooks/useCategorias";
import type { CategoriaRead } from "../types/categoria";

const columnHelper = createColumnHelper<CategoriaRead>();

interface CategoriaFormValues {
  nombre: string;
  descripcion: string;
}

export function AdminCategoriasPage() {
  const { data: categorias = [], isLoading, isError, error, refetch } = useCategorias();
  const crearMutation = useCrearCategoria();
  const actualizarMutation = useActualizarCategoria();
  const eliminarMutation = useEliminarCategoria();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<CategoriaRead | null>(null);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
    } satisfies CategoriaFormValues,
    onSubmit: async ({ value }) => {
      setErrorForm(null);
      const nombreLimpio = value.nombre.trim();
      const descripcionLimpia = value.descripcion.trim();

      try {
        if (categoriaEditando) {
          await actualizarMutation.mutateAsync({
            id: categoriaEditando.id,
            data: {
              nombre: nombreLimpio,
              descripcion: descripcionLimpia.length > 0 ? descripcionLimpia : null,
            },
          });
        } else {
          await crearMutation.mutateAsync({
            nombre: nombreLimpio,
            descripcion: descripcionLimpia.length > 0 ? descripcionLimpia : null,
          });
        }
        cerrarModal();
      } catch (err: unknown) {
        setErrorForm(handleApiError(err, "No se pudo guardar la categoría"));
      }
    },
  });

  const abrirCrear = (): void => {
    setErrorForm(null);
    setCategoriaEditando(null);
    form.reset({
      nombre: "",
      descripcion: "",
    });
    setModalAbierto(true);
  };

  const abrirEditar = (categoria: CategoriaRead): void => {
    setErrorForm(null);
    setCategoriaEditando(categoria);
    form.reset({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? "",
    });
    setModalAbierto(true);
  };

  const cerrarModal = (): void => {
    setModalAbierto(false);
    setCategoriaEditando(null);
    setErrorForm(null);
  };

  const handleBajaLogica = async (categoria: CategoriaRead): Promise<void> => {
    setErrorAccion(null);
    try {
      await eliminarMutation.mutateAsync(categoria.id);
    } catch (err: unknown) {
      setErrorAccion(handleApiError(err, "No se pudo dar de baja la categoría"));
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("nombre", {
        header: "Nombre",
        cell: (info) => <span className="font-medium text-stone-900">{info.getValue()}</span>,
      }),
      columnHelper.accessor("descripcion", {
        header: "Descripción",
        cell: (info) => info.getValue() ?? "—",
      }),
      columnHelper.accessor("activo", {
        header: "Estado",
        cell: (info) =>
          info.getValue() ? (
            <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              Activa
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-medium text-stone-700">
              Inactiva
            </span>
          ),
      }),
      columnHelper.display({
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
          const cat = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => abrirEditar(cat)}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={eliminarMutation.isPending}
                onClick={() => void handleBajaLogica(cat)}
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
    data: categorias,
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
            Administración de Categorías
          </h1>
          <p className="text-sm text-stone-600">
            Creá, editá o aplicá baja lógica a las categorías del catálogo.
          </p>
        </div>
        <Button variant="primary" onClick={abrirCrear}>
          Nueva categoría
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
          mensaje={handleApiError(error, "Error al cargar las categorías")}
          onReintentar={() => {
            void refetch();
          }}
        />
      )}

      {!isLoading && !isError && categorias.length === 0 && (
        <EstadoVacio
          titulo="No hay categorías registradas"
          descripcion="Creá la primera categoría para comenzar a cargar productos."
          accion={
            <Button variant="primary" onClick={abrirCrear}>
              Crear categoría
            </Button>
          }
        />
      )}

      {!isLoading && !isError && categorias.length > 0 && (
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

      <Modal
        open={modalAbierto}
        title={categoriaEditando ? "Editar categoría" : "Nueva categoría"}
        onClose={cerrarModal}
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
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
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
                placeholder="Ej. Hamburguesas"
              />
            )}
          </form.Field>

          <form.Field name="descripcion">
            {(field) => (
              <Input
                label="Descripción (opcional)"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Ej. Hamburguesas caseras y combos"
              />
            )}
          </form.Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
            <form.Subscribe
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
            </form.Subscribe>
          </div>
        </form>
      </Modal>
    </div>
  );
}