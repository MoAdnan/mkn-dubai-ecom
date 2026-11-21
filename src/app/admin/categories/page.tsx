"use client";

import * as React from "react";
import { Layers, Plus, Trash2, Edit2, Tag } from "lucide-react";
import { DEMO_CATEGORIES, DEMO_BRANDS } from "@/lib/products-data";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState(DEMO_CATEGORIES);
  const [brands, setBrands] = React.useState(DEMO_BRANDS);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-black text-foreground">
          Categories & Brands
        </h1>
        <p className="text-xs text-muted-foreground">
          Organize storefront navigation, taxonomies, and authorized distributor brands.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Panel */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Categories ({categories.length})</span>
            </h2>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/20">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="divide-y divide-border/40 text-xs">
            {categories.map((cat) => (
              <div key={cat.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{cat.name}</h4>
                  <p className="text-[11px] font-mono text-muted-foreground">slug: /{cat.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px]">
                    {cat.count} items
                  </span>
                  <button className="p-1 hover:text-cyan-400 text-muted-foreground">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brands Panel */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
              <Tag className="w-4 h-4 text-violet-400" />
              <span>Authorized Brands ({brands.length})</span>
            </h2>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/30 text-xs font-semibold hover:bg-violet-500/20">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Brand</span>
            </button>
          </div>

          <div className="divide-y divide-border/40 text-xs">
            {brands.map((brand) => (
              <div key={brand.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{brand.name}</h4>
                  <p className="text-[11px] font-mono text-muted-foreground">slug: /{brand.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                    Authorized UAE
                  </span>
                  <button className="p-1 hover:text-cyan-400 text-muted-foreground">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

