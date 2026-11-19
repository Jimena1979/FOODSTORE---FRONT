import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

export function UnauthorizedPage() {
  return (
    <div className="mx-auto max-w-md py-12">
      <Card className="p-6 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Sin permiso</h1>
        <p className="mt-2 text-sm text-stone-600">
          No tenés los permisos necesarios para acceder a esta sección.
        </p>
        <div className="mt-6 flex justify-center">
          <Link to="/">
            <Button variant="primary">Volver al inicio</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}