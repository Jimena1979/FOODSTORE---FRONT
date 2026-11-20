import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { type CartItem, getCartOwnerKey, useCartStore } from "@/store/cartStore";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { CheckoutForm } from "../components/CheckoutForm";
import { useCrearPedido } from "../hooks/usePedidos";
import type { PedidoCreate } from "../types/pedido";

const EMPTY_CART: CartItem[] = [];

export function CheckoutPage() {
  const navigate = useNavigate();
  const usuarioId = useAuthStore((state) => state.usuario?.id ?? null);
  const ownerKey = getCartOwnerKey(usuarioId);

  const rawItems = useCartStore((state) => state.cartsByUser[ownerKey]);
  const items = rawItems ?? EMPTY_CART;
  const vaciar = useCartStore((state) => state.vaciar);
  const total = useCartStore((state) => state.total(usuarioId));

  const crearPedidoMutation = useCrearPedido();

  const handleConfirmar = async (
    datosEntrega: Omit<PedidoCreate, "items">
  ): Promise<void> => {
    const payload: PedidoCreate = {
      ...datosEntrega,
      items: items.map((item) => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
      })),
    };

    await crearPedidoMutation.mutateAsync(payload);
    vaciar(usuarioId);
    navigate("/mis-pedidos");
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-stone-900">Confirmar pedido</h1>
        <EstadoVacio
          titulo="No hay ítems para confirmar"
          descripcion="Agregá productos al carrito antes de ir al checkout."
          accion={
            <Link to="/">
              <Button variant="primary">Volver al catálogo</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Confirmar pedido</h1>
        <p className="text-sm text-stone-600">
          Revisá el detalle de tu compra y confirmá la entrega.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm
            total={total}
            disabledItems={items.length === 0}
            onSubmitPedido={handleConfirmar}
          />
        </div>

        <div>
          <Card className="space-y-3 p-5">
            <h2 className="font-semibold text-stone-900">Ítems seleccionados</h2>
            <div className="divide-y divide-stone-100 text-sm">
              {items.map((item) => (
                <div
                  key={item.producto_id}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="font-medium text-stone-900">{item.nombre}</p>
                    <p className="text-xs text-stone-500">
                      {item.cantidad} x ${item.precio_unitario.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-semibold text-stone-800">
                    ${(item.cantidad * item.precio_unitario).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}