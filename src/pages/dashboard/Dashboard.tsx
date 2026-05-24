import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, DollarSign, FileText } from "lucide-react";

interface Command {
  id: number;
  itens: { name: string; price: number }[];
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export function DashboardPage() {
  // Mock inicial de comandas abertas
  const [comandas, setComandas] = useState<Command[]>([
    { id: 101, itens: [{ name: "Café Expresso", price: 5.5 }, { name: "Pão de Queijo", price: 6.5 }] },
    { id: 102, itens: [{ name: "Cappuccino", price: 8.0 }] },
    { id: 104, itens: [{ name: "Croissant", price: 7.0 }, { name: "Suco Natural", price: 9.0 }] },
    { id: 105, itens: [{ name: "Bolo de Cenoura", price: 8.5 }] },
  ]);

  const topProducts: Product[] = [
    { id: 1, name: "Café Expresso", price: 5.5, category: "Bebidas" },
    { id: 2, name: "Cappuccino", price: 8.0, category: "Bebidas" },
    { id: 3, name: "Pão de Queijo", price: 6.5, category: "Alimentos" },
    { id: 4, name: "Croissant", price: 7.0, category: "Alimentos" },
    { id: 5, name: "Suco Natural", price: 9.0, category: "Bebidas" },
    { id: 6, name: "Bolo de Cenoura", price: 8.5, category: "Alimentos" },
  ];

  // Quantidade de comandas abertas
  const openCommands = comandas.length;

  // Soma do valor total das comandas
  const dailySales = comandas.reduce(
    (total, comanda) =>
      total + comanda.itens.reduce((soma, item) => soma + item.price, 0),
    0
  );

  const navigate = useNavigate();

  // Função para abrir nova comanda mockada
  /*const abrirNovaComanda = () => {
    const nova = {
      id: comandas.length + 200,
      itens: [{ name: "Café Expresso", price: 5.5 }],
    };
    setComandas([...comandas, nova]);
  };

  // Função para fechar uma comanda (remover do array)
  const fecharComanda = (id: number) => {
    setComandas(comandas.filter((c) => c.id !== id));
  };*/

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