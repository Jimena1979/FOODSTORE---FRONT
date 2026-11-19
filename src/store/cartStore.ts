import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  stockMax?: number;
  imagen_url?: string | null;
}

export interface AddCartItemInput {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad?: number;
  stockMax?: number;
  imagen_url?: string | null;
}

interface CartState {
  items: CartItem[];
  agregar: (item: AddCartItemInput) => void;
  quitar: (producto_id: number) => void;
  cambiarCantidad: (producto_id: number, cantidad: number) => void;
  vaciar: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      agregar: (input: AddCartItemInput) => {
        const cantidadSumar = Math.max(1, input.cantidad ?? 1);
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.producto_id === input.producto_id
          );

          if (existingIndex >= 0) {
            const actual = state.items[existingIndex];
            const limite = input.stockMax ?? actual.stockMax;
            const nuevaCantidad =
              limite !== undefined
                ? Math.min(actual.cantidad + cantidadSumar, limite)
                : actual.cantidad + cantidadSumar;

            const updated = [...state.items];
            updated[existingIndex] = {
              ...actual,
              nombre: input.nombre,
              precio_unitario: input.precio_unitario,
              stockMax: limite,
              imagen_url: input.imagen_url ?? actual.imagen_url,
              cantidad: nuevaCantidad,
            };
            return { items: updated };
          }

          const cantidadInicial =
            input.stockMax !== undefined
              ? Math.min(cantidadSumar, input.stockMax)
              : cantidadSumar;

          if (cantidadInicial <= 0) {
            return { items: state.items };
          }

          const nuevoItem: CartItem = {
            producto_id: input.producto_id,
            nombre: input.nombre,
            precio_unitario: input.precio_unitario,
            cantidad: cantidadInicial,
            stockMax: input.stockMax,
            imagen_url: input.imagen_url,
          };

          return { items: [...state.items, nuevoItem] };
        });
      },

      quitar: (producto_id: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.producto_id !== producto_id),
        }));
      },

      cambiarCantidad: (producto_id: number, cantidad: number) => {
        set((state) => {
          if (cantidad <= 0) {
            return {
              items: state.items.filter((item) => item.producto_id !== producto_id),
            };
          }
          return {
            items: state.items.map((item) => {
              if (item.producto_id !== producto_id) {
                return item;
              }
              const cantidadAjustada =
                item.stockMax !== undefined
                  ? Math.min(cantidad, item.stockMax)
                  : cantidad;
              return { ...item, cantidad: Math.max(1, cantidadAjustada) };
            }),
          };
        });
      },

      vaciar: () => {
        set({ items: [] });
      },

      total: () => {
        return get().items.reduce(
          (acc, item) => acc + item.precio_unitario * item.cantidad,
          0
        );
      },
    }),
    {
      name: "foodstore-cart",
    }
  )
);