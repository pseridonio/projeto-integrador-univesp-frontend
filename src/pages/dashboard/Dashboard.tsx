import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, DollarSign, FileText } from "lucide-react";
import { apiGet } from "../../shared/services/api";

type Pedido = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

type Comanda = {
  id: number;
  number?: number;
  status?: string;
  pedidos?: Pedido[];
  total?: number;
  items?: number;
  openedAt?: string;
};

type User = {
  id?: number;
  name?: string;
  fullName?: string;
};

function isStatusInUse(status?: string) {
  if (!status) return false;
  return /EM[_ -]?USO|EMUSO|EM USO|EM-USO|EM_USO|IN[_ -]?USE|INUSE|in-use/i.test(status);
}

function isStatusClosed(status?: string) {
  if (!status) return false;
  return /FECHAD|FECHADA|FECHADO|CLOSED/i.test(status);
}

export function DashboardPage() {
  const [commands, setCommands] = useState<Comanda[]>([]);
  const [topProducts, setTopProducts] = useState<Array<{ name: string; qty: number; price?: number }>>([]);
  const [dailySales, setDailySales] = useState<number>(0);
  const [openCommands, setOpenCommands] = useState<number>(0);
  const [attendantName, setAttendantName] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const base = import.meta.env.VITE_API_BASE_URL ?? "";
        const cmds: Comanda[] = await apiGet(`${base}/comandas`);
        setCommands(cmds || []);

        const open = (cmds || []).filter((c) => isStatusInUse(c.status)).length;
        setOpenCommands(open);

        const closed = (cmds || []).filter((c) => isStatusClosed(c.status));
        const sales = closed.reduce((s, c) => s + (c.total ?? 0), 0);
        setDailySales(sales);

        // aggregate top products from closed commands
        const productMap = new Map<string, { name: string; qty: number; price?: number }>();
        closed.forEach((c) => {
          (c.pedidos || []).forEach((p) => {
            const key = p.id ? String(p.id) : p.name;
            const entry = productMap.get(key) ?? { name: p.name, qty: 0, price: p.price };
            entry.qty += p.qty || 0;
            productMap.set(key, entry);
          });
        });
        const tops = Array.from(productMap.values()).sort((a, b) => b.qty - a.qty).slice(0, 6);
        setTopProducts(tops);

        // load attendant / user
        try {
          const user: User = await apiGet(`${base}/users/me`);
          setAttendantName(user?.name ?? user?.fullName ?? "");
        } catch (e) {
          // ignore if user endpoint not available
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    }
    load();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-[#e9e0d9] px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#3E2723]">Dashboard</h1>
          <p className="text-sm text-[#8D6E63]">Visão geral do sistema</p>
          {attendantName ? <p className="text-sm text-[#8D6E63]">Atendente: {attendantName}</p> : null}
        </div>
        <button
          className=" w-full sm:w-auto bg-[#8B4513] text-white px-5 py-3 rounded-xl hover:bg-[#5D2E1A] transition-colors flex itens-center gap-2"
          onClick={() => navigate('/NewOrder') }
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Abrir nova comanda</span>
        </button>
      </header>

      <main className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8D6E63] mb-1">Comandas Abertas</p>
                <p className="text-3xl text-[#3E2723]">{openCommands}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#F9A825]/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#F9A825]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8D6E63] mb-1">Vendas do Dia</p>
                <p className="text-3xl text-[#3E2723]">R$ {dailySales.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#558B2F]/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#558B2F]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
          <h3 className="text-[#3E2723] mb-6">Produtos Mais Vendidos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topProducts.map((product, idx) => (
              <button
                key={`${product.name}-${idx}`}
                className="bg-[#F5F1ED] rounded-xl p-4 hover:bg-[#EFEBE9] transition-colors text-left border border-[#D7CCC8]"
              >
                <p className="text-sm text-[#3E2723] mb-1">{product.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8D6E63]">Vendidos: {product.qty}</span>
                  <span className="text-sm text-[#8B4513]">{product.price ? `R$ ${product.price.toFixed(2)}` : ""}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
