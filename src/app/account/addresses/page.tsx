"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Plus, Trash2, Edit2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function SavedAddressesPage() {
  const [addresses, setAddresses] = React.useState([
    {
      id: "addr-1",
      recipient: "Adnan Al-Hashimi",
      phone: "+971 50 123 4567",
      emirate: "Dubai",
      area: "Downtown Dubai",
      street: "Sheikh Mohammed bin Rashid Blvd",
      building: "Burj Crown Tower",
      apartment: "Suite 1402",
      isDefault: true,
    },
    {
      id: "addr-2",
      recipient: "Adnan Al-Hashimi (Office)",
      phone: "+971 4 398 2211",
      emirate: "Dubai",
      area: "Dubai Silicon Oasis",
      street: "Dubai Digital Park",
      building: "Building A3",
      apartment: "Office 402",
      isDefault: false,
    },
  ]);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/account"
            className="text-xs text-muted-foreground hover:text-cyan-400 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Account</span>
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
            Saved Delivery Addresses
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Delivery locations across the 7 United Arab Emirates
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold text-xs hover:bg-cyan-400 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`rounded-2xl border p-5 space-y-3 relative bg-card ${
              addr.isDefault ? "border-cyan-500 ring-1 ring-cyan-500/20" : "border-border/70"
            }`}
          >
            {addr.isDefault && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-[10px] font-bold border border-cyan-500/30">
                <CheckCircle2 className="w-3 h-3" />
                <span>Default Address</span>
              </span>
            )}

            <div>
              <h3 className="font-bold text-sm text-foreground">{addr.recipient}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{addr.phone}</p>
            </div>

            <div className="text-xs text-muted-foreground space-y-0.5 pt-1">
              <p>{addr.building}, {addr.apartment}</p>
              <p>{addr.street}</p>
              <p className="font-medium text-foreground">{addr.area}, {addr.emirate}, UAE</p>
            </div>

            <div className="pt-3 border-t border-border/40 flex justify-end gap-2 text-xs">
              <button className="px-2.5 py-1 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground">
                Edit
              </button>
              {!addr.isDefault && (
                <button className="px-2.5 py-1 rounded-lg border border-border/60 hover:bg-destructive/10 hover:text-destructive text-muted-foreground">
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

