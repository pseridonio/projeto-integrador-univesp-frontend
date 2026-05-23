import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, ChevronRight } from "lucide-react";
import { getComandas, createComanda as apiCreateComanda, updateComanda as apiUpdateComanda } from "../../shared/services/api";
import { formatCurrency } from "../../shared/utils/format";

export enum OrderStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  CLOSED = "CLOSED",
}

type Product = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

type Order = {
  id: number;
  number: number;
  status: OrderStatus;
  products: Product[];
  total: number;
  items: number;
  openedAt: string;
};

function openOrder(order?: Order): Order | undefined {
  if (!order) return;
  if (order.status !== OrderStatus.AVAILABLE) return order;
  return { ...order, status: OrderStatus.IN_USE };
}

function closeOrder(order?: Order): Order | undefined {
  if (!order) return;
  if (order.status !== OrderStatus.IN_USE) return order;
  return { ...order, status: OrderStatus.CLOSED };
}

function finalizePayment(order?: Order): Order | undefined {
  if (!order) return;
  if (order.status !== OrderStatus.CLOSED) return order;
  return { ...order, status: OrderStatus.AVAILABLE, products: [], total: 0, items: 0 };
}

export function OrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const data: Order[] = await getComandas();
        setOrders(data || []);
      } catch (err) {
        console.error("Falha ao carregar comandas", err);
      }
    }
    loadOrders();
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.AVAILABLE:
        return "bg-[#558B2F] text-white";
      case OrderStatus.IN_USE:
        return "bg-[#F9A825] text-white";
      case OrderStatus.CLOSED:
        return "bg-[#C62828] text-white";
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.AVAILABLE:
        return "Available";
      case OrderStatus.IN_USE:
        return "In Use";
      case OrderStatus.CLOSED:
        return "Closed";
    }
  };

  const handleCreateOrder = async () => {
    try {
      const payload = { status: OrderStatus.AVAILABLE };
      const created: Order = await apiCreateOrder(payload as any);
      setOrders((prev) => [created, ...prev]);
      navigate(`/orders/${created.id}`);
    } catch (e) {
      console.error("Falha ao criar comanda", e);
      navigate(`/new-order`);
    }
  };

  const handleOpenDetails = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  const updateOrder = async (updated: Order) => {
    try {
      const res = await apiUpdateOrder(updated.id, updated as any);
      const newOrder: Order = (res as any) ?? updated;
      setOrders((prev) => {
        const next = prev.map((o) => (o.id === newOrder.id ? newOrder : o));
        try {
          localStorage.setItem("orders", JSON.stringify(next));
        } catch (e) {
          console.error("Falha ao persistir comandas", e);
        }
        return next;
      });
    } catch (e) {
      console.error("Falha ao atualizar comanda", e);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    }
  };

  function handleOpen(id: number) {
    const order = orders.find((x) => x.id === id);
    const updated = openOrder(order);
    if (updated) updateOrder(updated);
  }

  function handleClose(id: number) {
    const order = orders.find((x) => x.id === id);
    const updated = closeOrder(order);
    if (updated) updateOrder(updated);
  }

  function handlePayment(id: number) {
    const order = orders.find((x) => x.id === id);
    const updated = finalizePayment(order);
    if (updated) updateOrder(updated);
  }

  function handleAddProduct(id: number) {
    const name = newProductName.trim();
    const price = parseFloat(newProductPrice || "0");
    if (!name || !price) return;
    const order = orders.find((x) => x.id === id);
    if (!order) return;

    const willOpen = order.status === OrderStatus.AVAILABLE;
    const nextPid = Date.now();
    const products = [...(order.products || []), { id: nextPid, name, price, qty: 1 }];
    const total = products.reduce((s, p) => s + p.price * p.qty, 0);
    const items = products.reduce((s, p) => s + p.qty, 0);

    const updated: Order = {
      ...order,
      status: OrderStatus.IN_USE,
      products,
      total,
      items,
    };

    updateOrder(updated);
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
            onClick={handleCreateOrder}
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
            <p className="text-3xl text-[#558B2F]">{orders.filter((c) => c.status === OrderStatus.AVAILABLE).length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
            <p className="text-sm text-[#8D6E63] mb-2">Em Uso</p>
            <p className="text-3xl text-[#F9A825]">{orders.filter((c) => c.status === OrderStatus.IN_USE).length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
            <p className="text-sm text-[#8D6E63] mb-2">Fechadas Hoje</p>
            <p className="text-3xl text-[#C62828]">{orders.filter((c) => c.status === OrderStatus.CLOSED).length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8] mb-8">
          <h3 className="text-[#3E2723] mb-6">Lista de Comandas</h3>
          <div className="grid grid-cols-2 gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#F5F1ED] rounded-xl p-5 border border-[#D7CCC8] hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[#3E2723]">Comanda #{order.number}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
                      <Clock className="w-3 h-3" />
                      <span>{order.openedAt}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#8D6E63]">Itens</span>
                    <span className="text-[#3E2723]">{order.items}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8D6E63]">Total Parcial</span>
                    <span className="text-lg text-[#8B4513]">R$ {formatCurrency(order.total)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenDetails(order.id)}
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
