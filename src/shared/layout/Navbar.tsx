import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { type CartItem, getCartOwnerKey, useCartStore } from "@/store/cartStore";
import { Button } from "@/shared/ui/Button";

const EMPTY_CART: CartItem[] = [];

export function Navbar() {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);
  const ownerKey = getCartOwnerKey(usuario?.id ?? null);
  const rawItems = useCartStore((state) => state.cartsByUser[ownerKey]);
  const items = rawItems ?? EMPTY_CART;

  const cantidadTotalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex flex-wrap items-center gap-5">
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-amber-700"
          >
            Food Store
          </Link>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-700">
            <Link to="/" className="hover:text-amber-700">
              Catálogo
            </Link>

            <Link to="/carrito" className="hover:text-amber-700">
              Carrito ({cantidadTotalItems})
            </Link>

            {usuario && (
              <Link to="/mis-pedidos" className="hover:text-amber-700">
                Mis pedidos
              </Link>
            )}

            {usuario?.role === "admin" && (
              <>
                <Link to="/admin/resumen" className="hover:text-amber-700">
                  Resumen
                </Link>
                <Link to="/admin/categorias" className="hover:text-amber-700">
                  Categorías
                </Link>
                <Link to="/admin/productos" className="hover:text-amber-700">
                  Productos
                </Link>
                <Link to="/admin/pedidos" className="hover:text-amber-700">
                  Pedidos
                </Link>
                <Link to="/admin/usuarios" className="hover:text-amber-700">
                  Usuarios
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {usuario ? (
            <>
              <div className="text-right text-xs">
                <p className="font-semibold text-stone-900">{usuario.full_name}</p>
                <p className="uppercase tracking-wide text-stone-500">
                  {usuario.role}
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}