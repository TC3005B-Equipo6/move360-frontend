import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button/Button";
import { Input } from "../../components/common/Input/Input";
import { login, validateToken } from "../../services/auth/authService";

type LoginError = {
  code?: string;
  response?: {
    status?: number;
  };
};

export default function LoginScreen() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMissingUser = Boolean(error) && !user;
  const isMissingPassword = Boolean(error) && !password;
  const formError = error && user && password ? error : "";

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !password) {
      setError("Completa todos los campos");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const token = await login(user, password);

      localStorage.setItem("token", token);
      await validateToken();

      navigate("/home");
    } catch (error: unknown) {
      const loginError = error as LoginError;
      if (
        loginError.code === "auth/invalid-credential" ||
        loginError.code === "auth/wrong-password" ||
        loginError.code === "auth/user-not-found"
      ) {
        setError("Correo o contraseña incorrectos");
      } else if (loginError.code === "auth/invalid-email") {
        setError("Ingresa un correo válido");
      } else if (loginError.response?.status === 401) {
        setError("Token inválido");
      } else {
        setError("Ocurrió un error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-primary p-4 text-content-primary antialiased sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1120px] overflow-hidden rounded-2xl bg-surface-raised shadow-xl ring-1 ring-border-subtle sm:min-h-[calc(100vh-3rem)] lg:min-h-[640px] lg:grid-cols-[minmax(420px,0.9fr)_1.1fr]">
        <section className="flex min-h-[620px] flex-col justify-center px-6 py-8 sm:px-10 lg:px-14">
          <div className="w-full max-w-[380px]">
            <img src="/move360.png" alt="Move360" className="mb-12 w-[142px]" />

            <div className="mb-9">
              <p className="mb-3 text-caption font-bold uppercase text-accent">Análisis de movilidad</p>
              <h1 className="m-0 max-w-[360px] text-h1 font-bold text-content-primary [text-wrap:balance]">
                Bienvenido a Move360
              </h1>
              <p className="mt-3 max-w-[340px] text-body-sm text-content-secondary [text-wrap:pretty]">
                Ingresa para consultar y construir tableros de movilidad con datos de la Ciudad de México.
              </p>
            </div>

            <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit} noValidate>
              <Input
                label="Correo"
                type="email"
                autoComplete="username"
                placeholder="ejemplo@move360.com"
                value={user}
                disabled={isSubmitting}
                error={isMissingUser ? "Ingresa tu correo" : undefined}
                onChange={(e) => {
                  setUser(e.currentTarget.value);
                  if (error) setError("");
                }}
              />

              <Input
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                showPasswordToggle
                value={password}
                disabled={isSubmitting}
                error={isMissingPassword ? "Ingresa tu contraseña" : undefined}
                onChange={(e) => {
                  setPassword(e.currentTarget.value);
                  if (error) setError("");
                }}
              />

              {formError && (
                <p className="m-0 rounded-md bg-danger-subtle px-3 py-2 text-body-sm font-medium text-danger" role="alert">
                  {formError}
                </p>
              )}

              <Button
                type="submit"
                label={isSubmitting ? "Iniciando sesión" : "Iniciar sesión"}
                size="large"
                isLoading={isSubmitting}
                className="mt-1 w-full"
              />

              <button
                type="button"
                className="min-h-10 self-center rounded-sm px-2 text-body-sm font-semibold text-primary transition-[color,transform] duration-200 ease-out hover:text-primary-hover active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          </div>
        </section>

        <div className="relative hidden min-h-[640px] overflow-hidden bg-primary lg:block">
          <img
            src="/city.png"
            alt=""
            className="h-full w-full object-cover opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/20 to-accent/30" />
        </div>
      </div>
    </main>
  );
}
