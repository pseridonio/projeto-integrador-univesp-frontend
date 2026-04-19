import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock } from "lucide-react";

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
  return { ...c, status: "DISPONIVEL", pedidos: [], total: 0, items: 0 };
}

const MOCK: Comanda[] = [
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
];

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comanda, setComanda] = useState<Comanda | undefined>(undefined);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  useEffect(() => {
    const num = Number(id);
    try {
      const raw = localStorage.getItem("comandas");
      const arr: Comanda[] = raw ? JSON.parse(raw) : MOCK;
      const found = arr.find((m) => m.id === num);
      if (found) setComanda(found);
    } catch (e) {
      console.error("Failed to load comanda from localStorage", e);
      const found = MOCK.find((m) => m.id === Number(id));
      if (found) setComanda(found);
    }
  }, [id]);

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

  function handleAbrir() {
    setComanda((prev) => abrirComanda(prev as Comanda));
  }

  function handleFechar() {
    setComanda((prev) => fecharComanda(prev as Comanda));
  }

  function handlePagamento() {
    setComanda((prev) => finalizarPagamento(prev as Comanda));
  }

  function handleAddProduct() {
    if (!comanda) return;
    if (comanda.status !== "EM_USO") return;
    const name = newProductName.trim();
    const price = parseFloat(newProductPrice || "0");
    if (!name || !price) return;
    const nextPid = Date.now();
    const pedidos = [...comanda.pedidos, { id: nextPid, name, price, qty: 1 }];
    const total = pedidos.reduce((s, p) => s + p.price * p.qty, 0);
    const items = pedidos.reduce((s, p) => s + p.qty, 0);
    const updated = { ...comanda, pedidos, total, items };
    setComanda(updated);
    try {
      const raw = localStorage.getItem("comandas");
      const arr: Comanda[] = raw ? JSON.parse(raw) : MOCK;
      const next = arr.map((c) => (c.id === updated.id ? updated : c));
      localStorage.setItem("comandas", JSON.stringify(next));
    } catch (e) {
      console.error("Failed to persist comanda", e);
    }
    setNewProductName("");
    setNewProductPrice("");
  }

  // persist comanda changes to localStorage whenever comanda state changes
  useEffect(() => {
    if (!comanda) return;
    try {
      const raw = localStorage.getItem("comandas");
      const arr: Comanda[] = raw ? JSON.parse(raw) : MOCK;
      const next = arr.map((c) => (c.id === comanda.id ? comanda : c));
      localStorage.setItem("comandas", JSON.stringify(next));
    } catch (e) {
      console.error("Failed to persist comanda on change", e);
    }
  }, [comanda]);

  if (!comanda) {
    return (
      <div>
        <p>Comanda não encontrada.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-3 py-2 border rounded">Voltar</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Comanda #{comanda.number}</h3>
          <div className="text-sm text-[#8D6E63]">Aberta às {comanda.openedAt}</div>
        </div>
        <div className={`text-sm px-3 py-1.5 rounded-full ${getStatusColor(comanda.status)}`}>
          {getStatusLabel(comanda.status)}
        </div>
      </div>

      <div className="mb-6">
        <h5 className="text-sm text-[#8D6E63] mb-2">Pedidos</h5>
        <div className="space-y-2">
          {comanda.pedidos.length === 0 && <div className="text-sm text-[#8D6E63]">Nenhum item</div>}
          {comanda.pedidos.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-[#fbf7f3] p-3 rounded">
              <div>
                <div className="font-medium text-sm">{p.name}</div>
                <div className="text-xs text-[#8D6E63]">Qtd: {p.qty}</div>
              </div>
              <div className="text-sm text-[#3E2723]">R$ {(p.price * p.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h5 className="text-sm text-[#8D6E63] mb-2">Adicionar Produto</h5>
        <div className="flex gap-2 items-center">
          <input
            placeholder="Nome do produto"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            className="flex-1 border border-[#e6dcd3] rounded px-3 py-2"
            disabled={comanda.status !== "EM_USO"}
          />
          <input
            placeholder="Preço"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
            className="w-28 border border-[#e6dcd3] rounded px-3 py-2"
            disabled={comanda.status !== "EM_USO"}
          />
          <button
            onClick={handleAddProduct}
            disabled={comanda.status !== "EM_USO"}
            className={`px-4 py-2 rounded bg-[#8B6F47] text-white ${comanda.status !== "EM_USO" ? "opacity-50 cursor-not-allowed" : "hover:bg-[#7a5a3a]"}`}
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {comanda.status === "DISPONIVEL" && (
          <button onClick={handleAbrir} className="px-4 py-2 rounded bg-[#F9A825] text-white">Abrir comanda</button>
        )}

        {comanda.status === "EM_USO" && (
          <button onClick={handleFechar} className="px-4 py-2 rounded bg-[#C62828] text-white">Fechar comanda</button>
        )}

        {comanda.status === "FECHADA" && (
          <button onClick={handlePagamento} className="px-4 py-2 rounded bg-[#558B2F] text-white">Finalizar pagamento</button>
        )}

        <button onClick={() => navigate(-1)} className="px-4 py-2 rounded border">Voltar</button>
      </div>
    </div>
  );
}
