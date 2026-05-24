import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Search, Plus, Edit, Trash2 } from "lucide-react";
import { Input, Button } from "../../shared/ui";

// Interface padronizada
interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  available: boolean;
}

export function ProductPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Carregar produtos do localStorage ou usar mocks
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem("products");
      if (raw) return JSON.parse(raw) as Product[];
    } catch (e) {
      console.error("Failed to parse products from localStorage", e);
    }

    // Mock inicial
    return [
      { id: 1, name: "Coxinha", category: "Food", subcategory: "Savory", price: 7.5, available: true },
      { id: 2, name: "Cheese Bread", category: "Food", subcategory: "Savory", price: 6.0, available: true },
      { id: 3, name: "Carrot Cake", category: "Food", subcategory: "Sweet", price: 8.5, available: true },
      { id: 4, name: "Espresso", category: "Drinks", subcategory: "Hot Drinks", price: 5.5, available: true },
      { id: 5, name: "Cappuccino", category: "Drinks", subcategory: "Hot Drinks", price: 8.0, available: true },
      { id: 6, name: "Orange Juice", category: "Drinks", subcategory: "Cold Drinks", price: 9.0, available: true },
    ];
  });

  // Persistência
  const saveProducts = (next: Product[]) => {
    setProducts(next);
    localStorage.setItem("products", JSON.stringify(next));
  };

  const categories = [
    { id: "all", name: "All", count: products.length },
    { id: "drinks", name: "Drinks", count: products.filter((p) => p.category === "Drinks").length },
    { id: "hot-drinks", name: "Hot Drinks", count: products.filter((p) => p.subcategory === "Hot Drinks").length },
    { id: "cold-drinks", name: "Cold Drinks", count: products.filter((p) => p.subcategory === "Cold Drinks").length },
    { id: "food", name: "Food", count: products.filter((p) => p.category === "Food").length },
    { id: "savory", name: "Savory", count: products.filter((p) => p.subcategory === "Savory").length },
    { id: "sweet", name: "Sweet", count: products.filter((p) => p.subcategory === "Sweet").length },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "All") return matchesSearch;
    if (selectedCategory === "Drinks") return matchesSearch && product.category === "Drinks";
    if (selectedCategory === "Food") return matchesSearch && product.category === "Food";
    if (selectedCategory === "Hot Drinks") return matchesSearch && product.subcategory === "Hot Drinks";
    if (selectedCategory === "Cold Drinks") return matchesSearch && product.subcategory === "Cold Drinks";
    if (selectedCategory === "Savory") return matchesSearch && product.subcategory === "Savory";
    if (selectedCategory === "Sweet") return matchesSearch && product.subcategory === "Sweet";

    return matchesSearch;
  });

  const handleAddProduct = () => {
    navigate("/products/new");
  };

  const handleEditProduct = (productId: number) => {
    console.log("Edit product:", productId);
  };

  const handleDeleteProduct = (productId: number) => {
    const next = products.filter((p) => p.id !== productId);
    saveProducts(next);
  };

    return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-[#D7CCC8] px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#3E2723]">Products</h1>
            <p className="text-sm text-[#8D6E63]">Product management</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-[#8B4513] text-white px-6 py-3 rounded-xl hover:bg-[#5D2E1A] transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">New product</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-auto">
        {/* Search and categories */}
        <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8] mb-8">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8D6E63]" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
          </div>

          <div>
            <p className="text-sm text-[#8D6E63] mb-3">Categories</p>
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

        {/* Product list */}
        <div className="bg-white rounded-2xl p-6 border border-[#D7CCC8]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#3E2723]">
              {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
            </h3>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F5F1ED] flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-[#8D6E63]" />
              </div>
              <p className="text-[#8D6E63] mb-2">No products found</p>
              <p className="text-sm text-[#BCAAA4]">Try adjusting filters or search</p>
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
                        {product.available ? "Available" : "Unavailable"}
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
                      <span className="text-sm">Edit</span>
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
  )
};