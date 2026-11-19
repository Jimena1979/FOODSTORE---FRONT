import { BadgeEstado } from "@/shared/ui/BadgeEstado";
import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import type { PedidoRead } from "../types/pedido";

interface PedidoDetalleModalProps {
  pedido: PedidoRead | null;
  onClose: () => void;
}

export function PedidoDetalleModal({
  pedido,
  onClose,
}: PedidoDetalleModalProps) {
  if (!pedido) {
    return null;
  }

  return (
    <Modal
      open={Boolean(pedido)}
      title={`Detalle del pedido #${pedido.id}`}
      onClose={onClose}
    >
      <div className="space-y-4 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-stone-50 p-3">
          <div>
            <p className="text-xs text-stone-500">Estado actual</p>
            <div className="mt-1">
              <BadgeEstado estado={pedido.estado} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-500">Forma de pago</p>
            <p className="mt-1 font-semibold text-stone-800">
              {pedido.forma_pago}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-stone-500">
            Dirección de entrega
          </p>
          <p className="mt-0.5 text-stone-900">{pedido.direccion_entrega}</p>
        </div>

        {pedido.notas && (
          <div>
            <p className="text-xs font-medium text-stone-500">Notas</p>
            <p className="mt-0.5 text-stone-700">{pedido.notas}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs text-stone-500">
          <div>
            <span>Creado:</span>{" "}
            <strong className="text-stone-700">
              {new Date(pedido.created_at).toLocaleString()}
            </strong>
          </div>
          <div>
            <span>Actualizado:</span>{" "}
            <strong className="text-stone-700">
              {new Date(pedido.updated_at).toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-3">
          <h3 className="mb-2 font-semibold text-stone-900">Ítems del pedido</h3>
          <div className="divide-y divide-stone-100 rounded-lg border border-stone-200">
            {pedido.items.map((item) => (
              <div
                key={`${pedido.id}-${item.producto_id}`}
                className="flex items-center justify-between gap-3 px-3 py-2.5"
              >
                <div>
                  <p className="font-medium text-stone-900">
                    {item.nombre_producto}
                  </p>
                  <p className="text-xs text-stone-500">
                    ${item.precio_unitario.toFixed(2)} x {item.cantidad}
                  </p>
                </div>
                <span className="font-semibold text-stone-900">
                  ${item.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-stone-200 pt-3">
          <span className="font-semibold text-stone-700">Total</span>
          <span className="text-xl font-bold text-stone-900">
            ${pedido.total.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}