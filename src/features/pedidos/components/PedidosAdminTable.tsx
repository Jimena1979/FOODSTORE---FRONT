import { useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { BadgeEstado, type EstadoPedido } from "@/shared/ui/BadgeEstado";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import type { PedidoRead } from "../types/pedido";

const columnHelper = createColumnHelper<PedidoRead>();

interface PedidosAdminTableProps {
  pedidos: PedidoRead[];
  isUpdating: boolean;
  onCambiarEstado: (pedidoId: number, nuevoEstado: EstadoPedido) => void;
  onVerDetalle: (pedido: PedidoRead) => void;
}

export function PedidosAdminTable({
  pedidos,
  isUpdating,
  onCambiarEstado,
  onVerDetalle,
}: PedidosAdminTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "#",
        cell: (info) => (
          <span className="font-semibold text-stone-900">#{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("usuario_id", {
        header: "Usuario ID",
      }),
      columnHelper.accessor("estado", {
        header: "Estado",
        cell: (info) => <BadgeEstado estado={info.getValue()} />,
      }),
      columnHelper.accessor("forma_pago", {
        header: "Pago",
      }),
      columnHelper.accessor("direccion_entrega", {
        header: "Dirección",
        cell: (info) => (
          <span className="line-clamp-1 max-w-xs">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("total", {
        header: "Total",
        cell: (info) => (
          <span className="font-semibold text-stone-900">
            ${info.getValue().toFixed(2)}
          </span>
        ),
      }),
      columnHelper.display({
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
          const pedido = row.original;
          const estado = pedido.estado;

          return (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="border border-stone-300"
                onClick={() => onVerDetalle(pedido)}
              >
                Detalle
              </Button>

              {estado === "PENDIENTE" && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() =>
                      onCambiarEstado(pedido.id, "EN_PREPARACION")
                    }
                  >
                    Preparar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => onCambiarEstado(pedido.id, "CANCELADO")}
                  >
                    Cancelar
                  </Button>
                </>
              )}

              {estado === "EN_PREPARACION" && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => onCambiarEstado(pedido.id, "ENTREGADO")}
                  >
                    Entregar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => onCambiarEstado(pedido.id, "CANCELADO")}
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          );
        },
      }),
    ],
    [isUpdating, onCambiarEstado, onVerDetalle]
  );

  const table = useReactTable({
    data: pedidos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}