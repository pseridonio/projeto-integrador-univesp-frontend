import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Search, Plus, Edit, Trash2 } from "lucide-react";
import { Input, Button } from "../../shared/ui";

type Product = {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  available: boolean;
};

export function ProductPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const products: Product[] = [
    { id: 1, name: "Coxinha", category: "Comidas", subcategory: "Salgados", price: 7.5, available: true },
    { id: 2, name: "Pão de Batata", category: "Comidas", subcategory: "Salgados", price: 6.5, available: true },
    { id: 3, name: "Pão de Queijo", category: "Comidas", subcategory: "Salgados", price: 6.0, available: true },
    { id: 4, name: "Bolo de Cenoura", category: "Comidas", subcategory: "Doces", price: 8.5, available: true },
    { id: 5, name: "Bolo de Laranja", category: "Comidas", subcategory: "Doces", price: 8.5, available: true },
    { id: 6, name: "Cookie", category: "Comidas", subcategory: "Doces", price: 5.0, available: true },
    { id: 7, name: "Café Espresso", category: "Bebidas", subcategory: "Bebidas Quentes", price: 5.5, available: true },
    { id: 8, name: "Café Espresso Duplo", category: "Bebidas", subcategory: "Bebidas Quentes", price: 8.0, available: true },
    { id: 9, name: "Macchiato", category: "Bebidas", subcategory: "Bebidas Quentes", price: 7.0, available: true },
    { id: 10, name: "Cappuccino", category: "Bebidas", subcategory: "Bebidas Quentes", price: 8.0, available: true },
    { id: 11, name: "Coca Cola", category: "Bebidas", subcategory: "Bebidas Geladas", price: 6.0, available: true },
    { id: 12, name: "Fanta Laranja", category: "Bebidas", subcategory: "Bebidas Geladas", price: 6.0, available: true },
    { id: 13, name: "Guaraná Antártica", category: "Bebidas", subcategory: "Bebidas Geladas", price: 6.0, available: true },
    { id: 14, name: "Chá Gelado", category: "Bebidas", subcategory: "Bebidas Geladas", price: 7.0, available: true },
    { id: 15, name: "Chá Matte", category: "Bebidas", subcategory: "Bebidas Geladas", price: 7.5, available: true },
    { id: 16, name: "Suco de Laranja", category: "Bebidas", subcategory: "Bebidas Geladas", price: 9.0, available: true },
    { id: 17, name: "Limonada", category: "Bebidas", subcategory: "Bebidas Geladas", price: 8.0, available: true },
  ];

  const categories = [
    { id: "todos", name: "Todos", count: products.length },
    { id: "bebidas", name: "Bebidas", count: products.filter((p) => p.category === "Bebidas").length },
    { id: "bebidas-quentes", name: "Bebidas Quentes", count: products.filter((p) => p.subcategory === "Bebidas Quentes").length },
    { id: "bebidas-geladas", name: "Bebidas Geladas", count: products.filter((p) => p.subcategory === "Bebidas Geladas").length },
    { id: "comidas", name: "Comidas", count: products.filter((p) => p.category === "Comidas").length },
    { id: "salgados", name: "Salgados", count: products.filter((p) => p.subcategory === "Salgados").length },
    { id: "doces", name: "Doces", count: products.filter((p) => p.subcategory === "Doces").length },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "Todos") return matchesSearch;
    if (selectedCategory === "Bebidas") return matchesSearch && product.category === "Bebidas";
    if (selectedCategory === "Comidas") return matchesSearch && product.category === "Comidas";
    if (selectedCategory === "Bebidas Quentes") return matchesSearch && product.subcategory === "Bebidas Quentes";
    if (selectedCategory === "Bebidas Geladas") return matchesSearch && product.subcategory === "Bebidas Geladas";
    if (selectedCategory === "Salgados") return matchesSearch && product.subcategory === "Salgados";
    if (selectedCategory === "Doces") return matchesSearch && product.subcategory === "Doces";

    return matchesSearch;
  });

  const handleAddProduct = () => {
    navigate("/products/new");
  };

  const handleEditProduct = (productId: number) => {
    console.log("Editar produto:", productId);
  };

  const handleDeleteProduct = (productId: number) => {
    console.log("Deletar produto:", productId);
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-[#D7CCC8] px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#3E2723]">Produtos</h1>
            <p className="text-sm text-[#8D6E63]">Gerenciamento de produtos</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-[#8B4513] text-white px-6 py-3 rounded-xl hover:bg-[#5D2E1A] transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">Novo produto</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8] mb-8">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8D6E63]" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-[#8D6E63] mb-3">Categorias</p>
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.name
                        ? "bg-[#8B4513] text-white"
                        : "bg-[#F5F1ED] text-[#5D4037] border border-[#D7CCC8] hover:bg-[#EFEBE9]"
                    }`}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#3E2723]">
              {filteredProducts.length} {filteredProducts.length === 1 ? "Produto" : "Produtos"}
            </h3>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F5F1ED] flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-[#8D6E63]" />
              </div>
              <p className="text-[#8D6E63] mb-2">Nenhum produto encontrado</p>
              <p className="text-sm text-[#BCAAA4]">Tente ajustar os filtros ou busca</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#F5F1ED] rounded-xl p-5 border border-[#D7CCC8] hover:shadow-lg transition-all"
                >
                  <div className="mb-4">
                    <h4 className="text-[#3E2723] mb-2">{product.name}</h4>
                    <div className="space-y-1">
                      <span className="text-xs text-[#8D6E63] bg-white px-2 py-1 rounded-lg inline-block">
                        {product.subcategory}
                      </span>
                      <div
                        className={`text-xs px-2 py-1 rounded-lg inline-block ml-2 ${
                          product.available ? "bg-[#558B2F] text-white" : "bg-[#C62828] text-white"
                        }`}
                      >
                        {product.available ? "Disponível" : "Indisponível"}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-2xl text-[#8B4513]">R$ {product.price.toFixed(2)}</p>
                  </div>

                  <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditProduct(product.id)}
                        className="flex-1 bg-white text-[#5D4037] py-2 rounded-lg hover:bg-[#8B4513] hover:text-white transition-colors flex items-center justify-center gap-2 border border-[#D7CCC8]"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-sm">Editar</span>
                      </Button>
                      <Button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-white text-[#C62828] py-2 px-3 rounded-lg hover:bg-[#C62828] hover:text-white transition-colors flex items-center justify-center border border-[#D7CCC8]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
