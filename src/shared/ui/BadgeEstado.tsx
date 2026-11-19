export type EstadoPedido =
  | "PENDIENTE"
  | "EN_PREPARACION"
  | "ENTREGADO"
  | "CANCELADO";

interface BadgeEstadoProps {
  estado: string;
}

const ESTADO_STYLES: Record<EstadoPedido, { label: string; classes: string }> = {
  PENDIENTE: {
    label: "Pendiente",
    classes: "bg-amber-100 text-amber-800 border-amber-200",
  },
  EN_PREPARACION: {
    label: "En preparación",
    classes: "bg-sky-100 text-sky-800 border-sky-200",
  },
  ENTREGADO: {
    label: "Entregado",
    classes: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  CANCELADO: {
    label: "Cancelado",
    classes: "bg-red-100 text-red-800 border-red-200",
  },
};

export function BadgeEstado({ estado }: BadgeEstadoProps) {
  const normalized = estado as EstadoPedido;
  const config = ESTADO_STYLES[normalized] ?? {
    label: estado,
    classes: "bg-stone-100 text-stone-800 border-stone-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.classes}`}
    >
      {config.label}
    </span>
  );
}