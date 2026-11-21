function aedToFils(aed) {
  return Math.round(aed * 100);
}

function filsToAED(fils) {
  return Number((fils / 100).toFixed(2));
}

function formatAED(fils) {
  const aed = fils / 100;
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(aed);
}

function calculateUAEOrderTax(params) {
  const shippingFils = Math.max(0, params.shippingFils || 0);
  const discountFils = Math.max(0, params.discountFils || 0);

  const lines = params.items.map((item) => {
    const lineTotalFils = item.unitPriceFils * item.quantity;
    const lineVatFils = Math.round(lineTotalFils - lineTotalFils / 1.05);
    const lineSubtotalFils = lineTotalFils - lineVatFils;

    return {
      title: item.title,
      quantity: item.quantity,
      unitPriceFils: item.unitPriceFils,
      lineSubtotalFils,
      lineVatFils,
      lineTotalFils,
    };
  });

  const subtotalFils = lines.reduce((acc, l) => acc + l.lineTotalFils, 0);
  const rawTotalFils = Math.max(0, subtotalFils + shippingFils - discountFils);
  const vatFils = lines.reduce((acc, l) => acc + l.lineVatFils, 0);

  const isFullInvoice =
    Boolean(params.isB2B) ||
    Boolean(params.customerTRN?.trim()) ||
    rawTotalFils > 1000000; // AED 10,000

  return {
    lines,
    subtotalFils,
    discountFils,
    shippingFils,
    vatRatePercent: 5.0,
    vatFils,
    totalFils: rawTotalFils,
    invoiceType: isFullInvoice ? "full" : "simplified",
  };
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log("\n=======================================================");
console.log("   MKN DUBAI - UAE TAX & INVOICING VERIFICATION");
console.log("=======================================================\n");

// 1. Math Safety & Integer Fils
assert(aedToFils(1) === 100, "1 AED = 100 fils exact integer math");
assert(aedToFils(4699) === 469900, "4,699 AED = 469900 fils");
assert(filsToAED(469900) === 4699.0, "469900 fils converts back to 4699.00 AED");
assert(formatAED(469900).includes("4,699.00"), "formatAED contains AED 4,699.00");

// 2. Exact UAE 5% VAT on tax-inclusive pricing
const t1 = calculateUAEOrderTax({
  items: [{ title: "AirPods Max", quantity: 1, unitPriceFils: 105000 }],
});
assert(t1.vatFils === 5000, "Item price AED 1,050 inclusive yields exactly AED 50.00 VAT");
assert(t1.subtotalFils === 105000, "Subtotal equals AED 1,050.00");
assert(t1.invoiceType === "simplified", "Orders <= AED 10,000 generate Simplified Tax Invoice");

// 3. Multi-line orders with Emirates shipping and Coupon
const t2 = calculateUAEOrderTax({
  items: [
    { title: "iPhone 16 Pro Max", quantity: 1, unitPriceFils: 469900 },
    { title: "Sony WH-1000XM5", quantity: 2, unitPriceFils: 114900 },
  ],
  shippingFils: 3500, // Express Dubai Shipping AED 35
  discountFils: 5000, // AED 50 Coupon
});
const expectedSubtotal = 469900 + 114900 * 2;
assert(t2.subtotalFils === expectedSubtotal, "Subtotal matches exact item sum");
assert(t2.totalFils === expectedSubtotal + 3500 - 5000, "Total matches subtotal + delivery - discount");

// 4. B2B Corporate TRN & High Value threshold (> AED 10,000)
const t3 = calculateUAEOrderTax({
  items: [{ title: "MacBook Pro 16 M4 Max", quantity: 1, unitPriceFils: 1249900 }],
});
assert(t3.invoiceType === "full", "Orders > AED 10,000 generate Full Tax Invoice");

const t4 = calculateUAEOrderTax({
  items: [{ title: "Wireless Charger", quantity: 1, unitPriceFils: 19900 }],
  customerTRN: "100482918200003",
  isB2B: true,
});
assert(t4.invoiceType === "full", "Any order with Corporate TRN generates Full Tax Invoice");

console.log("\n>>> ALL 8 UAE TAX & INVOICING VERIFICATIONS COMPLETED SUCCESSFULLY <<<\n");

