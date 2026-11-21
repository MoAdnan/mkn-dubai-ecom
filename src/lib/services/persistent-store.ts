import fs from "fs";
import path from "path";
import { DEMO_PRODUCTS, type DemoProduct } from "@/lib/products-data";

export interface StoredOrder {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  customer: string;
  email: string;
  phone: string;
  emirate: string;
  address: string;
  items: {
    title: string;
    sku?: string;
    quantity: number;
    priceFils: number;
  }[];
  itemsSummary: string;
  subtotalFils: number;
  vatFils: number;
  shippingFils: number;
  discountFils: number;
  totalFils: number;
  paymentMethod: "card_stripe" | "cod";
  paymentStatus: "paid" | "pending" | "refunded";
  cardLast4?: string;
  cardBrand?: string;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  trackingNumber: string;
  courierName: string;
  date: string;
  createdAt: string;
  isB2B?: boolean;
  customerTRN?: string;
}

export interface StoredInvoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  invoiceType: "simplified" | "full";
  issueDate: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  emirate: string;
  customerTRN?: string;
  subtotalFils: number;
  vatFils: number;
  totalFils: number;
  createdAt: string;
}

interface StoreData {
  products: DemoProduct[];
  orders: StoredOrder[];
  invoices: StoredInvoice[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

const INITIAL_ORDERS: StoredOrder[] = [];

const INITIAL_INVOICES: StoredInvoice[] = [];

// Helper to ensure data directory and file exist
function getStoreData(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(STORE_FILE)) {
      const initial: StoreData = {
        products: DEMO_PRODUCTS,
        orders: INITIAL_ORDERS,
        invoices: INITIAL_INVOICES,
      };
      fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }

    const content = fs.readFileSync(STORE_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Store read error, using defaults:", err);
    return {
      products: DEMO_PRODUCTS,
      orders: INITIAL_ORDERS,
      invoices: INITIAL_INVOICES,
    };
  }
}

function saveStoreData(data: StoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Store write error:", err);
  }
}

// ---------------- PRODUCTS ----------------

export function getStoredProducts(): DemoProduct[] {
  const data = getStoreData();
  if (!data.products || data.products.length === 0) {
    data.products = [...DEMO_PRODUCTS];
    saveStoreData(data);
    return data.products;
  }
  return data.products;
}

export function saveStoredProduct(product: DemoProduct): DemoProduct[] {
  const data = getStoreData();
  const existingIdx = data.products.findIndex((p) => p.id === product.id);

  if (existingIdx >= 0) {
    data.products[existingIdx] = product;
  } else {
    data.products.unshift(product);
  }

  saveStoreData(data);
  return data.products;
}

export function deleteStoredProduct(id: string): DemoProduct[] {
  const data = getStoreData();
  data.products = data.products.filter((p) => p.id !== id);
  saveStoreData(data);
  return data.products;
}

export function reduceProductStock(
  items: { productId: string; variantId?: string; quantity: number }[]
): DemoProduct[] {
  const data = getStoreData();
  let changed = false;

  for (const item of items) {
    const product = data.products.find(
      (p) => p.id === item.productId || p.slug === item.productId
    );
    if (product) {
      product.stock_quantity = Math.max(0, product.stock_quantity - item.quantity);
      changed = true;

      if (item.variantId && product.variants) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }
      }
    }
  }

  if (changed) {
    saveStoreData(data);
  }

  return data.products;
}

// ---------------- ORDERS ----------------

export function getStoredOrders(): StoredOrder[] {
  const data = getStoreData();
  return data.orders || [];
}

export function getStoredOrderByNumber(orderNumber: string): StoredOrder | undefined {
  const data = getStoreData();
  return (data.orders || []).find(
    (o) =>
      o.orderNumber.toLowerCase() === orderNumber.toLowerCase() ||
      o.id === orderNumber
  );
}

export function saveStoredOrder(order: StoredOrder): StoredOrder[] {
  const data = getStoreData();
  data.orders.unshift(order);

  // Also create corresponding invoice automatically
  const newInvoice: StoredInvoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber: order.invoiceNumber,
    orderNumber: order.orderNumber,
    invoiceType: order.isB2B || order.customerTRN ? "full" : "simplified",
    issueDate: order.date,
    customer: order.customer,
    email: order.email,
    phone: order.phone,
    address: order.address,
    emirate: order.emirate,
    customerTRN: order.customerTRN,
    subtotalFils: order.subtotalFils,
    vatFils: order.vatFils,
    totalFils: order.totalFils,
    createdAt: new Date().toISOString(),
  };

  data.invoices.unshift(newInvoice);

  saveStoreData(data);
  return data.orders;
}

export function updateStoredOrderStatus(
  orderId: string,
  status: StoredOrder["orderStatus"],
  trackingNumber?: string
): StoredOrder[] {
  const data = getStoreData();
  const order = data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);

  if (order) {
    order.orderStatus = status;
    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }
    if (status === "delivered" && order.paymentMethod === "cod") {
      order.paymentStatus = "paid";
    }
    saveStoreData(data);
  }

  return data.orders;
}

// ---------------- INVOICES ----------------

export function getStoredInvoices(): StoredInvoice[] {
  const data = getStoreData();
  return data.invoices || [];
}

