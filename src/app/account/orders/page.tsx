import { Suspense } from "react";
import { getCustomerOrdersAction } from "@/app/actions/orders";
import { CustomerOrdersClient } from "./orders-client";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "My Orders | MKN Electronics Dubai",
};

async function OrdersLoader() {
  const initialOrders = await getCustomerOrdersAction();
  return <CustomerOrdersClient initialOrders={initialOrders} />;
}

export default function CustomerOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Loading order history from server...</span>
        </div>
      }
    >
      <OrdersLoader />
    </Suspense>
  );
}
