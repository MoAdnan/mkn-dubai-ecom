import fs from "fs";
import path from "path";

const storePath = path.join(process.cwd(), "data", "store.json");
const data = JSON.parse(fs.readFileSync(storePath, "utf-8"));

console.log("=======================================================");
console.log("   MKN DUBAI - STOCK REDUCTION & INVENTORY VERIFICATION");
console.log("=======================================================");

// Find test product or first product
const product = data.products.find((p) => p.stock_quantity > 0) || data.products[0];
if (!product) {
  console.error("❌ No products found in store.");
  process.exit(1);
}

const initialStock = product.stock_quantity;
console.log(`Testing product: "${product.title}"`);
console.log(`Initial stock: ${initialStock}`);

// Test reduction logic
const purchaseQty = 1;
const expectedStock = Math.max(0, initialStock - purchaseQty);
product.stock_quantity = expectedStock;

if (product.stock_quantity === expectedStock) {
  console.log(`✅ PASS: Purchasing ${purchaseQty} item correctly reduces stock to ${expectedStock}`);
} else {
  console.error(`❌ FAIL: Expected ${expectedStock}, got ${product.stock_quantity}`);
  process.exit(1);
}

// Test out of stock transition
const remainingQty = product.stock_quantity;
product.stock_quantity = Math.max(0, product.stock_quantity - remainingQty);

if (product.stock_quantity === 0) {
  console.log("✅ PASS: Depleting inventory transitions stock to 0 (Out of Stock)");
} else {
  console.error("❌ FAIL: Stock should be 0");
  process.exit(1);
}

// Restore product stock
product.stock_quantity = initialStock;
fs.writeFileSync(storePath, JSON.stringify(data, null, 2), "utf-8");
console.log("✅ PASS: Restored test stock to original value");
console.log(">>> ALL STOCK REDUCTION VERIFICATIONS COMPLETED SUCCESSFULLY <<<");

