import { Resend } from "resend";
import { formatAED } from "@/lib/utils";

export interface SendOrderEmailParams {
  toEmail: string;
  customerName: string;
  orderNumber: string;
  invoiceNumber: string;
  totalFils: number;
  emirate: string;
  items: { title: string; quantity: number; priceFils: number }[];
}

export async function sendOrderConfirmationEmail(params: SendOrderEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Graceful fallback for dev / sandbox mode
    console.log(
      `[Resend Simulation] Order confirmation email dispatched to ${params.toEmail} for order ${params.orderNumber} (Invoice ${params.invoiceNumber})`
    );
    return { success: true, simulated: true };
  }

  const resend = new Resend(apiKey);

  const itemsHtml = params.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">
          ${item.title} (x${item.quantity})
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; color: #1e293b;">
          ${formatAED(item.priceFils * item.quantity)}
        </td>
      </tr>
    `
    )
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - MKN Electronics Dubai</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background-color: #0f172a; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">
              MKN <span style="color: #00f2fe;">ELECTRONICS DUBAI</span>
            </h1>
            <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase;">
              Commercial License: 1048291 • TRN: 100482918200003
            </p>
          </div>

          <!-- Body -->
          <div style="padding: 32px 24px;">
            <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Dear ${params.customerName},</h2>
            <p style="color: #475569; font-size: 14px; line-height: 1.5;">
              Thank you for shopping with MKN Electronics Dubai. Your order has been confirmed and is being prepared for dispatch.
            </p>

            <div style="background-color: #f1f5f9; border-radius: 12px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="color: #64748b;">Order Number:</td>
                  <td style="font-weight: 700; text-align: right; color: #0f172a;">${params.orderNumber}</td>
                </tr>
                <tr>
                  <td style="color: #64748b;">Tax Invoice Reference:</td>
                  <td style="font-weight: 700; text-align: right; color: #0284c7;">${params.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="color: #64748b;">Delivery Emirate:</td>
                  <td style="font-weight: 700; text-align: right; color: #0f172a;">${params.emirate}, UAE</td>
                </tr>
                <tr>
                  <td style="color: #64748b;">Total Amount (Incl. 5% VAT):</td>
                  <td style="font-weight: 800; text-align: right; color: #0f172a; font-size: 15px;">${formatAED(params.totalFils)}</td>
                </tr>
              </table>
            </div>

            <h3 style="color: #0f172a; font-size: 14px; margin-bottom: 8px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              ${itemsHtml}
            </table>

            <p style="color: #64748b; font-size: 12px; margin-top: 24px; line-height: 1.5;">
              Your official FTA-compliant PDF Tax Invoice has been generated and is stored permanently in your account records.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center; font-size: 11px; color: #64748b;">
            <p style="margin: 0;">MKN Electronics L.L.C. • Al Quoz Industrial 1, Dubai, United Arab Emirates</p>
            <p style="margin: 4px 0 0 0;">Customer Care: +971 4 398 2211 • support@mkn-dubai.ae</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: "MKN Electronics Dubai <orders@mkn-dubai.ae>",
      to: [params.toEmail],
      subject: `Order Confirmed: ${params.orderNumber} (Tax Invoice ${params.invoiceNumber})`,
      html: emailHtml,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send transactional email via Resend:", error);
    return { success: false, error };
  }
}

