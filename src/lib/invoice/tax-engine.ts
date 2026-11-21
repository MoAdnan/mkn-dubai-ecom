import { formatAED, aedToFils } from "../utils";

export interface LineItemInput {
  title: string;
  sku?: string;
  quantity: number;
  unitPriceFils: number;
}

export interface TaxCalculationResult {
  lines: {
    title: string;
    sku?: string;
    quantity: number;
    unitPriceFils: number;
    lineSubtotalFils: number;
    lineVatFils: number;
    lineTotalFils: number;
  }[];
  subtotalFils: number;
  discountFils: number;
  shippingFils: number;
  vatRatePercent: number;
  vatFils: number;
  totalFils: number;
  invoiceType: "simplified" | "full";
}

export const UAE_STANDARD_VAT_RATE = 5.0; // 5%
export const UAE_SIMPLIFIED_INVOICE_THRESHOLD_FILS = aedToFils(10000); // AED 10,000

/**
 * Perform exact UAE FTA-compliant VAT and total calculation in integer fils.
 */
export function calculateUAEOrderTax(params: {
  items: LineItemInput[];
  shippingFils?: number;
  discountFils?: number;
  isB2B?: boolean;
  customerTRN?: string;
}): TaxCalculationResult {
  const shippingFils = Math.max(0, params.shippingFils || 0);
  const discountFils = Math.max(0, params.discountFils || 0);

  const lines = params.items.map((item) => {
    const lineTotalFils = item.unitPriceFils * item.quantity;
    // UAE retail prices are tax-inclusive:
    // VAT = LineTotal - (LineTotal / 1.05)
    const lineVatFils = Math.round(lineTotalFils - lineTotalFils / 1.05);
    const lineSubtotalFils = lineTotalFils - lineVatFils;

    return {
      title: item.title,
      sku: item.sku,
      quantity: item.quantity,
      unitPriceFils: item.unitPriceFils,
      lineSubtotalFils,
      lineVatFils,
      lineTotalFils,
    };
  });

  const subtotalFils = lines.reduce((acc, l) => acc + l.lineTotalFils, 0);
  const rawTotalFils = Math.max(0, subtotalFils + shippingFils - discountFils);

  // Total VAT in Fils
  const vatFils = lines.reduce((acc, l) => acc + l.lineVatFils, 0);

  // Determine simplified vs full tax invoice
  // Full tax invoice required if total > AED 10,000 or customer provides TRN (B2B)
  const isFullInvoice =
    Boolean(params.isB2B) ||
    Boolean(params.customerTRN?.trim()) ||
    rawTotalFils > UAE_SIMPLIFIED_INVOICE_THRESHOLD_FILS;

  return {
    lines,
    subtotalFils,
    discountFils,
    shippingFils,
    vatRatePercent: UAE_STANDARD_VAT_RATE,
    vatFils,
    totalFils: rawTotalFils,
    invoiceType: isFullInvoice ? "full" : "simplified",
  };
}
