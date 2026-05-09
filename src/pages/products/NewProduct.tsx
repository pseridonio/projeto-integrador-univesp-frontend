import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Input, Button } from "../../shared/ui";
import { createProduct, getCategories } from "../../shared/services/api";

export function NewProductPage() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");

  const [categoriesFromApi, setCategoriesFromApi] = useState<Array<{ name: string; subcategories?: string[] }>>([]);
  const mainCategories = categoriesFromApi.map((c) => c.name);
  const subcategories = (() => {
    const found = categoriesFromApi.find((c) => c.name === category);
    return found ? (found.subcategories || []) : [];
  })();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setSubmitting(true);
    try {
      const payload = {
        name: productName,
        category,
        subcategory: subcategory || null,
        price: parseFloat(price || "0"),
        available: true,
      };
      await createProduct(payload as any);
      navigate("/products");
    } catch (err) {
      console.error("Failed to create product", err);
      alert("Falha ao criar produto");
    } finally {
      setSubmitting(false);
    }
  };

  // load categories from backend
  useEffect(() => {
    (async () => {
      try {
        const cats: any = await getCategories();
        setCategoriesFromApi((cats as any) || []);
      } catch (e) {
        console.warn('Failed to load categories', e);
        setCategoriesFromApi([]);
      }
    })();
  }, []);

  const isFormValid = productName.trim() !== "" && category !== "" && price !== "" && parseFloat(price || "0") > 0;

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-[#D7CCC8] px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/products")}
              className="w-10 h-10 rounded-xl bg-[#F5F1ED] hover:bg-[#EFEBE9] transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-[#5D4037]" />
            </button>
            <div>
              <h1 className="text-[#3E2723]">Novo Produto</h1>
              <p className="text-sm text-[#8D6E63]">Cadastre um novo produto</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-[#D7CCC8]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="productName" className="block text-sm text-[#3E2723] mb-2">
                  Nome do Produto
                </label>
                <Input
                  type="text"
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: Café Expresso"
                  className="rounded-xl bg-[#F5F1ED]"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm text-[#3E2723] mb-2">
                  Categoria Principal <span className="text-[#C62828]">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D7CCC8] bg-[#F5F1ED] text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {mainCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subcategory" className="block text-sm text-[#3E2723] mb-2">
                  Subcategoria <span className="text-xs text-[#8D6E63]">(opcional)</span>
                </label>
                {subcategories.length > 0 ? (
                  <select
                    id="subcategory"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#D7CCC8] bg-[#F5F1ED] text-[#3E2723] focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
                  >
                    <option value="">Nenhuma</option>
                    {subcategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id="subcategory"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="Subcategoria (opcional)"
                    className="w-full"
                  />
                )}
              </div>

              <div>
                <label htmlFor="price" className="block text-sm text-[#3E2723] mb-2">
                  Valor (R$)
                </label>
                <Input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="rounded-xl bg-[#F5F1ED]"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid || submitting}
                  className="flex-1"
                >
                  <Save className="w-5 h-5" />
                  <span>{submitting ? "Salvando..." : "Salvar Produto"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
