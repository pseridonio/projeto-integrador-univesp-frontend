import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button, Input } from "../../shared/ui";
import { getProducts, getComandas, createComanda as apiCreateComanda } from "../../shared/services/api";
import { getCurrentUser } from "../../shared/services/api";

enum OrderStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
}

type Product = { id: number; name: string; price: number };
type OrderItem = { id: number; productId: number; name: string; price: number; qty: number };

export function NewOrderPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>("");

  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [qty, setQty] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const prods: Product[] = await getProducts();
        setProducts(prods || []);
      } catch (e) {
        console.warn("Falha ao carregar produtos", e);
        setProducts([]);
      }

      try {
        const cmds: any = await getComandas();
        setOrders(cmds || []);
      } catch (e) {
        console.warn("Falha ao carregar comandas", e);
        setOrders([]);
      }

      try {
        const user: any = await getCurrentUser();
        const name = user?.fullName || user?.name || "";
        setUserName(name);
      } catch (e) {
        setUserName("");
      }
    })();
  }, []);

  const nextOrderNumber = () => {
    const nums = (orders || []).map((c: any) => Number(c.number) || 0);
    const max = nums.length > 0 ? Math.max(...nums) : 0;
    const next = (max % 100) + 1;
    return String(next).padStart(3, "0");
  };

  const total = orderItems.reduce((s, p) => s + p.price * p.qty, 0);

  function handleAddItem() {
    if (!selectedProductId) return;
    const prod = products.find((p) => p.id === Number(selectedProductId));
    if (!prod) return;
    const existing = orderItems.find((p) => p.productId === prod.id);
    if (existing) {
      setOrderItems((prev) => prev.map((p) => (p.productId === prod.id ? { ...p, qty: p.qty + qty } : p)));
    } else {
      const nextPid = Date.now();
      setOrderItems((prev) => [...prev, { id: nextPid, productId: prod.id, name: prod.name, price: prod.price, qty }]);
    }
    setQty(1);
    setSelectedProductId("");
  }

  function handleRemoveItem(pid: number) {
    setOrderItems((prev) => prev.filter((p) => p.id !== pid));
  }

  async function handleCreateOrder() {
    if (!userName) {
      console.warn("Usuário não identificado");
    }

    const number = nextOrderNumber();
    const payload = {
      number,
      status: orderItems.length > 0 ? OrderStatus.IN_USE : OrderStatus.AVAILABLE,
      pedidos: orderItems.map((p) => ({ id: p.id, name: p.name, price: p.price, qty: p.qty })),
      total,
      items: orderItems.reduce((s, p) => s + p.qty, 0),
      openedAt: new Date().toISOString(),
      attendant: userName || null,
    } as any;

    try {
      const created = await apiCreateOrder(payload as any);
      const id = (created && (created.id || created._id)) || null;
      if (id) navigate(`/orders/${id}`);
      else navigate(`/orders`);
    } catch (e) {
      console.error("Falha ao criar comanda", e);
      navigate(`/orders`);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-[#D7CCC8] px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/orders')} className="w-10 h-10 rounded-xl bg-[#F5F1ED] hover:bg-[#EFEBE9] flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-[#5D4037]" />
            </button>
            <div>
              <h1 className="text-[#3E2723]">Nova Comanda</h1>
              <p className="text-sm text-[#8D6E63]">Abra e adicione itens à comanda</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-[#8D6E63]">Atendente</div>
            <div className="text-[#3E2723]">{userName || '—'}</div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8] mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-[#8D6E63]">Número da Comanda</p>
                <p className="text-2xl text-[#3E2723]">#{nextComandaNumber()}</p>
              </div>
              <div>
                <p className="text-sm text-[#8D6E63]">Status</p>
                <p className="text-[#3E2723]">{orderItems.length > 0 ? 'Em uso' : 'Disponível'}</p>
              </div>
              <div>
                <p className="text-sm text-[#8D6E63]">Abertura</p>
                <p className="text-[#3E2723]">{new Date().toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm text-[#3E2723] mb-2">Produto</label>
                <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value ? Number(e.target.value) : "")} className="w-full px-4 py-3 rounded-xl border border-[#D7CCC8] bg-[#F5F1ED]">
                  <option value="">Selecione um produto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — R$ {p.price.toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#3E2723] mb-2">Quantidade</label>
                <Input type="number" min={1} value={qty} onChange={(e: any) => setQty(Number(e.target.value || 1))} />
              </div>
              <div>
                <Button onClick={handleAddItem} className="w-full flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Adicionar
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8] mb-6">
            <h3 className="text-[#3E2723] mb-4">Itens da Comanda</h3>
            {orderItems.length === 0 ? (
              <p className="text-[#8D6E63]">Nenhum item adicionado</p>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border rounded-xl p-3">
                    <div>
                      <div className="text-sm text-[#3E2723]">{item.name}</div>
                      <div className="text-xs text-[#8D6E63]">R$ {item.price.toFixed(2)} x {item.qty} = R$ {(item.price * item.qty).toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setOrderItems((prev) => prev.map((it) => it.id === item.id ? { ...it, qty: Math.max(1, it.qty - 1) } : it))} className="px-3 py-1 bg-[#F5F1ED] rounded">-</button>
                      <span className="w-6 text-center">{item.qty}</span>
                      <button onClick={() => setOrderItems((prev) => prev.map((it) => it.id === item.id ? { ...it, qty: it.qty + 1 } : it))} className="px-3 py-1 bg-[#F5F1ED] rounded">+</button>
                      <button onClick={() => handleRemoveItem(item.id)} className="ml-4 text-sm text-[#C62828]">Remover</button>
                    </div>
                  </div>
                ))}
                <div className="text-right text-lg font-semibold">Total: R$ {total.toFixed(2)}</div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button onClick={() => navigate('/orders')} className="flex-1">Cancelar</Button>
            <Button onClick={apiCreateComanda} className="flex-1">Criar comanda</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
