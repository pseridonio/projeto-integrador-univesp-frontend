import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, ChevronRight } from "lucide-react";

type ComandaStatus = "DISPONIVEL" | "EM_USO" | "FECHADA";

type Pedido = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

type Comanda = {
  id: number;
  number: number;
  status: ComandaStatus;
  pedidos: Pedido[];
  total: number;
  items: number;
  openedAt: string;
};

function abrirComanda(c?: Comanda): Comanda | undefined {
  if (!c) return;
  if (c.status !== "DISPONIVEL") return c;
  return { ...c, status: "EM_USO" };
}

function fecharComanda(c?: Comanda): Comanda | undefined {
  if (!c) return;
  if (c.status !== "EM_USO") return c;
  return { ...c, status: "FECHADA" };
}

function finalizarPagamento(c?: Comanda): Comanda | undefined {
  if (!c) return;
  if (c.status !== "FECHADA") return c;
  // reset pedidos and totals when finalizing payment
  return { ...c, status: "DISPONIVEL", pedidos: [], total: 0, items: 0 };
}

export function OrderPage() {
  const navigate = useNavigate();

  // load comandas from localStorage or use mock data
  const [comandas, setComandas] = useState<Comanda[]>(() => {
    try {
      const raw = localStorage.getItem("comandas");
      if (raw) return JSON.parse(raw) as Comanda[];
    } catch (e) {
      console.error("Failed to parse comandas from localStorage", e);
    }

    return [
      {
        id: 1,
        number: 101,
        status: "EM_USO",
        pedidos: [
          { id: 1, name: "Café Expresso", price: 5.5, qty: 1 },
          { id: 2, name: "Pão de Queijo", price: 6.5, qty: 2 },
        ],
        total: 18.5,
        items: 3,
        openedAt: "10:30",
      },
      {
        id: 2,
        number: 102,
        status: "EM_USO",
        pedidos: [{ id: 3, name: "Cappuccino", price: 8.0, qty: 1 }],
        total: 8.0,
        items: 1,
        openedAt: "10:45",
      },
      {
        id: 3,
        number: 103,
        status: "FECHADA",
        pedidos: [
          { id: 4, name: "Bolo de Cenoura", price: 8.5, qty: 1 },
          { id: 5, name: "Suco Natural", price: 9.0, qty: 1 },
        ],
        total: 17.5,
        items: 2,
        openedAt: "09:15",
      },
      {
        id: 4,
        number: 104,
        status: "EM_USO",
        pedidos: [],
        total: 0,
        items: 0,
        openedAt: "11:00",
      },
      {
        id: 5,
        number: 105,
        status: "DISPONIVEL",
        pedidos: [],
        total: 0,
        items: 0,
        openedAt: "11:15",
      },
    ];
  });

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  const getStatusColor = (status: ComandaStatus) => {
    switch (status) {
      case "DISPONIVEL":
        return "bg-[#558B2F] text-white";
      case "EM_USO":
        return "bg-[#F9A825] text-white";
      case "FECHADA":
        return "bg-[#C62828] text-white";
    }
  };

  const getStatusLabel = (status: ComandaStatus) => {
    switch (status) {
      case "DISPONIVEL":
        return "Disponível";
      case "EM_USO":
        return "Em uso";
      case "FECHADA":
        return "Fechada";
    }
  };

  const handleCreateCommand = () => {
    const nextId = comandas.length + 1;
    const nextNumber = 100 + nextId;
    const nova: Comanda = {
      id: nextId,
      number: nextNumber,
      status: "DISPONIVEL",
      pedidos: [],
      total: 0,
      items: 0,
      openedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setComandas((prev) => {
      const next = [nova, ...prev];
      try {
        localStorage.setItem("comandas", JSON.stringify(next));
      } catch (e) {
        console.error("Failed to persist comandas", e);
      }
      return next;
    });
    navigate(`/orders/${nova.id}`);
  };

  const handleOpenDetails = (commandId: number) => {
    navigate(`/orders/${commandId}`);
  };

  const updateComanda = (updated: Comanda) => {
    setComandas((prev) => {
      const next = prev.map((c) => (c.id === updated.id ? updated : c));
      try {
        localStorage.setItem("comandas", JSON.stringify(next));
      } catch (e) {
        console.error("Failed to persist comandas", e);
      }
      return next;
    });
  };

  function handleAbrir(id: number) {
    const c = comandas.find((x) => x.id === id);
    const updated = abrirComanda(c);
    if (updated) updateComanda(updated as Comanda);
  }

  function handleFechar(id: number) {
    const c = comandas.find((x) => x.id === id);
    const updated = fecharComanda(c);
    if (updated) updateComanda(updated as Comanda);
  }

  function handlePagamento(id: number) {
    const c = comandas.find((x) => x.id === id);
    const updated = finalizarPagamento(c);
    if (updated) updateComanda(updated as Comanda);
  }

  function handleAddProduct(id: number) {
    const name = newProductName.trim();
    const price = parseFloat(newProductPrice || "0");
    if (!name || !price) return;
    setComandas((prev) => {
      const next = prev.map((c) => {
        if (c.id !== id) return c;
        if (c.status !== "EM_USO") return c;
        const nextPid = Date.now();
        const pedidos = [...c.pedidos, { id: nextPid, name, price, qty: 1 }];
        const total = pedidos.reduce((s, p) => s + p.price * p.qty, 0);
        const items = pedidos.reduce((s, p) => s + p.qty, 0);
        return { ...c, pedidos, total, items };
      });
      try {
        localStorage.setItem("comandas", JSON.stringify(next));
      } catch (e) {
        console.error("Failed to persist comandas", e);
      }
      return next;
    });
    setNewProductName("");
    setNewProductPrice("");
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-[#D7CCC8] px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#3E2723]">Comandas</h1>
            <p className="text-sm text-[#8D6E63]">Gerenciamento de comandas</p>
          </div>
          <button
            onClick={handleCreateCommand}
            className="bg-[#8B4513] text-white px-6 py-3 rounded-xl hover:bg-[#5D2E1A] transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">Nova comanda</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
            <p className="text-sm text-[#8D6E63] mb-2">Comandas Disponíveis</p>
            <p className="text-3xl text-[#558B2F]">{comandas.filter((c) => c.status === "DISPONIVEL").length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
            <p className="text-sm text-[#8D6E63] mb-2">Em Uso</p>
            <p className="text-3xl text-[#F9A825]">{comandas.filter((c) => c.status === "EM_USO").length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
            <p className="text-sm text-[#8D6E63] mb-2">Fechadas Hoje</p>
            <p className="text-3xl text-[#C62828]">{comandas.filter((c) => c.status === "FECHADA").length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8] mb-8">
          <h3 className="text-[#3E2723] mb-6">Lista de Comandas</h3>
          <div className="grid grid-cols-2 gap-4">
            {comandas.map((command) => (
              <div
                key={command.id}
                className="bg-[#F5F1ED] rounded-xl p-5 border border-[#D7CCC8] hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[#3E2723]">Comanda #{command.number}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
                      <Clock className="w-3 h-3" />
                      <span>{command.openedAt}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full ${getStatusColor(command.status)}`}>
                    {getStatusLabel(command.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#8D6E63]">Itens</span>
                    <span className="text-[#3E2723]">{command.items}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8D6E63]">Total Parcial</span>
                    <span className="text-lg text-[#8B4513]">R$ {command.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenDetails(command.id)}
                    className="flex-1 bg-white text-[#5D4037] py-2.5 rounded-lg hover:bg-[#8B4513] hover:text-white transition-colors flex items-center justify-center gap-2 border border-[#D7CCC8]"
                  >
                    <span className="text-sm">Ver detalhes</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </main>
    </div>
  );
}
