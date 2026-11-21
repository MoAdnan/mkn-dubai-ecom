import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatAED, filsToAED } from "@/lib/utils";

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  invoiceType: "simplified" | "full";
  issueDate: string;
  supplyDate: string;
  supplier: {
    name: string;
    address: string;
    trn: string;
    license: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    emirate: string;
    trn?: string;
    companyName?: string;
  };
  lines: {
    title: string;
    sku?: string;
    quantity: number;
    unitPriceFils: number;
    taxableFils: number;
    vatFils: number;
    totalFils: number;
  }[];
  subtotalFils: number;
  discountFils: number;
  shippingFils: number;
  vatFils: number;
  totalFils: number;
}

/**
 * Generate a production-ready, FTA-compliant PDF Tax Invoice
 */
export function generateTaxInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Bar (Cyan/Dark accent)
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 40, "F");

  // Title: TAX INVOICE
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  const title =
    data.invoiceType === "full"
      ? "TAX INVOICE / فاتورة ضريبية"
      : "SIMPLIFIED TAX INVOICE / فاتورة ضريبية مبسطة";
  doc.text(title, 14, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Compliant with UAE Federal Decree-Law No. (8) of 2017 on VAT", 14, 25);
  doc.text(`Invoice No: ${data.invoiceNumber}  |  Order Ref: ${data.orderNumber}`, 14, 32);

  // Supplier & Customer 2-column info
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("SUPPLIER / المورّد:", 14, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(data.supplier.name, 14, 56);
  doc.text(data.supplier.address, 14, 61);
  doc.text(`TRN: ${data.supplier.trn}`, 14, 66);
  doc.text(`Commercial License: ${data.supplier.license}`, 14, 71);

  // Customer column
  const custX = 115;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("CUSTOMER / العميل:", custX, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(data.customer.companyName || data.customer.name, custX, 56);
  doc.text(`${data.customer.address}, ${data.customer.emirate}, UAE`, custX, 61);
  doc.text(`Email: ${data.customer.email}  |  Phone: ${data.customer.phone}`, custX, 66);
  if (data.customer.trn) {
    doc.text(`Customer TRN: ${data.customer.trn}`, custX, 71);
  }

  // Dates block
  doc.setFont("helvetica", "bold");
  doc.text(`Issue Date: ${data.issueDate}`, 14, 80);
  doc.text(`Supply Date: ${data.supplyDate}`, custX, 80);

  // Table of line items
  const tableRows = data.lines.map((line, idx) => [
    (idx + 1).toString(),
    `${line.title}\nSKU: ${line.sku || "N/A"}`,
    line.quantity.toString(),
    `AED ${filsToAED(line.unitPriceFils).toFixed(2)}`,
    `AED ${filsToAED(line.taxableFils).toFixed(2)}`,
    "5%",
    `AED ${filsToAED(line.vatFils).toFixed(2)}`,
    `AED ${filsToAED(line.totalFils).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 86,
    head: [
      [
        "#",
        "Item Description",
        "Qty",
        "Unit Price",
        "Taxable Amount",
        "VAT %",
        "VAT Amount",
        "Gross Total",
      ],
    ],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 55 },
      2: { cellWidth: 12, halign: "center" },
      3: { cellWidth: 22, halign: "right" },
      4: { cellWidth: 25, halign: "right" },
      5: { cellWidth: 14, halign: "center" },
      6: { cellWidth: 22, halign: "right" },
      7: { cellWidth: 25, halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;

  // Financial Summary Box
  const summaryX = 120;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");

  doc.text("Subtotal (before VAT):", summaryX, finalY);
  doc.text(
    `AED ${filsToAED(data.subtotalFils - data.vatFils).toFixed(2)}`,
    pageWidth - 14,
    finalY,
    { align: "right" }
  );

  doc.text("UAE VAT (5%):", summaryX, finalY + 5);
  doc.text(`AED ${filsToAED(data.vatFils).toFixed(2)}`, pageWidth - 14, finalY + 5, {
    align: "right",
  });

  if (data.discountFils > 0) {
    doc.text("Discount Applied:", summaryX, finalY + 10);
    doc.text(
      `-AED ${filsToAED(data.discountFils).toFixed(2)}`,
      pageWidth - 14,
      finalY + 10,
      { align: "right" }
    );
  }

  doc.text("UAE Delivery Fee:", summaryX, finalY + 15);
  doc.text(
    data.shippingFils === 0 ? "FREE" : `AED ${filsToAED(data.shippingFils).toFixed(2)}`,
    pageWidth - 14,
    finalY + 15,
    { align: "right" }
  );

  // Total Gross Payable
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setFillColor(241, 245, 249);
  doc.rect(summaryX - 4, finalY + 19, pageWidth - summaryX - 10, 8, "F");
  doc.text("Total Payable (AED):", summaryX, finalY + 25);
  doc.text(
    `AED ${filsToAED(data.totalFils).toFixed(2)}`,
    pageWidth - 14,
    finalY + 25,
    { align: "right" }
  );

  // FTA Legal Declaration & Retention Warning
  const footerY = 275;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "This tax invoice is legally generated by MKN Electronics L.L.C. in accordance with UAE Federal Tax Authority requirements.",
    14,
    footerY
  );
  doc.text(
    "Retention notice: Tax invoices must be retained for at least five (5) years from the end of the calendar year in which they were issued.",
    14,
    footerY + 4
  );

  return doc;
}

