import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAuthStore } from "@/store/authStore";
import { handleApiError } from "@/shared/api/handleApiError";
import { EstadoError } from "@/shared/components/EstadoError";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Skeleton } from "@/shared/components/Skeleton";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import {
  useActivarUsuario,
  useDesactivarUsuario,
  useUsuarios,
} from "../hooks/useUsuarios";
import type { UsuarioAdminRead } from "../types/usuario";

const columnHelper = createColumnHelper<UsuarioAdminRead>();

export function AdminUsuariosPage() {
  const usuarioActual = useAuthStore((state) => state.usuario);
  const { data: usuarios = [], isLoading, isError, error, refetch } =
    useUsuarios();

  const activarMutation = useActivarUsuario();
  const desactivarMutation = useDesactivarUsuario();

  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  const mutando = activarMutation.isPending || desactivarMutation.isPending;

  const handleActivar = async (usuario: UsuarioAdminRead): Promise<void> => {
    setErrorAccion(null);
    try {
      await activarMutation.mutateAsync(usuario.id);
    } catch (err: unknown) {
      setErrorAccion(handleApiError(err, "No se pudo activar el usuario"));
    }
  };

  const handleDesactivar = async (usuario: UsuarioAdminRead): Promise<void> => {
    setErrorAccion(null);
    try {
      await desactivarMutation.mutateAsync(usuario.id);
    } catch (err: unknown) {
      setErrorAccion(handleApiError(err, "No se pudo desactivar el usuario"));
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("username", {
        header: "Usuario",
        cell: (info) => (
          <span className="font-medium text-stone-900">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("full_name", {
        header: "Nombre",
      }),
      columnHelper.accessor("email", {
        header: "Email",
      }),
      columnHelper.accessor("role", {
        header: "Rol",
        cell: (info) => (
          <span className="uppercase text-xs font-semibold text-stone-700">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("disabled", {
        header: "Estado",
        cell: (info) =>
          info.getValue() ? (
            <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
              Desactivado
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              Activo
            </span>
          ),
      }),
      columnHelper.display({
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
          const item = row.original;
          const esUsuarioActual = usuarioActual?.id === item.id;

          return (
            <div className="flex items-center gap-2">
              {item.disabled && (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={mutando}
                  onClick={() => void handleActivar(item)}
                >
                  Activar
                </Button>
              )}

              {!item.disabled && !esUsuarioActual && (
                <Button
                  variant="danger"
                  size="sm"
                  disabled={mutando}
                  onClick={() => void handleDesactivar(item)}
                >
                  Desactivar
                </Button>
              )}

              {!item.disabled && esUsuarioActual && (
                <span className="text-xs text-stone-400">Sesión actual</span>
              )}
            </div>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutando, usuarioActual?.id]
  );

  const table = useReactTable({
    data: usuarios,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">
          Gestión de Usuarios
        </h1>
        <p className="text-sm text-stone-600">
          Activá o desactivá cuentas de usuario del sistema.
        </p>
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
          mensaje={handleApiError(error, "No se pudieron cargar los usuarios")}
          onReintentar={() => {
            void refetch();
          }}
        />
      )}

      {!isLoading && !isError && usuarios.length === 0 && (
        <EstadoVacio
          titulo="No hay usuarios registrados"
          descripcion="Los usuarios registrados aparecerán en este listado."
        />
      )}

      {!isLoading && !isError && usuarios.length > 0 && (
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
        </Card>
      )}
    </div>
  );
}