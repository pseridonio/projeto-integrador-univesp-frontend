import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, DollarSign, FileText } from "lucide-react";

type TableStatus = "available" | "in-use" | "closed";

interface Table {
  id: number;
  status: TableStatus;
  commandNumber?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export function DashboardPage() {
  const [activeMenu] = useState("mapa-mesas");

  const tables: Table[] = [
    { id: 1, status: "in-use", commandNumber: 101 },
    { id: 2, status: "available" },
    { id: 3, status: "in-use", commandNumber: 102 },
    { id: 4, status: "closed", commandNumber: 103 },
    { id: 5, status: "available" },
    { id: 6, status: "in-use", commandNumber: 104 },
    { id: 7, status: "available" },
    { id: 8, status: "in-use", commandNumber: 105 },
    { id: 9, status: "closed", commandNumber: 106 },
    { id: 10, status: "available" },
  ];

  const topProducts: Product[] = [
    { id: 1, name: "Café Expresso", price: 5.5, category: "Bebidas" },
    { id: 2, name: "Cappuccino", price: 8.0, category: "Bebidas" },
    { id: 3, name: "Pão de Queijo", price: 6.5, category: "Alimentos" },
    { id: 4, name: "Croissant", price: 7.0, category: "Alimentos" },
    { id: 5, name: "Suco Natural", price: 9.0, category: "Bebidas" },
    { id: 6, name: "Bolo de Cenoura", price: 8.5, category: "Alimentos" },
  ];

  const openCommands = tables.filter((t) => t.status === "in-use").length;
  const dailySales = 1247.8;

  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-[#e9e0d9] px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#3E2723]">Dashboard</h1>
          <p className="text-sm text-[#8D6E63]">Visão geral do sistema</p>
        </div>
        <button
          className="bg-[#8B4513] text-white px-5 py-3 rounded-xl hover:bg-[#5D2E1A] transition-colors flex items-center gap-2"
          onClick={() => navigate('/orders')}
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
            {topProducts.map((product) => (
              <button
                key={product.id}
                className="bg-[#F5F1ED] rounded-xl p-4 hover:bg-[#EFEBE9] transition-colors text-left border border-[#D7CCC8]"
              >
                <p className="text-sm text-[#3E2723] mb-1">{product.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8D6E63]">{product.category}</span>
                  <span className="text-sm text-[#8B4513]">R$ {product.price.toFixed(2)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
