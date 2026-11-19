import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import type { ProductoRead } from "../types/producto";

interface ProductoCardProps {
  producto: ProductoRead;
}

export function ProductoCard({ producto }: ProductoCardProps) {
  const agregar = useCartStore((state) => state.agregar);
  const itemsCarrito = useCartStore((state) => state.items);
  const [agregadoFeedback, setAgregadoFeedback] = useState(false);

  const enCarrito =
    itemsCarrito.find((i) => i.producto_id === producto.id)?.cantidad ?? 0;

  const puedeAgregar =
    producto.activo &&
    producto.disponible &&
    producto.stock > 0 &&
    enCarrito < producto.stock;

  const handleAgregar = (): void => {
    if (!puedeAgregar) {
      return;
    }
    agregar({
      producto_id: producto.id,
      nombre: producto.nombre,
      precio_unitario: producto.precio_base,
      cantidad: 1,
      stockMax: producto.stock,
      imagen_url: producto.imagen_url,
    });
    setAgregadoFeedback(true);
    setTimeout(() => setAgregadoFeedback(false), 1200);
  };

  return (
    <Card className="flex h-full flex-col justify-between gap-4">
      <div>
        <div className="mb-3 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-stone-100">
          {producto.imagen_url ? (
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-medium text-stone-400">
              Sin imagen
            </span>
          )}
        </div>

        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            {producto.categoria?.nombre ?? "General"}
          </span>
          <span className="text-xs text-stone-500">
            Stock: <strong className="text-stone-700">{producto.stock}</strong>
          </span>
        </div>

        <h3 className="mt-2 text-lg font-semibold text-stone-900">
          {producto.nombre}
        </h3>

        {producto.descripcion && (
          <p className="mt-1 line-clamp-2 text-sm text-stone-600">
            {producto.descripcion}
          </p>
        )}
      </div>

      <div className="border-t border-stone-100 pt-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xl font-bold text-stone-900">
            ${producto.precio_base.toFixed(2)}
          </span>
          {!producto.disponible || producto.stock <= 0 ? (
            <span className="text-xs font-medium text-red-600">
              No disponible
            </span>
          ) : (
            <span className="text-xs font-medium text-emerald-700">
              Disponible
            </span>
          )}
        </div>

        <Button
          variant="primary"
          fullWidth
          disabled={!puedeAgregar}
          onClick={handleAgregar}
        >
          {agregadoFeedback
            ? "¡Agregado al carrito!"
            : !producto.disponible || producto.stock <= 0
              ? "Sin stock / No disponible"
              : enCarrito >= producto.stock
                ? "Máximo en carrito"
                : "Agregar al carrito"}
        </Button>
      </div>
    </Card>
  );
}