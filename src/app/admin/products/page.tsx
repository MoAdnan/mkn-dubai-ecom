"use client";

import * as React from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { type DemoProduct } from "@/lib/products-data";
import { formatAED, aedToFils } from "@/lib/utils";
import {
  getAdminProductsAction,
  saveProductAction,
  deleteProductAction,
} from "@/app/actions/admin-products";

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<DemoProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [editingProduct, setEditingProduct] = React.useState<DemoProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  // Form State
  const [title, setTitle] = React.useState("");
  const [brandName, setBrandName] = React.useState("Apple");
  const [categoryName, setCategoryName] = React.useState("Smartphones");
  const [sku, setSku] = React.useState("");
  const [priceAED, setPriceAED] = React.useState(4999);
  const [salePriceAED, setSalePriceAED] = React.useState<number | undefined>(undefined);
  const [stock, setStock] = React.useState(25);
  const [imageUrl, setImageUrl] = React.useState(
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80"
  );

  // Load from persistent store on mount
  React.useEffect(() => {
    async function load() {
      try {
        const data = await getAdminProductsAction();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand_name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitle("");
    setSku(`MKN-${Date.now().toString().slice(-6)}`);
    setPriceAED(1999);
    setSalePriceAED(undefined);
    setStock(20);
    setImageUrl(
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80"
    );
    setIsModalOpen(true);
  };

  const openEditModal = (product: DemoProduct) => {
    setEditingProduct(product);
    setTitle(product.title);
    setBrandName(product.brand_name);
    setCategoryName(product.category_name);
    setSku(product.sku);
    setPriceAED(product.base_price_fils / 100);
    setSalePriceAED(product.sale_price_fils ? product.sale_price_fils / 100 : undefined);
    setStock(product.stock_quantity);
    setImageUrl(product.images[0]?.url || "");
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let productToSave: DemoProduct;

      if (editingProduct) {
        productToSave = {
          ...editingProduct,
          title,
          brand_name: brandName,
          category_name: categoryName,
          sku,
          base_price_fils: aedToFils(priceAED),
          sale_price_fils: salePriceAED ? aedToFils(salePriceAED) : null,
          stock_quantity: stock,
          images: [{ url: imageUrl, alt: title, is_primary: true }],
        };
      } else {
        productToSave = {
          id: `prod-${Date.now()}`,
          category_id: "cat-1",
          category_name: categoryName,
          category_slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          brand_id: "b-1",
          brand_name: brandName,
          brand_slug: brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          short_description: "New flagship device with official UAE warranty.",
          description: "Official distributor stock with 1-year warranty and same-day delivery.",
          sku,
          base_price_fils: aedToFils(priceAED),
          sale_price_fils: salePriceAED ? aedToFils(salePriceAED) : null,
          stock_quantity: stock,
          rating: 5.0,
          reviews_count: 0,
          is_featured: false,
          is_deal: false,
          warranty_months: 12,
          warranty_type: "Official UAE Distributor Warranty",
          images: [{ url: imageUrl, alt: title, is_primary: true }],
          variants: [],
          specs: { Warranty: "12 Months TDRA approved" },
        };
      }

      // Persist to server store & update state
      const updated = await saveProductAction(productToSave);
      setProducts(updated);
      setIsModalOpen(false);
      showToast(
        editingProduct ? "Product updated successfully!" : "Product created and added to live store!"
      );
    } catch (err: any) {
      alert("Failed to save product: " + err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, productTitle: string) => {
    if (confirm(`Are you sure you want to delete "${productTitle}"? It will be removed from the public store.`)) {
      try {
        const updated = await deleteProductAction(id);
        setProducts(updated);
        showToast("Product deleted successfully.");
      } catch (err: any) {
        alert("Failed to delete product: " + err?.message);
      }
    }
  };

  const exportCSV = () => {
    const headers = "ID,Title,SKU,Brand,Category,Price_AED,Stock\n";
    const rows = products
      .map(
        (p) =>
          `"${p.id}","${p.title.replace(/"/g, '""')}","${p.sku}","${p.brand_name}","${p.category_name}",${
            p.base_price_fils / 100
          },${p.stock_quantity}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mkn_electronics_inventory_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-cyan-500 text-black font-semibold text-xs shadow-2xl animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-black text-foreground">
            Product Inventory ({products.length})
          </h1>
          <p className="text-xs text-muted-foreground">
            Live database-backed catalog. Added or deleted items reflect immediately across the entire store.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border/80 text-xs font-semibold hover:bg-muted"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-4 bg-card border border-border/80 p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, brand, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted/40 border border-border/70 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Loading live store inventory...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground bg-muted/30">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Brand / Category</th>
                  <th className="py-3 px-4">Price (AED)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-muted/40 p-1 flex-shrink-0">
                          <Image
                            src={product.images[0]?.url || ""}
                            alt={product.title}
                            fill
                            className="object-contain"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-foreground line-clamp-1 block max-w-xs">
                            {product.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {product.warranty_months}M Warranty
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{product.sku}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground block">{product.brand_name}</span>
                      <span className="text-[11px] text-muted-foreground">{product.category_name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {formatAED(product.sale_price_fils || product.base_price_fils)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          product.stock_quantity <= 15
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-emerald-500/15 text-emerald-400"
                        }`}
                      >
                        {product.stock_quantity} in stock
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-cyan-400"
                          aria-label="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.title)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border/80 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <h2 className="font-heading font-bold text-base text-foreground">
                {editingProduct ? "Edit Product" : "Create New Product (Live Storefront)"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple iPad Pro 13-inch M4"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Brand *</label>
                  <select
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Sony">Sony</option>
                    <option value="ASUS ROG">ASUS ROG</option>
                    <option value="Bose">Bose</option>
                    <option value="LG">LG</option>
                    <option value="DJI">DJI</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Category *</label>
                  <select
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs"
                  >
                    <option value="Smartphones">Smartphones</option>
                    <option value="Laptops & Computing">Laptops & Computing</option>
                    <option value="Audio & Hi-Fi">Audio & Hi-Fi</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Gaming & Consoles">Gaming & Consoles</option>
                    <option value="Smart Living & TVs">Smart Living & TVs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Price (AED) *</label>
                  <input
                    type="number"
                    required
                    value={priceAED}
                    onChange={(e) => setPriceAED(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border/70 hover:bg-muted font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? "Update Product" : "Save to Live Store"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
