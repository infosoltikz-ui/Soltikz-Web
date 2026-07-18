import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InvoiceService {
  /**
   * Generates a PDF invoice for a given payment ID.
   */
  public static async generateInvoice(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { user: true, subscription: true }
    });

    if (!payment) throw new Error('Payment not found');

    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const tax = payment.amount * 0.18; // Mock 18% tax
    
    // In a real scenario, this would be uploaded to Cloudinary or AWS S3. 
    // Here we generate the PDF buffer on the fly.
    
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #2563eb; }
            .invoice-details { margin-bottom: 40px; }
            .invoice-details p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
            th { background-color: #f8fafc; }
            .total-row { font-weight: bold; font-size: 1.1em; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>AI Resume Builder</h1>
          </div>
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
            <p><strong>Date:</strong> ${new Date(payment.createdAt).toLocaleDateString()}</p>
            <p><strong>Billed To:</strong> ${payment.user.name} (${payment.user.email})</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Subscription Plan: ${payment.subscription?.plan || 'Plan'}</td>
                <td>$${payment.amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Tax (18%)</td>
                <td>$${tax.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td>Total</td>
                <td>$${(payment.amount + tax).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <p style="margin-top: 50px; font-size: 0.9em; color: #666; text-align: center;">
            Thank you for your business!
          </p>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    // Save invoice record
    const invoice = await prisma.invoice.create({
      data: {
        paymentId,
        userId: payment.userId,
        invoiceNumber,
        amount: payment.amount,
        tax,
      }
    });

    return { invoice, buffer: pdfBuffer };
  }
}
