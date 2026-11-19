import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { useAuthStore } from "@/store/authStore";
import { handleApiError } from "@/shared/api/handleApiError";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setErrorMsg(null);
      try {
        await login({
          username: value.username.trim(),
          password: value.password,
        });
        navigate("/");
      } catch (err: unknown) {
        setErrorMsg(handleApiError(err, "No se pudo iniciar sesión"));
      }
    },
  });

  return (
    <div className="mx-auto max-w-md py-8">
      <Card className="p-6">
        <h1 className="mb-1 text-2xl font-bold text-stone-900">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-stone-600">
          Ingresá con tu usuario y contraseña para operar en Food Store.
        </p>

        {errorMsg && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {errorMsg}
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
            name="username"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "El usuario es obligatorio" : undefined,
            }}
          >
            {(field) => (
              <Input
                label="Usuario"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors[0]
                    : undefined
                }
                placeholder="ej. admin o cliente1"
                autoComplete="username"
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                value.length === 0 ? "La contraseña es obligatoria" : undefined,
            }}
          >
            {(field) => (
              <Input
                label="Contraseña"
                type="password"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors[0]
                    : undefined
                }
                placeholder="••••••••"
                autoComplete="current-password"
              />
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                fullWidth
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="mt-5 text-center text-sm text-stone-600">
          ¿No tenés cuenta?{" "}
          <Link
            to="/register"
            className="font-medium text-amber-700 hover:underline"
          >
            Registrate acá
          </Link>
        </p>
      </Card>
    </div>
  );
}