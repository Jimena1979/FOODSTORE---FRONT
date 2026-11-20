import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { type CartItem, getCartOwnerKey, useCartStore } from "@/store/cartStore";
import { EstadoVacio } from "@/shared/components/EstadoVacio";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

const EMPTY_CART: CartItem[] = [];

export function CarritoPage() {
  const usuarioId = useAuthStore((state) => state.usuario?.id ?? null);
  const ownerKey = getCartOwnerKey(usuarioId);

  const rawItems = useCartStore((state) => state.cartsByUser[ownerKey]);
  const items = rawItems ?? EMPTY_CART;
  const cambiarCantidad = useCartStore((state) => state.cambiarCantidad);
  const quitar = useCartStore((state) => state.quitar);
  const vaciar = useCartStore((state) => state.vaciar);
  const total = useCartStore((state) => state.total(usuarioId));

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-stone-900">Carrito</h1>
        <EstadoVacio
          titulo="Tu carrito está vacío"
          descripcion="Agregá productos desde el catálogo para armar tu pedido."
          accion={
            <Link to="/">
              <Button variant="primary">Ir al catálogo</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Tu carrito</h1>
          <p className="text-sm text-stone-600">
            Revisá las cantidades antes de confirmar tu pedido.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => vaciar(usuarioId)}
        >
          Vaciar carrito
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => {
            const subtotal = item.precio_unitario * item.cantidad;
            return (
              <Card
                key={item.producto_id}
                className="flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <h2 className="font-semibold text-stone-900">{item.nombre}</h2>
                  <p className="text-xs text-stone-500">
                    Precio unitario: ${item.precio_unitario.toFixed(2)}
                    {item.stockMax !== undefined
                      ? ` · Stock máx.: ${item.stockMax}`
                      : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        cambiarCantidad(
                          item.producto_id,
                          item.cantidad - 1,
                          usuarioId
                        )
                      }
                    >
                      -
                    </Button>
                    <span className="min-w-8 text-center text-sm font-semibold">
                      {item.cantidad}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={
                        item.stockMax !== undefined &&
                        item.cantidad >= item.stockMax
                      }
                      onClick={() =>
                        cambiarCantidad(
                          item.producto_id,
                          item.cantidad + 1,
                          usuarioId
                        )
                      }
                    >
                      +
                    </Button>
                  </div>

                  <span className="min-w-20 text-right font-bold text-stone-900">
                    ${subtotal.toFixed(2)}
                  </span>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => quitar(item.producto_id, usuarioId)}
                  >
                    Quitar
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <div>
          <Card className="space-y-4 p-6">
            <h2 className="text-lg font-semibold text-stone-900">
              Resumen del carrito
            </h2>
            <div className="flex items-center justify-between border-t border-stone-200 pt-3">
              <span className="text-stone-600">Total</span>
              <span className="text-2xl font-bold text-stone-900">
                ${total.toFixed(2)}
              </span>
            </div>
            <Link to="/checkout" className="block">
              <Button variant="primary" fullWidth>
                Continuar al checkout
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}