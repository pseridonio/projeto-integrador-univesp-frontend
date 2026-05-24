import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, ChevronRight } from "lucide-react";

type CommandStatus = "available" | "open" | "closed"
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
  number: number;        // número da comanda
  status: CommandStatus; // status da comanda
  orders: OrderItem[];   // itens adicionados
  total: number;         // valor total
  items: number;         // quantidade de itens
  openedAt: string;      // horário de abertura
}

// Funções de transição de estado
function handleAbrir(id: number) {
  setComandas((prev) => {
    const next = prev.map((c) => {
      if (c.id !== id) return c;
      return {
        ...c,
        status: "open",
        openedAt: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
    });
    localStorage.setItem("comandas", JSON.stringify(next));
    return next;
  });
}

function handleFechar(id: number) {
  setComandas((prev) => {
    const next = prev.map((c) => {
      if (c.id !== id) return c;
      return { ...c, status: "closed" };
    });
    localStorage.setItem("comandas", JSON.stringify(next));
    return next;
  });
}

function handlePagamento(id: number) {
  setComandas((prev) => {
    const next = prev.map((c) => {
      if (c.id !== id) return c;
      return { ...c, status: "closed" }; // ou "paid" se quiser criar um novo status
    });
    localStorage.setItem("comandas", JSON.stringify(next));
    return next;
  });
}

export function OrderPage() {
  const navigate = useNavigate();

  // Inicializa 20 comandas disponíveis
  const [comandas, setComandas] = useState<Command[]>(() => {
    const saved = localStorage.getItem("comandas");
    if (saved) return JSON.parse(saved) as Command[];

    const initial: Command[] = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      number: 100 + (i + 1),
      status: "available",
      orders: [], // <-- sempre inicializar
      total: 0,
      items: 0,
      openedAt: "",
    }));
    return initial;
  });

  // Atualiza comanda e persiste
  const updateComanda = (updated: Command) => {
    setComandas((prev) => {
      const next = prev.map((c) => (c.id === updated.id ? updated : c));
      localStorage.setItem("comandas", JSON.stringify(next));
      return next;
    });
  };

  function handleAbrir(id: number) {
    const c = comandas.find((x) => x.id === id);
    const updated = abrirComanda(c);
    if (updated) updateComanda(updated);
  }

  function handleFechar(id: number) {
    const c = comandas.find((x) => x.id === id);
    const updated = fecharComanda(c);
    if (updated) updateComanda(updated);
  }

  function handlePagamento(id: number) {
    const c = comandas.find((x) => x.id === id);
    const updated = finalizarPagamento(c);
    if (updated) updateComanda(updated);
  }

  // Catálogo de produtos vindo da página Products
const [products, setProducts] = useState<Product[]>(() => {
  try {
    const raw = localStorage.getItem("products");
    if (raw) return JSON.parse(raw) as Product[];
  } catch (e) {
    console.error("Failed to parse products from localStorage", e);
  }
  return [];
});

  // Adicionar produto vindo da página products
  function handleAddProduct(id: number, productId: number) {
    const product: Product | undefined = products.find((p: Product) => p.id === productId);
    if (!product) return;

    setComandas((prev) => {
      const next = prev.map((c) => {
        if (c.id !== id || c.status !== "open") return c;
        const nextPid = Date.now();
        const orders = [...c.orders, { id: nextPid, name: product.name, price: product.price, qty: 1 }];
        const total = orders.reduce((s, p) => s + p.price * p.qty, 0);
        const items = orders.reduce((s, p) => s + p.qty, 0);
        return { ...c, orders, total, items };
      });
      localStorage.setItem("comandas", JSON.stringify(next));
      return next;
    });
  }

  const getStatusColor = (status: CommandStatus) => {
    switch (status) {
      case "available": return "bg-[#558B2F] text-white";
      case "open": return "bg-[#F9A825] text-white";
      case "closed": return "bg-[#C62828] text-white";
    }
  };

  const getStatusLabel = (status: CommandStatus) => {
    switch (status) {
      case "available": return "Disponível";
      case "open": return "Em uso";
      case "closed": return "Fechada";
    }
  };

 return (
  <div className="flex-1 flex flex-col">
    <header className="bg-white border-b border-[#D7CCC8] px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#3E2723]">Orders</h1>
          <p className="text-sm text-[#8D6E63]">Order management</p>
        </div>
      </div>
    </header>

    <main className="flex-1 p-8 overflow-auto">
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
          <p className="text-sm text-[#8D6E63] mb-2">Available</p>
          <p className="text-3xl text-[#558B2F]">
            {comandas.filter((c) => c.status === "available").length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
          <p className="text-sm text-[#8D6E63] mb-2">In Use</p>
          <p className="text-3xl text-[#F9A825]">
            {comandas.filter((c) => c.status === "open").length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
          <p className="text-sm text-[#8D6E63] mb-2">Closed</p>
          <p className="text-3xl text-[#C62828]">
            {comandas.filter((c) => c.status === "closed").length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8] mb-8">
        <h3 className="text-[#3E2723] mb-6">Order List</h3>
        <div className="grid grid-cols-2 gap-4">
          {comandas.map((command) => (
            <div
              key={command.id}
              className="bg-[#F5F1ED] rounded-xl p-5 border border-[#D7CCC8] hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-[#3E2723]">Order #{command.number}</h4>
                  {command.openedAt && (
                    <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
                      <Clock className="w-3 h-3" />
                      <span>{command.openedAt}</span>
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs px-3 py-1.5 rounded-full ${getStatusColor(command.status)}`}
                >
                  {getStatusLabel(command.status)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8D6E63]">Items</span>
                  <span className="text-[#3E2723]">{command.items}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8D6E63]">Subtotal</span>
                  <span className="text-lg text-[#8B4513]">
                    R$ {command.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAbrir(command.id)}
                  className="flex-1 bg-[#558B2F] text-white py-2.5 rounded-lg hover:bg-[#33691E] transition-colors"
                >
                  Open
                </button>
                <button
                  onClick={() => handleFechar(command.id)}
                  className="flex-1 bg-[#F9A825] text-white py-2.5 rounded-lg hover:bg-[#F57F17] transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handlePagamento(command.id)}
                  className="flex-1 bg-[#C62828] text-white py-2.5 rounded-lg hover:bg-[#8E0000] transition-colors"
                >
                  Pay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
    </div>
  )
}