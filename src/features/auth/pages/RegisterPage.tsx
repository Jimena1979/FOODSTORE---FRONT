import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { axiosInstance } from "@/shared/api/axiosInstance";
import { handleApiError } from "@/shared/api/handleApiError";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";

interface RegisterPayload {
  username: string;
  full_name: string;
  email: string;
  password: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      password: "",
    } satisfies RegisterPayload,
    onSubmit: async ({ value }) => {
      setErrorMsg(null);
      setSuccessMsg(null);
      try {
        await axiosInstance.post("/auth/register", {
          username: value.username.trim(),
          full_name: value.full_name.trim(),
          email: value.email.trim(),
          password: value.password,
        });
        setSuccessMsg("Registro exitoso. Ya podés iniciar sesión.");
        setTimeout(() => {
          navigate("/login");
        }, 900);
      } catch (err: unknown) {
        setErrorMsg(handleApiError(err, "No se pudo completar el registro"));
      }
    },
  });

  return (
    <div className="mx-auto max-w-md py-8">
      <Card className="p-6">
        <h1 className="mb-1 text-2xl font-bold text-stone-900">Crear cuenta</h1>
        <p className="mb-6 text-sm text-stone-600">
          Registrate como cliente para hacer pedidos en Food Store.
        </p>

        {errorMsg && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            role="status"
            className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
          >
            {successMsg}
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
                value.trim().length < 3
                  ? "El usuario debe tener al menos 3 caracteres"
                  : undefined,
            }}
          >
            {(field) => (
              <Input
                label="Nombre de usuario"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors[0]
                    : undefined
                }
                placeholder="ej. juanperez"
                autoComplete="username"
              />
            )}
          </form.Field>

          <form.Field
            name="full_name"
            validators={{
              onChange: ({ value }) =>
                value.trim().length < 2
                  ? "El nombre completo es obligatorio"
                  : undefined,
            }}
          >
            {(field) => (
              <Input
                label="Nombre completo"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors[0]
                    : undefined
                }
                placeholder="Juan Pérez"
                autoComplete="name"
              />
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const trimmed = value.trim();
                if (!trimmed || !trimmed.includes("@")) {
                  return "Ingresá un correo electrónico válido";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <Input
                label="Correo electrónico"
                type="email"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  field.state.meta.isTouched
                    ? field.state.meta.errors[0]
                    : undefined
                }
                placeholder="juan@correo.com"
                autoComplete="email"
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                value.length < 8
                  ? "La contraseña debe tener al menos 8 caracteres"
                  : undefined,
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
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
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
                {isSubmitting ? "Registrando..." : "Crear cuenta"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="mt-5 text-center text-sm text-stone-600">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="font-medium text-amber-700 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </Card>
    </div>
  );
}