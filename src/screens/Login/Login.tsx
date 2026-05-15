import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
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

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !password) {
      setError("Completa todos los campos");
      return;
    }

    try {
      setError("");

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
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#154b7c] flex justify-center items-center p-8 box-border">
      <div className="w-[1080px] max-w-full h-[640px] bg-white rounded-[28px] overflow-hidden grid grid-cols-[48%_52%]">
        <div className="pt-[34px] pb-[34px] px-[58px] flex flex-col">
          <img src="/move360.png" alt="move360" className="w-[145px] mb-[70px]" />

          <h1 className="w-full max-w-[330px] font-[Inter,sans-serif] text-[50px] font-bold leading-none tracking-[-1.68px] text-black m-0 mb-[42px] text-center">
            BIENVENIDO
          </h1>

          <form className="w-full max-w-[330px]" onSubmit={handleSubmit}>
            <Input
              label="Correo"
              type="email"
              autoComplete="username"
              placeholder="ejemplo@move360.com"
              value={user}
              onChange={(e) => setUser(e.currentTarget.value)}
            />

            <Input
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              showPasswordToggle
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />

            {error && (
              <p className="text-center text-[15px] text-[#d92d20] font-medium mt-1 mb-0">{error}</p>
            )}

            <Button
              type="submit"
              label="INICIAR SESIÓN"
              className="!w-[180px] !h-[48px] !rounded-[14px] !block mx-auto mt-5"
            />

            <p className="text-center text-[15px] font-bold text-[#154b7c] cursor-pointer mt-[15px] mx-auto mb-0">
              ¿Olvidaste tu contraseña?
            </p>
          </form>
        </div>

        <div className="bg-[url('/city.png')] bg-cover bg-center bg-no-repeat" />
      </div>
    </div>
  );
}
