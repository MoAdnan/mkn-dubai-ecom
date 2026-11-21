"use client";

import * as React from "react";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  FileText,
  Download,
  AlertCircle,
  CreditCard,
  Loader2,
  Check,
} from "lucide-react";
import { formatAED, filsToAED } from "@/lib/utils";
import { generateTaxInvoicePDF } from "@/lib/invoice/generate-pdf";
import { getAdminOrdersAction, updateOrderStatusAction } from "@/app/actions/orders";
import type { StoredOrder } from "@/lib/services/persistent-store";

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<StoredOrder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [toast, setToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getAdminOrdersAction();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateOrderStatus = async (orderId: string, newStatus: any) => {
    try {
      const updated = await updateOrderStatusAction(orderId, newStatus);
      setOrders(updated);
      showToast(`Order status updated to "${newStatus}" and synchronized.`);
    } catch (err: any) {
      alert("Failed to update status: " + err?.message);
    }
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

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-cyan-500 text-black font-semibold text-xs shadow-2xl animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-black text-foreground">
          Orders & Fulfillment ({orders.length})
        </h1>
        <p className="text-xs text-muted-foreground">
          Live customer orders. Status updates persist in database and immediately update customer order tracking.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card border border-border/80 p-3.5 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search order ref, customer name, invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted/40 border border-border/70 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {["all", "processing", "shipped", "delivered"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-medium capitalize transition-colors ${
                statusFilter === st
                  ? "bg-cyan-500 text-black font-bold"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Loading live store orders...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground bg-muted/30">
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer & Emirate</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4">Gross Total</th>
                  <th className="py-3 px-4 text-right">Tax Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/20">
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-foreground block">{order.orderNumber}</span>
                      <span className="text-[10px] text-muted-foreground">{order.date}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-foreground block">{order.customer}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {order.emirate}, UAE • {order.phone}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-foreground line-clamp-1">{order.itemsSummary}</p>
                      {order.trackingNumber && (
                        <p className="text-[10px] text-cyan-400 font-mono">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase text-[11px] font-bold text-foreground block">
                        {order.paymentMethod === "cod" ? "Cash on Delivery" : "Stripe Card"}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          order.paymentStatus === "paid" ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-background border border-border/80 text-[11px] font-semibold text-foreground capitalize focus:border-cyan-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      {formatAED(order.totalFils)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted hover:bg-cyan-500 hover:text-black text-muted-foreground text-[11px] font-semibold transition-colors"
                        aria-label="Download Tax Invoice"
                      >
                        <Download className="w-3 h-3" />
                        <span>{order.invoiceNumber}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
