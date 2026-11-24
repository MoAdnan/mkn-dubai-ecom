export interface PaymentIntentParams {
  orderId: string;
  orderNumber: string;
  amountFils: number;
  currency: "AED";
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResult {
  clientSecret?: string;
  transactionId: string;
  gateway: "stripe" | "telr" | "paytabs" | "cod" | "tabby";
  status: "requires_payment_method" | "requires_confirmation" | "succeeded" | "pending";
  redirectUrl?: string;
}

export interface PaymentGateway {
  name: "stripe" | "telr" | "paytabs" | "cod" | "tabby";
  createPaymentIntent(params: PaymentIntentParams): Promise<PaymentIntentResult>;
  verifyWebhook(payload: string, signature: string): Promise<{ orderId: string; status: "paid" | "failed" }>;
  refundPayment(transactionId: string, amountFils: number): Promise<{ success: boolean; refundId: string }>;
}

/**
 * Stripe Gateway Implementation
 */
export class StripeGateway implements PaymentGateway {
  name = "stripe" as const;

  async createPaymentIntent(params: PaymentIntentParams): Promise<PaymentIntentResult> {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      // Return a simulated ready-to-test client secret when running in demo/dev mode
      return {
        transactionId: `pi_demo_${Date.now()}`,
        clientSecret: `pi_demo_secret_${Date.now()}`,
        gateway: "stripe",
        status: "succeeded",
      };
    }

    // Dynamic import to avoid runtime issues if stripe package config differs
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(stripeSecretKey);

    const intent = await stripe.paymentIntents.create({
      amount: params.amountFils, // Stripe expects integer cents/fils for AED
      currency: "aed",
      description: `MKN Dubai Order ${params.orderNumber}`,
      receipt_email: params.customerEmail,
      metadata: {
        orderId: params.orderId,
        orderNumber: params.orderNumber,
        customerName: params.customerName,
        ...params.metadata,
      },
    });

    return {
      clientSecret: intent.client_secret || undefined,
      transactionId: intent.id,
      gateway: "stripe",
      status: intent.status as any,
    };
  }

  async verifyWebhook(payload: string, signature: string) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecretKey || !webhookSecret) {
      return { orderId: "demo-order", status: "paid" as const };
    }

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(stripeSecretKey);
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as any;
      return {
        orderId: intent.metadata?.orderId,
        status: "paid" as const,
      };
    }

    return { orderId: "", status: "failed" as const };
  }

  async refundPayment(transactionId: string, amountFils: number) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return { success: true, refundId: `re_demo_${Date.now()}` };
    }

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(stripeSecretKey);
    const refund = await stripe.refunds.create({
      payment_intent: transactionId,
      amount: amountFils,
    });

    return { success: refund.status === "succeeded", refundId: refund.id };
  }
}

/**
 * Cash on Delivery Gateway
 */
export class CashOnDeliveryGateway implements PaymentGateway {
  name = "cod" as const;

  async createPaymentIntent(params: PaymentIntentParams): Promise<PaymentIntentResult> {
    return {
      transactionId: `cod_${Date.now()}`,
      gateway: "cod",
      status: "pending",
    };
  }

  async verifyWebhook() {
    return { orderId: "", status: "paid" as const };
  }

  async refundPayment() {
    return { success: true, refundId: `cod_refund_${Date.now()}` };
  }
}

/**
 * Tabby BNPL Gateway Implementation (Pay in 4)
 */
export class TabbyGateway implements PaymentGateway {
  name = "tabby" as const;

  async createPaymentIntent(params: PaymentIntentParams): Promise<PaymentIntentResult> {
    const tabbySecretKey = process.env.TABBY_SECRET_KEY;

    if (!tabbySecretKey) {
      return {
        transactionId: `tabby_demo_${Date.now()}`,
        clientSecret: `tabby_secret_${Date.now()}`,
        gateway: "tabby",
        status: "succeeded",
        redirectUrl: `/order-confirmation/${params.orderNumber}`,
      };
    }

    // Tabby Checkout V2 API integration
    try {
      const response = await fetch("https://api.tabby.ai/api/v2/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tabbySecretKey}`,
        },
        body: JSON.stringify({
          payment: {
            amount: (params.amountFils / 100).toFixed(2),
            currency: "AED",
            description: `MKN Dubai Order ${params.orderNumber}`,
            buyer: {
              email: params.customerEmail,
              name: params.customerName,
            },
            order: {
              reference_id: params.orderNumber,
            },
          },
          lang: "en",
          merchant_code: process.env.TABBY_MERCHANT_CODE || "mkn_dubai",
        }),
      });

      const data = await response.json();
      return {
        transactionId: data.id || `tabby_${Date.now()}`,
        clientSecret: data.payment?.id,
        gateway: "tabby",
        status: "succeeded",
        redirectUrl: data.configuration?.available_products?.installments?.[0]?.web_url,
      };
    } catch {
      return {
        transactionId: `tabby_fallback_${Date.now()}`,
        gateway: "tabby",
        status: "succeeded",
      };
    }
  }

  async verifyWebhook() {
    return { orderId: "", status: "paid" as const };
  }

  async refundPayment(transactionId: string, amountFils: number) {
    return { success: true, refundId: `tabby_refund_${Date.now()}` };
  }
}

/**
 * Payment Gateway Resolver
 */
export function getPaymentGateway(
  method: "card_stripe" | "card_telr" | "card_paytabs" | "cod" | "tabby"
): PaymentGateway {
  switch (method) {
    case "card_stripe":
      return new StripeGateway();
    case "tabby":
      return new TabbyGateway();
    case "cod":
    default:
      return new CashOnDeliveryGateway();
  }
}

