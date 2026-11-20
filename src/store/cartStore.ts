import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/store/authStore";

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

export function getCartOwnerKey(userId: number | null | undefined): string {
  return userId !== null && userId !== undefined ? `user-${userId}` : "guest";
}

interface CartState {
  cartsByUser: Record<string, CartItem[]>;
  agregar: (item: AddCartItemInput, userId?: number | null) => void;
  quitar: (producto_id: number, userId?: number | null) => void;
  cambiarCantidad: (
    producto_id: number,
    cantidad: number,
    userId?: number | null
  ) => void;
  vaciar: (userId?: number | null) => void;
  mergeGuestCartToUser: (userId: number) => void;
  itemsForUser: (userId?: number | null) => CartItem[];
  total: (userId?: number | null) => number;
}

function resolveUserId(explicitUserId?: number | null): number | null {
  if (explicitUserId !== undefined) {
    return explicitUserId;
  }
  return useAuthStore.getState().usuario?.id ?? null;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartsByUser: {},

      itemsForUser: (userId?: number | null): CartItem[] => {
        const key = getCartOwnerKey(resolveUserId(userId));
        return get().cartsByUser[key] ?? [];
      },

      mergeGuestCartToUser: (userId: number) => {
        const userKey = getCartOwnerKey(userId);
        set((state) => {
          const guestItems = state.cartsByUser["guest"] ?? [];
          if (guestItems.length === 0) {
            return { cartsByUser: state.cartsByUser };
          }

          const existingUserItems = state.cartsByUser[userKey] ?? [];
          const mergedMap = new Map<number, CartItem>();

          for (const item of existingUserItems) {
            mergedMap.set(item.producto_id, { ...item });
          }

          for (const guestItem of guestItems) {
            const actual = mergedMap.get(guestItem.producto_id);
            if (actual) {
              const limite = guestItem.stockMax ?? actual.stockMax;
              const suma = actual.cantidad + guestItem.cantidad;
              mergedMap.set(guestItem.producto_id, {
                ...actual,
                nombre: guestItem.nombre,
                precio_unitario: guestItem.precio_unitario,
                stockMax: limite,
                imagen_url: guestItem.imagen_url ?? actual.imagen_url,
                cantidad: limite !== undefined ? Math.min(suma, limite) : suma,
              });
            } else {
              mergedMap.set(guestItem.producto_id, { ...guestItem });
            }
          }

          return {
            cartsByUser: {
              ...state.cartsByUser,
              guest: [],
              [userKey]: Array.from(mergedMap.values()),
            },
          };
        });
      },

      agregar: (input: AddCartItemInput, userId?: number | null) => {
        const key = getCartOwnerKey(resolveUserId(userId));
        const cantidadSumar = Math.max(1, input.cantidad ?? 1);

        set((state) => {
          const currentItems = state.cartsByUser[key] ?? [];
          const existingIndex = currentItems.findIndex(
            (item) => item.producto_id === input.producto_id
          );

          let nextItems: CartItem[];

          if (existingIndex >= 0) {
            const actual = currentItems[existingIndex];
            const limite = input.stockMax ?? actual.stockMax;
            const nuevaCantidad =
              limite !== undefined
                ? Math.min(actual.cantidad + cantidadSumar, limite)
                : actual.cantidad + cantidadSumar;

            nextItems = [...currentItems];
            nextItems[existingIndex] = {
              ...actual,
              nombre: input.nombre,
              precio_unitario: input.precio_unitario,
              stockMax: limite,
              imagen_url: input.imagen_url ?? actual.imagen_url,
              cantidad: nuevaCantidad,
            };
          } else {
            const cantidadInicial =
              input.stockMax !== undefined
                ? Math.min(cantidadSumar, input.stockMax)
                : cantidadSumar;

            if (cantidadInicial <= 0) {
              return { cartsByUser: state.cartsByUser };
            }

            const nuevoItem: CartItem = {
              producto_id: input.producto_id,
              nombre: input.nombre,
              precio_unitario: input.precio_unitario,
              cantidad: cantidadInicial,
              stockMax: input.stockMax,
              imagen_url: input.imagen_url,
            };

            nextItems = [...currentItems, nuevoItem];
          }

          return {
            cartsByUser: {
              ...state.cartsByUser,
              [key]: nextItems,
            },
          };
        });
      },

      quitar: (producto_id: number, userId?: number | null) => {
        const key = getCartOwnerKey(resolveUserId(userId));
        set((state) => {
          const currentItems = state.cartsByUser[key] ?? [];
          return {
            cartsByUser: {
              ...state.cartsByUser,
              [key]: currentItems.filter(
                (item) => item.producto_id !== producto_id
              ),
            },
          };
        });
      },

      cambiarCantidad: (
        producto_id: number,
        cantidad: number,
        userId?: number | null
      ) => {
        const key = getCartOwnerKey(resolveUserId(userId));
        set((state) => {
          const currentItems = state.cartsByUser[key] ?? [];
          const nextItems =
            cantidad <= 0
              ? currentItems.filter((item) => item.producto_id !== producto_id)
              : currentItems.map((item) => {
                  if (item.producto_id !== producto_id) {
                    return item;
                  }
                  const cantidadAjustada =
                    item.stockMax !== undefined
                      ? Math.min(cantidad, item.stockMax)
                      : cantidad;
                  return { ...item, cantidad: Math.max(1, cantidadAjustada) };
                });

          return {
            cartsByUser: {
              ...state.cartsByUser,
              [key]: nextItems,
            },
          };
        });
      },

      vaciar: (userId?: number | null) => {
        const key = getCartOwnerKey(resolveUserId(userId));
        set((state) => ({
          cartsByUser: {
            ...state.cartsByUser,
            [key]: [],
          },
        }));
      },

      total: (userId?: number | null): number => {
        const key = getCartOwnerKey(resolveUserId(userId));
        const currentItems = get().cartsByUser[key] ?? [];
        return currentItems.reduce(
          (acc, item) => acc + item.precio_unitario * item.cantidad,
          0
        );
      },
    }),
    {
      name: "foodstore-cart",
      partialize: (state) => ({ cartsByUser: state.cartsByUser }),
    }
  )
);
