import { Request, Response } from 'express';
import { InvoiceService } from '../services/InvoiceService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InvoiceController {
  public static async downloadInvoice(req: Request, res: Response) {
    try {
      const paymentId = req.params.paymentId as string;
      const { buffer, invoice } = await InvoiceService.generateInvoice(paymentId);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${invoice.invoiceNumber}.pdf`);
      res.send(buffer);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  public static async listInvoices(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const invoices = await prisma.invoice.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
      res.json(invoices);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
