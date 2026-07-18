import puppeteer from 'puppeteer';
import { HTMLExportService } from './HTMLExportService';

export class PDFGeneratorService {
  /**
   * Generates a PDF buffer from a Resume object.
   */
  public static async generatePDF(resume: any, options: { format?: 'A4' | 'Letter'; margin?: string } = {}): Promise<Buffer> {
    const html = HTMLExportService.generateHTML(resume, options);

    // Launch puppeteer in headless mode
    // Note: In production, consider using browserless.io or a persistent browser instance
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      
      // Load the generated HTML
      await page.setContent(html, { waitUntil: 'load' });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        printBackground: true,
        displayHeaderFooter: false,
        margin: {
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }
}
