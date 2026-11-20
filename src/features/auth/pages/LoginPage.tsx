import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { useAuthStore } from "@/store/authStore";
import { handleApiError } from "@/shared/api/handleApiError";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
              <div>
                <div className="relative">
                  <Input
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
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
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    className="absolute right-2.5 top-[34px] rounded p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>
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