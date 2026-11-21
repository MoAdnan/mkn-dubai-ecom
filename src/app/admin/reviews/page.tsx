"use client";

import * as React from "react";
import { Star, Check, X, ShieldCheck } from "lucide-react";

const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    product: "Apple iPhone 16 Pro Max 256GB Desert Titanium",
    customer: "Omar Al-Falasi",
    rating: 5,
    title: "Incredible build and buttery smooth performance",
    comment: "Delivered same day in Dubai within 3 hours. Genuine Apple warranty verified on Apple Support site.",
    isApproved: true,
    date: "20 Nov 2026",
  },
  {
    id: "rev-2",
    product: "Sony WH-1000XM5 Wireless Headphones Black",
    customer: "Maya Haddad",
    rating: 5,
    title: "Best ANC for Dubai Metro and flights",
    comment: "Cuts out all cabin noise. Highly recommend buying from MKN Dubai for the official Sony warranty.",
    isApproved: true,
    date: "18 Nov 2026",
  },
  {
    id: "rev-3",
    product: "ASUS ROG Zephyrus G16 OLED Gaming Laptop",
    customer: "Tariq Mansoor",
    rating: 4,
    title: "Great beast of a machine, runs warm under load",
    comment: "Screen is breathtaking. Very fast shipping to Abu Dhabi.",
    isApproved: false,
    date: "16 Nov 2026",
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = React.useState(INITIAL_REVIEWS);

  const toggleApproval = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: !r.isApproved } : r))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-black text-foreground">
          Reviews Moderation
        </h1>
        <p className="text-xs text-muted-foreground">
          Approve or reject verified customer ratings and product feedback before public display.
        </p>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground bg-muted/30">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Feedback</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20">
                  <td className="py-3.5 px-4 font-semibold text-foreground max-w-xs">
                    {r.product}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">{r.customer}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{r.rating}.0</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="font-semibold text-foreground line-clamp-1">{r.title}</p>
                    <p className="text-muted-foreground text-[11px] line-clamp-2">{r.comment}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.isApproved
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {r.isApproved ? "Approved" : "Pending Review"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleApproval(r.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        r.isApproved
                          ? "bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          : "bg-emerald-500 text-black hover:bg-emerald-400"
                      }`}
                    >
                      {r.isApproved ? "Unapprove" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

