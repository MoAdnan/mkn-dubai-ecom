import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const storeFile = path.join(dataDir, "store.json");

console.log("Checking data store directory and file...");
if (fs.existsSync(storeFile)) {
  const content = JSON.parse(fs.readFileSync(storeFile, "utf-8"));
  console.log("Products count in store.json:", content.products?.length);
  console.log("Orders count in store.json:", content.orders?.length);
  console.log("Invoices count in store.json:", content.invoices?.length);
  console.log("✅ Store file verified successfully.");
} else {
  console.log("store.json will be initialized on first server interaction.");
}

