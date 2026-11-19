import { Button } from "@/shared/ui/Button";

interface PaginacionProps {
  paginaActual: number;
  totalItems: number;
  pageSize: number;
  onCambiarPagina: (nuevaPagina: number) => void;
}

export function Paginacion({
  paginaActual,
  totalItems,
  pageSize,
  onCambiarPagina,
}: PaginacionProps) {
  const totalPaginas = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <span className="text-sm text-stone-600">
        Página <strong className="text-stone-900">{paginaActual + 1}</strong> de{" "}
        <strong className="text-stone-900">{totalPaginas}</strong> ({totalItems}{" "}
        resultados)
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={paginaActual <= 0}
          onClick={() => onCambiarPagina(paginaActual - 1)}
        >
          Anterior
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={paginaActual + 1 >= totalPaginas}
          onClick={() => onCambiarPagina(paginaActual + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}