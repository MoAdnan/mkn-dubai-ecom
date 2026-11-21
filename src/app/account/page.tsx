import { Suspense } from "react";
import { getCurrentUserAction } from "@/app/actions/auth";
import { getCustomerOrdersAction } from "@/app/actions/orders";
import { AccountClient } from "./account-client";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "My Account | MKN Electronics Dubai",
};

async function AccountLoader() {
  const [currentUser, orders] = await Promise.all([
    getCurrentUserAction(),
    getCustomerOrdersAction(),
  ]);

  return <AccountClient initialUser={currentUser} initialOrders={orders} />;
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Loading MKN Dubai Account...</span>
        </div>
      }
    >
      <AccountLoader />
    </Suspense>
  );
}
