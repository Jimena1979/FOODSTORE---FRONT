import type { ReactNode } from "react";
import { Card } from "@/shared/ui/Card";

interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
}

export function EstadoVacio({ titulo, descripcion, accion }: EstadoVacioProps) {
  return (
    <Card className="py-10 text-center">
      <p className="text-base font-semibold text-stone-800">{titulo}</p>
      {descripcion && (
        <p className="mt-1 text-sm text-stone-500">{descripcion}</p>
      )}
      {accion && <div className="mt-4 flex justify-center">{accion}</div>}
    </Card>
  );
}