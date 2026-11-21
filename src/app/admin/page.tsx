import { Suspense } from "react";
import { getAdminProductsAction } from "@/app/actions/admin-products";
import { getAdminOrdersAction } from "@/app/actions/orders";
import { AdminDashboardClient } from "./dashboard-client";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Merchant Dashboard | MKN Electronics Dubai",
};

export default async function AdminDashboardPage() {
  const [products, orders] = await Promise.all([
    getAdminProductsAction(),
    getAdminOrdersAction(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Computing live metrics from server...</span>
        </div>
      }
    >
      <AdminDashboardClient products={products} orders={orders} />
    </Suspense>
  );
}
