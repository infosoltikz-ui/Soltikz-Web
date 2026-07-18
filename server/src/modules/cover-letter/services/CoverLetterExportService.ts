import puppeteer from 'puppeteer';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { CoverLetterTemplateService } from './CoverLetterTemplateService';

export class CoverLetterExportService {
  /**
   * Generates a raw HTML string for the cover letter.
   */
  public static generateHTML(content: string, templateId: string): string {
    const config = CoverLetterTemplateService.getTemplateConfig(templateId);
    
    // Simple conversion of paragraphs to HTML
    const paragraphs = content.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cover Letter</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Outfit:wght@400;600&display=swap');
          body {
            font-family: ${config.fontFamily};
            font-size: ${config.fontSize};
            line-height: 1.6;
            color: #333;
            margin: ${config.margin};
            background: white;
          }
          p {
            margin-bottom: 1em;
          }
        </style>
      </head>
      <body>
        ${paragraphs}
      </body>
      </html>
    `;
  }

  /**
   * Generates a PDF buffer from a Cover Letter string.
   */
  public static async generatePDF(content: string, templateId: string): Promise<Buffer> {
    const html = this.generateHTML(content, templateId);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'load' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: false,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  /**
   * Generates a DOCX buffer from a Cover Letter string.
   */
  public static async generateDOCX(content: string, templateId: string): Promise<Buffer> {
    const config = CoverLetterTemplateService.getTemplateConfig(templateId);
    
    // Fallback simple font name for docx
    const docxFont = config.fontFamily.split(',')[0].replace(/['"]/g, '');

    const paragraphs = content.split('\n').filter(p => p.trim() !== '').map(p => {
      return new Paragraph({
        children: [
          new TextRun({
            text: p,
            font: docxFont,
            size: parseInt(config.fontSize) * 2 // docx size is in half-points (e.g. 22 = 11pt)
          })
        ],
        spacing: {
          after: 200, // 10pt
          line: 360, // 1.5 spacing
        }
      });
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs
      }]
    });

    return await Packer.toBuffer(doc);
  }
}
