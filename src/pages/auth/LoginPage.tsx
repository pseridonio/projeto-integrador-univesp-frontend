import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TODO: Integrar com serviço de autenticação
      console.log('Login attempt:', { email, password });

      // Simulação de sucesso - remover após integração com backend
      // navigate('/dashboard');
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error('Erro ao fazer login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Título */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#8B6F47]">
            <svg
              className="h-12 w-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14 4h3a2 2 0 012 2v3a2 2 0 01-2 2h-3V4zm0 0h-4a2 2 0 00-2 2v3a2 2 0 002 2h4V4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 18v-2a2 2 0 012-2h6a2 2 0 012 2v2M10 10h4M10 14h4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-foreground">Bem-vindo</h1>
          <p className="mt-2 text-base text-muted-foreground">CafeSystem</p>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-base text-foreground">
              E-mail
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="E-mail"
                className="w-full rounded-lg border border-border bg-input-background py-3 pl-12 pr-4 text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="mb-2 block text-base text-foreground">
              Senha
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Senha"
                className="w-full rounded-lg border border-border bg-input-background py-3 pl-12 pr-12 text-foreground placeholder-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
              />
              <button
                type="button"
                onClick={handleTogglePasswordVisibility}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-4 flex items-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Link Esqueci Senha */}
          <div className="flex justify-end">
            <a
              href="/esqueceu-senha"
              className="text-sm font-medium text-[#C85A1E] transition-colors hover:text-[#A84715]"
            >
              Esqueci a senha
            </a>
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg border border-border bg-card py-3 font-medium text-foreground transition-all hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Link Cadastro */}
        <div className="text-center">
          <span className="text-sm text-muted-foreground">Não tem uma conta? </span>
          <a
            href="/novo-usuario"
            className="text-sm font-medium text-[#C85A1E] transition-colors hover:text-[#A84715]"
          >
            Cadastre-se
          </a>
        </div>
      </div>
    </div>
  );
}

