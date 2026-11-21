import { Suspense } from "react";
import { getAdminInvoicesAction } from "@/app/actions/orders";
import { AdminInvoicesClient } from "./invoices-client";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "UAE Tax Invoices | MKN Admin Dubai",
};

export default async function AdminInvoicesPage() {
  const initialInvoices = await getAdminInvoicesAction();

  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Serving verified UAE tax invoices from server...</span>
        </div>
      }
    >
      <AdminInvoicesClient initialInvoices={initialInvoices} />
    </Suspense>
  );
}
