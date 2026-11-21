import { Suspense } from "react";
import { getAdminOrdersAction } from "@/app/actions/orders";
import { AdminOrdersClient } from "./orders-client";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Orders & Fulfillment | MKN Admin Dubai",
};

export default async function AdminOrdersPage() {
  const initialOrders = await getAdminOrdersAction();

  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Serving live store orders from server...</span>
        </div>
      }
    >
      <AdminOrdersClient initialOrders={initialOrders} />
    </Suspense>
  );
}
