import { useNavigate } from "react-router-dom";
import { Plus, DollarSign, FileText } from "lucide-react";

type CommandStatus = "available" | "open" | "closed";
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}
interface Command {
  id: number;
  number: number;
  status: CommandStatus;
  orders: OrderItem[];
  total: number;
  items: number;
  openedAt: string;
}

export function DashboardPage() {
  const navigate = useNavigate();

  // Carregar comandas do localStorage
  const comandas: Command[] = (() => {
    try {
      const raw = localStorage.getItem("comandas");
      if (raw) return JSON.parse(raw) as Command[];
    } catch (e) {
      console.error("Failed to parse comandas from localStorage", e);
    }
    return [];
  })();

  // Quantidade de comandas abertas
  const openCommands = comandas.filter((c: Command) => c.status === "open").length;

  // Soma das vendas do dia (apenas comandas encerradas)
  const dailySales = comandas
    .filter((c: Command) => c.status === "closed")
    .reduce((sum: number, c: Command) => sum + c.total, 0);

  // Contagem de produtos vendidos (em todas as comandas)
  const productCount: Record<string, { product: Product; count: number }> = {};
  comandas.forEach((c: Command) => {
    (c.orders ?? []).forEach((p: OrderItem) => {
      if (!productCount[p.name]) {
        productCount[p.name] = {
          product: { id: p.id, name: p.name, price: p.price, category: "Unknown" },
          count: 0,
        };
      }
      productCount[p.name].count += p.qty;
    });
  });

  const topProducts = Object.values(productCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-[#e9e0d9] px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#3E2723]">Dashboard</h1>
          <p className="text-sm text-[#8D6E63]">System overview</p>
        </div>
        <button
          className="bg-[#8B4513] text-white px-5 py-3 rounded-xl hover:bg-[#5D2E1A] transition-colors flex items-center gap-2"
          onClick={() => navigate("/orders")}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Open new order</span>
        </button>
      </header>

      <main className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8D6E63] mb-1">Open Orders</p>
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
                <p className="text-sm text-[#8D6E63] mb-1">Daily Sales</p>
                <p className="text-3xl text-[#3E2723]">
                  R$ {dailySales.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#558B2F]/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#558B2F]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
          <h3 className="text-[#3E2723] mb-6">Top Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topProducts.map(({ product, count }) => (
              <button
                key={product.id}
                className="bg-[#F5F1ED] rounded-xl p-4 hover:bg-[#EFEBE9] transition-colors text-left border border-[#D7CCC8]"
              >
                <p className="text-sm text-[#3E2723] mb-1">{product.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8D6E63]">{product.category}</span>
                  <span className="text-sm text-[#8B4513]">
                    R$ {product.price.toFixed(2)} ({count}x)
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}