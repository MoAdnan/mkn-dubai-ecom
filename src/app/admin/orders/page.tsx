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
} from "lucide-react";
import { formatAED } from "@/lib/utils";
import { generateTaxInvoicePDF } from "@/lib/invoice/generate-pdf";

const INITIAL_ORDERS = [
  {
    id: "ord-1",
    orderNumber: "MKN-2026-98214",
    invoiceNumber: "INV-2026-98214",
    customer: "Adnan Al-Hashimi",
    email: "adnan@example.ae",
    phone: "+971 50 123 4567",
    emirate: "Dubai",
    address: "Downtown Dubai, Burj Crown Tower",
    items: "Apple iPhone 16 Pro Max 256GB Desert Titanium (x1)",
    totalFils: 469900,
    paymentMethod: "card_stripe",
    paymentStatus: "paid",
    orderStatus: "delivered",
    trackingNumber: "DXB-EXP-849201",
    date: "21 Nov 2026",
  },
  {
    id: "ord-2",
    orderNumber: "MKN-2026-87140",
    invoiceNumber: "INV-2026-87140",
    customer: "Sarah Al-Mansoori",
    email: "sarah@example.ae",
    phone: "+971 52 987 6543",
    emirate: "Abu Dhabi",
    address: "Saadiyat Island, Villa 12",
    items: "Apple MacBook Pro 16 M4 Max Space Black (x1)",
    totalFils: 1249900,
    paymentMethod: "card_stripe",
    paymentStatus: "paid",
    orderStatus: "processing",
    trackingNumber: "",
    date: "20 Nov 2026",
  },
  {
    id: "ord-3",
    orderNumber: "MKN-2026-76431",
    invoiceNumber: "INV-2026-76431",
    customer: "Rashid Khalifa (TechCorp LLC)",
    email: "procurement@techcorp.ae",
    phone: "+971 4 234 5678",
    emirate: "Sharjah",
    address: "Al Majaz 3, Tower B",
    items: "ASUS ROG Zephyrus G16 OLED (x1)",
    totalFils: 949900,
    paymentMethod: "cod",
    paymentStatus: "pending",
    orderStatus: "shipped",
    trackingNumber: "SHJ-EXP-209182",
    date: "19 Nov 2026",
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState(INITIAL_ORDERS);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedOrder, setSelectedOrder] = React.useState<typeof INITIAL_ORDERS[0] | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
  };

  const downloadInvoice = (order: typeof INITIAL_ORDERS[0]) => {
    const vatFils = Math.round(order.totalFils - order.totalFils / 1.05);
    const doc = generateTaxInvoicePDF({
      invoiceNumber: order.invoiceNumber,
      orderNumber: order.orderNumber,
      invoiceType: "simplified",
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
      },
      lines: [
        {
          title: order.items,
          quantity: 1,
          unitPriceFils: order.totalFils,
          taxableFils: order.totalFils - vatFils,
          vatFils: vatFils,
          totalFils: order.totalFils,
        },
      ],
      subtotalFils: order.totalFils,
      discountFils: 0,
      shippingFils: 0,
      vatFils: vatFils,
      totalFils: order.totalFils,
    });

    doc.save(`${order.invoiceNumber}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl font-black text-foreground">
          Orders & Fulfillment
        </h1>
        <p className="text-xs text-muted-foreground">
          Track UAE Emirates delivery statuses, payment confirmations, and issue VAT invoices.
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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground bg-muted/30">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer & Emirate</th>
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
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
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
      </div>
    </div>
  );
}

