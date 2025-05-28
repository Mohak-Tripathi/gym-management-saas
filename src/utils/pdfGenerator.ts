// // utils/pdfGenerator.ts
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

// export async function generatePdfBuffer(invoiceData: any): Promise<Buffer> {
//   const templatePath = path.join(__dirname, '../templates', 'invoice.ejs');
//   const html = await ejs.renderFile(templatePath, invoiceData);

//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setContent(html:any);
//   const pdfBuffer = await page.pdf({ format: 'A4' });

//   await browser.close();
//   return pdfBuffer;
// }


import { Buffer } from 'buffer'; // Make sure this is imported if needed

export async function generatePdfBuffer(invoiceData: any): Promise<Buffer> {
  const templatePath = path.join(__dirname, '../templates', 'invoice.ejs');
  const html: string = await ejs.renderFile(templatePath, invoiceData);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);

  const pdfUint8Array = await page.pdf({ format: 'A4' });
  const pdfBuffer = Buffer.from(pdfUint8Array); // ✅ Convert to Node.js Buffer

  await browser.close();
  return pdfBuffer;
}

