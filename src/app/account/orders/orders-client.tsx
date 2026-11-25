"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  FileText,
  Download,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
  MapPin,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { formatAED } from "@/lib/utils";
import { generateTaxInvoicePDF } from "@/lib/invoice/generate-pdf";
import { useCart } from "@/components/cart-provider";
import type { StoredOrder } from "@/lib/services/persistent-store";

interface CustomerOrdersClientProps {
  initialOrders: StoredOrder[];
}

export function CustomerOrdersClient({ initialOrders }: CustomerOrdersClientProps) {
  const [orders, setOrders] = React.useState<StoredOrder[]>(initialOrders);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [expandedOrders, setExpandedOrders] = React.useState<Record<string, boolean>>({});
  const { addItem, setIsCartOpen } = useCart();
  const [reorderedId, setReorderedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const downloadInvoice = (order: StoredOrder) => {
    const doc = generateTaxInvoicePDF({
      invoiceNumber: order.invoiceNumber,
      orderNumber: order.orderNumber,
      invoiceType: order.isB2B ? "full" : "simplified",
      issueDate: order.date,
      supplyDate: order.date,
      supplier: {
        name: "MKN Electronics L.L.C.",
        address: "Al Quoz Industrial 1, P.O. Box 48291, Dubai, UAE",
        trn: "100482918200003",
        license: "1048291",
      },
      customer: {
        name: order.customer,
        email: order.email,
        phone: order.phone,
        address: order.address,
        emirate: order.emirate,
        trn: order.customerTRN || undefined,
      },
      lines: order.items.map((it) => {
        const itemVat = Math.round(it.priceFils - it.priceFils / 1.05);
        return {
          title: it.title,
          sku: it.sku || "MKN-SKU",
          quantity: it.quantity,
          unitPriceFils: it.priceFils,
          taxableFils: it.priceFils - itemVat,
          vatFils: itemVat,
          totalFils: it.priceFils * it.quantity,
        };
      }),
      subtotalFils: order.subtotalFils,
      discountFils: order.discountFils,
      shippingFils: order.shippingFils,
      vatFils: order.vatFils,
      totalFils: order.totalFils,
    });

    doc.save(`${order.invoiceNumber}.pdf`);
  };

  const handleReorder = (order: StoredOrder) => {
    order.items.forEach((item, idx) => {
      addItem(
        {
          id: `reorder-${order.id}-${idx}`,
          productId: `prod-${idx}`,
          title: item.title,
          priceFils: item.priceFils,
          slug: (item as any).slug || "product",
          image:
            "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80",
          maxStock: 50,
        },
        item.quantity
      );
    });
    setReorderedId(order.id);
    setIsCartOpen(true);
    setTimeout(() => setReorderedId(null), 3000);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((it) => it.title.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || o.orderStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/account"
            className="text-xs text-muted-foreground hover:text-cyan-400 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Account Overview</span>
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
            My Orders & Delivery Tracking
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Real-time fulfillment tracking, buy-again shortcuts, and official FTA VAT invoices
          </p>
        </div>
      </div>

      {/* Filter and Search Bar (Amazon Style) */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by product name, order ID, or invoice #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["all", "processing", "shipped", "delivered"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold"
                  : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
              }`}
            >
              {status === "all" ? "All Orders" : status}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-4">
          <Package className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="font-heading text-lg font-bold">No orders found</h2>
          <p className="text-xs text-muted-foreground">
            {search || statusFilter !== "all"
              ? "No orders match your active filter."
              : "You haven't placed any electronics orders yet."}
          </p>
          <Link
            href="/catalogue"
            className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-semibold hover:opacity-95 transition-opacity"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const isDelivered = order.orderStatus === "delivered";
            const isShipped = order.orderStatus === "shipped" || isDelivered;
            const isProcessing =
              order.orderStatus === "processing" || isShipped || isDelivered;
            const isExpanded = expandedOrders[order.id];

            return (
              <div
                key={order.id}
                className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm transition-all"
              >
                {/* Order Top Banner */}
                <div className="bg-muted/30 px-6 py-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                    <div>
                      <span className="text-muted-foreground text-[10px] uppercase font-bold block">
                        Order Placed
                      </span>
                      <span className="font-semibold text-foreground">{order.date}</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground text-[10px] uppercase font-bold block">
                        Total Amount
                      </span>
                      <span className="font-mono font-bold text-foreground">
                        {formatAED(order.totalFils)}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground text-[10px] uppercase font-bold block">
                        Ship To
                      </span>
                      <span className="font-semibold text-foreground">
                        {order.customer} ({order.emirate})
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold block">
                      Order #{order.orderNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => downloadInvoice(order)}
                      className="text-cyan-400 hover:underline font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Invoice #{order.invoiceNumber} (PDF)</span>
                    </button>
                  </div>
                </div>

                {/* Visual Delivery Stepper (Amazon Style) */}
                <div className="px-6 py-5 border-b border-border/40">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          isDelivered
                            ? "bg-emerald-400 animate-pulse"
                            : isShipped
                            ? "bg-cyan-400 animate-pulse"
                            : "bg-amber-400 animate-pulse"
                        }`}
                      />
                      <h3 className="font-heading font-black text-sm text-foreground capitalize">
                        {isDelivered
                          ? "Delivered Successfully"
                          : isShipped
                          ? "Out for Delivery"
                          : "Processing & Quality Check"}
                      </h3>
                    </div>

                    {order.trackingNumber && (
                      <span className="font-mono text-[11px] text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg border border-border/70">
                        Courier: {order.courierName || "Dubai Express"} • #{order.trackingNumber}
                      </span>
                    )}
                  </div>

                  {/* 4-Step Tracker Bar */}
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    <div className="space-y-1">
                      <div className="h-1.5 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-foreground block">Confirmed</span>
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          isProcessing ? "bg-emerald-500" : "bg-muted"
                        }`}
                      />
                      <span
                        className={`block font-medium ${
                          isProcessing ? "text-foreground font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        Packed
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          isShipped ? "bg-emerald-500" : "bg-muted"
                        }`}
                      />
                      <span
                        className={`block font-medium ${
                          isShipped ? "text-foreground font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        Out for Delivery
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          isDelivered ? "bg-emerald-500" : "bg-muted"
                        }`}
                      />
                      <span
                        className={`block font-medium ${
                          isDelivered ? "text-foreground font-bold text-emerald-400" : "text-muted-foreground"
                        }`}
                      >
                        Delivered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-6 space-y-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{item.title}</p>
                          <p className="text-muted-foreground text-[11px] font-mono">
                            Qty: {item.quantity} • {formatAED(item.priceFils)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="font-mono font-black text-foreground text-sm">
                          {formatAED(item.priceFils * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Action Buttons: Buy Again & Details */}
                  <div className="pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleReorder(order)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{reorderedId === order.id ? "Added to Cart!" : "Buy It Again"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleExpand(order.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
                    >
                      <span>{isExpanded ? "Hide Full Details" : "View Full Details"}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Expanded Order Details Accordion */}
                  {isExpanded && (
                    <div className="mt-4 p-4 rounded-2xl bg-muted/20 border border-border/60 text-xs space-y-3 pt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="font-bold text-foreground flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Delivery Destination</span>
                          </span>
                          <p className="text-muted-foreground">{order.customer}</p>
                          <p className="text-muted-foreground">{order.phone}</p>
                          <p className="text-muted-foreground font-medium">
                            {order.address}, {order.emirate}, UAE
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="font-bold text-foreground flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Payment & Billing</span>
                          </span>
                          <p className="text-muted-foreground capitalize">
                            Method: {order.paymentMethod.replace("_", " ")}
                          </p>
                          <p className="text-muted-foreground">
                            Payment Status:{" "}
                            <span className="font-bold text-emerald-400 uppercase">
                              {order.paymentStatus}
                            </span>
                          </p>
                          <p className="text-muted-foreground font-mono">
                            UAE 5% VAT: {formatAED(order.vatFils)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
