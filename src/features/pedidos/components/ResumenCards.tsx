import { Card } from "@/shared/ui/Card";
import type { ResumenPedidos } from "../types/pedido";

interface ResumenCardsProps {
  resumen: ResumenPedidos;
}

export function ResumenCards({ resumen }: ResumenCardsProps) {
  const tarjetas = [
    {
      titulo: "Pendientes",
      valor: String(resumen.pendientes),
      estilo: "text-amber-700",
    },
    {
      titulo: "En preparación",
      valor: String(resumen.en_preparacion),
      estilo: "text-sky-700",
    },
    {
      titulo: "Entregados",
      valor: String(resumen.entregados),
      estilo: "text-emerald-700",
    },
    {
      titulo: "Cancelados",
      valor: String(resumen.cancelados),
      estilo: "text-red-700",
    },
    {
      titulo: "Pedidos hoy",
      valor: String(resumen.pedidos_hoy),
      estilo: "text-stone-900",
    },
    {
      titulo: "Ingresos entregados",
      valor: `$${resumen.ingresos_entregados.toFixed(2)}`,
      estilo: "text-emerald-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tarjetas.map((item) => (
        <Card key={item.titulo} className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            {item.titulo}
          </p>
          <p className={`mt-2 text-3xl font-bold ${item.estilo}`}>
            {item.valor}
          </p>
        </Card>
      ))}
    </div>
  );
}