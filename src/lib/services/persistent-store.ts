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

const INITIAL_ORDERS: StoredOrder[] = [
  {
    id: "ord-1",
    orderNumber: "MKN-2026-98214",
    invoiceNumber: "INV-2026-98214",
    customer: "Adnan Al-Hashimi",
    email: "adnan@example.ae",
    phone: "+971 50 123 4567",
    emirate: "Dubai",
    address: "Downtown Dubai, Burj Crown Tower, Suite 1402",
    items: [
      {
        title: "Apple iPhone 16 Pro Max 256GB Desert Titanium",
        sku: "MKN-APL-IP16PM-256",
        quantity: 1,
        priceFils: 469900,
      },
    ],
    itemsSummary: "Apple iPhone 16 Pro Max 256GB Desert Titanium (x1)",
    subtotalFils: 447524,
    vatFils: 22376,
    shippingFils: 0,
    discountFils: 0,
    totalFils: 469900,
    paymentMethod: "card_stripe",
    paymentStatus: "paid",
    orderStatus: "delivered",
    trackingNumber: "DXB-EXP-849201",
    courierName: "MKN Dubai Express Courier",
    date: "21 Nov 2026",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ord-2",
    orderNumber: "MKN-2026-87140",
    invoiceNumber: "INV-2026-87140",
    customer: "Sarah Al-Mansoori",
    email: "sarah@example.ae",
    phone: "+971 52 987 6543",
    emirate: "Abu Dhabi",
    address: "Saadiyat Island, Villa 12",
    items: [
      {
        title: "Apple MacBook Pro 16 M4 Max Space Black",
        sku: "MKN-APL-MBP16-M4M",
        quantity: 1,
        priceFils: 1249900,
      },
    ],
    itemsSummary: "Apple MacBook Pro 16 M4 Max Space Black (x1)",
    subtotalFils: 1190381,
    vatFils: 59519,
    shippingFils: 0,
    discountFils: 0,
    totalFils: 1249900,
    paymentMethod: "card_stripe",
    paymentStatus: "paid",
    orderStatus: "processing",
    trackingNumber: "AUH-EXP-192842",
    courierName: "MKN Emirates Standard",
    date: "20 Nov 2026",
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_INVOICES: StoredInvoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-98214",
    orderNumber: "MKN-2026-98214",
    invoiceType: "simplified",
    issueDate: "21 Nov 2026",
    customer: "Adnan Al-Hashimi",
    email: "adnan@example.ae",
    phone: "+971 50 123 4567",
    address: "Downtown Dubai, Burj Crown Tower, Suite 1402",
    emirate: "Dubai",
    subtotalFils: 447524,
    vatFils: 22376,
    totalFils: 469900,
    createdAt: new Date().toISOString(),
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-87140",
    orderNumber: "MKN-2026-87140",
    invoiceType: "full",
    issueDate: "20 Nov 2026",
    customer: "Sarah Al-Mansoori (B2B)",
    email: "sarah@example.ae",
    phone: "+971 52 987 6543",
    address: "Saadiyat Island, Villa 12",
    emirate: "Abu Dhabi",
    customerTRN: "100982736100003",
    subtotalFils: 1190381,
    vatFils: 59519,
    totalFils: 1249900,
    createdAt: new Date().toISOString(),
  },
];

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
  return data.products || DEMO_PRODUCTS;
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

// ---------------- ORDERS ----------------

export function getStoredOrders(): StoredOrder[] {
  const data = getStoreData();
  return data.orders || INITIAL_ORDERS;
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
  return data.invoices || INITIAL_INVOICES;
}

