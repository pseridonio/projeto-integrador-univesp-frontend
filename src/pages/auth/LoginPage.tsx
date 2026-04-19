import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Coffee, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Login attempt:", { email, password });
      // Simulação de sucesso
      localStorage.setItem("authToken", "demo-token");
      navigate("/dashboard");
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf7f3] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-[0_10px_30px_rgba(139,111,71,0.08)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#8B6F47] mb-4 shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
            <Coffee className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-[#3b2b20] mb-2 text-3xl font-semibold">Bem-vindo</h1>
          <p className="text-[#7a6250] text-sm">CafeSystem</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex items-center border border-[#e6dcd3] rounded-full px-4 py-3 shadow-sm bg-white">
            <Mail className="w-5 h-5 text-[#bfaea0] mr-3" />
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 outline-none text-[#4b3a30] placeholder-[#cbbfb4] bg-transparent"
            />
          </div>

          <div className="flex items-center border border-[#e6dcd3] rounded-full px-4 py-3 shadow-sm bg-white">
            <Lock className="w-5 h-5 text-[#bfaea0] mr-3" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 outline-none text-[#4b3a30] placeholder-[#cbbfb4] bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-3 text-[#8b6f47]"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#8B6F47] text-white py-3 rounded-full text-lg font-medium shadow-[0_6px_18px_rgba(139,111,71,0.16)] hover:bg-[#7a5a3a] transition"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-sm text-gray-600">Não tem uma conta? </span>
          <a href="/novo-usuario" className="text-sm font-medium text-[#C85A1E] ml-1">
            Cadastre-se
          </a>
        </div>
      </div>
    </div>
  );
}

