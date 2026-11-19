import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

interface EstadoErrorProps {
  mensaje: string;
  onReintentar?: () => void;
}

export function EstadoError({ mensaje, onReintentar }: EstadoErrorProps) {
  return (
    <Card className="border-red-200 bg-red-50/40 py-8 text-center">
      <p className="text-sm font-medium text-red-700">{mensaje}</p>
      {onReintentar && (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" size="sm" onClick={onReintentar}>
            Reintentar
          </Button>
        </div>
      )}
    </Card>
  );
}