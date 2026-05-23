import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { getCurrentUser } from "../shared/services/api";

type User = {
  id?: number;
  name?: string;
  fullName?: string;
  role?: string;
};

//Função para extrair iniciais do nome do usuário, considerando variações de nome completo ou nome de usuário
function getInitials(name?: string): string {
  return name ? name.substring(0, 2).toUpperCase() : "UI";
}

export function PrivateLayout() {
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("Atendente");

  useEffect(() => {
    async function fetchUser() {
      try {
        const user: User = await getCurrentUser();
        const name = user?.name ?? user?.fullName ?? "";
        setUserName(name);
        setUserRole(user?.role ?? "Atendente");
      } catch (err) {
        console.error("Falha ao carregar dados", err);
      }
    }
    fetchUser();
  }, []);

  const initials = getInitials (userName);

  return (
    <div className="min-h-screen flex bg-[#f7f2ee] text-[#3b2b20]">
      <aside className="w-64 bg-white border-r border-[#e9e0d9]">
        <div className="p-6 border-b">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#8B6F47] flex items-center justify-center text-white">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="font-semibold">CafeSystem</div>
              <div className="text-xs text-[#8D6E63]">Gestão de Comandas</div>
            </div>
          </Link>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#e9ded6] flex items-center justify-center text-sm">{initials}</div>
            <div>
              <div className="font-medium">{userName || "Usuário não identificado"}</div>
              <div className="text-xs text-[#8D6E63]">{userRole}</div>
            </div>
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            <Link to="/orders" className="flex items-center gap-3 p-3 rounded hover:bg-[#fbf7f3]">
              <span className="text-[#8D6E63]">📋</span>
              <span className="text-sm">Comandas</span>
            </Link>
            <Link to="/products" className="flex items-center gap-3 p-3 rounded hover:bg-[#fbf7f3]">
              <span className="text-[#8D6E63]">📦</span>
              <span className="text-sm">Produtos</span>
            </Link>
          </nav>
        </div>
      </aside>

      <div className="flex-1">
        <main className="p-6 h-screen overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
