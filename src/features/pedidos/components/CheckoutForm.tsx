import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { handleApiError } from "@/shared/api/handleApiError";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";
import type { FormaPago, PedidoCreate } from "../types/pedido";

interface CheckoutFormProps {
  total: number;
  disabledItems: boolean;
  onSubmitPedido: (payload: Omit<PedidoCreate, "items">) => Promise<void>;
}

interface CheckoutFormValues {
  direccion_entrega: string;
  forma_pago: FormaPago;
  notas: string;
}

export function CheckoutForm({
  total,
  disabledItems,
  onSubmitPedido,
}: CheckoutFormProps) {
  const [errorSubmit, setErrorSubmit] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      direccion_entrega: "",
      forma_pago: "EFECTIVO" as FormaPago,
      notas: "",
    } satisfies CheckoutFormValues,
    onSubmit: async ({ value }) => {
      setErrorSubmit(null);
      const direccion = value.direccion_entrega.trim();
      const notasVal = value.notas.trim();

      if (direccion.length < 5 || direccion.length > 200) {
        setErrorSubmit(
          "La dirección de entrega debe tener entre 5 y 200 caracteres"
        );
        return;
      }

      if (notasVal.length > 300) {
        setErrorSubmit("Las notas no pueden superar los 300 caracteres");
        return;
      }

      try {
        await onSubmitPedido({
          direccion_entrega: direccion,
          forma_pago: value.forma_pago,
          notas: notasVal.length > 0 ? notasVal : null,
        });
      } catch (err: unknown) {
        setErrorSubmit(handleApiError(err, "No se pudo confirmar el pedido"));
      }
    },
  });

  return (
    <Card className="p-6">
      <h2 className="mb-1 text-lg font-semibold text-stone-900">
        Datos de entrega y pago
      </h2>
      <p className="mb-5 text-sm text-stone-600">
        Completá tu dirección y elegí la forma de pago (sin pasarela online).
      </p>

      {errorSubmit && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {errorSubmit}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="direccion_entrega"
          validators={{
            onChange: ({ value }) => {
              const len = value.trim().length;
              if (len < 5 || len > 200) {
                return "La dirección debe tener entre 5 y 200 caracteres";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <Input
              label="Dirección de entrega"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                field.state.meta.isTouched
                  ? field.state.meta.errors[0]
                  : undefined
              }
              placeholder="Ej. Av. Corrientes 1234, Piso 2"
            />
          )}
        </form.Field>

        <form.Field name="forma_pago">
          {(field) => (
            <div>
              <label
                htmlFor="forma-pago"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Forma de pago
              </label>
              <select
                id="forma-pago"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value as FormaPago)
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
              </select>
            </div>
          )}
        </form.Field>

        <form.Field
          name="notas"
          validators={{
            onChange: ({ value }) =>
              value.trim().length > 300
                ? "Máximo 300 caracteres"
                : undefined,
          }}
        >
          {(field) => (
            <Input
              label="Notas (opcional)"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                field.state.meta.isTouched
                  ? field.state.meta.errors[0]
                  : undefined
              }
              placeholder="Ej. Timbre 4B, sin cebolla"
            />
          )}
        </form.Field>

        <div className="flex items-center justify-between border-t border-stone-200 pt-4">
          <span className="text-base font-medium text-stone-700">Total a pagar</span>
          <span className="text-2xl font-bold text-stone-900">
            ${total.toFixed(2)}
          </span>
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!canSubmit || isSubmitting || disabledItems}
            >
              {isSubmitting ? "Confirmando pedido..." : "Confirmar pedido"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </Card>
  );
}