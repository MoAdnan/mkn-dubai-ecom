import { Suspense } from "react";
import { getOrderByNumberAction } from "@/app/actions/orders";
import { OrderConfirmationClient } from "./confirmation-client";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Order Confirmation | MKN Electronics Dubai",
};

interface OrderConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
}

async function OrderConfirmationData({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumberAction(orderNumber);
  return <OrderConfirmationClient order={order} orderNumber={orderNumber} />;
}

export default function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Retrieving verified order from server...</span>
          </div>
        }
      >
        <OrderConfirmationData params={params} />
      </Suspense>
    </main>
  );
}
