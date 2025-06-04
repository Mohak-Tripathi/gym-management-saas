// // // utils/pdfGenerator.ts
// import puppeteer from 'puppeteer';
// import fs from 'fs';
// import path from 'path';
// import ejs from 'ejs';



// import { Buffer } from 'buffer'; // Make sure this is imported if needed

// export async function generatePdfBuffer(invoiceData: any): Promise<Buffer> {
//   const templatePath = path.join(__dirname, '../templates', 'invoice.ejs');
//   const html: string = await ejs.renderFile(templatePath, invoiceData);

//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setContent(html);

//   const pdfUint8Array = await page.pdf({ format: 'A4' });
//   const pdfBuffer = Buffer.from(pdfUint8Array); // ✅ Convert to Node.js Buffer

//   await browser.close();
//   return pdfBuffer;
// }



// // export async function generatePdfBuffer(invoiceData: any): Promise<Buffer> {
// //   const templatePath = path.join(__dirname, '../templates', 'invoice.ejs');
// //   const html = await ejs.renderFile(templatePath, invoiceData);

// //   const browser = await puppeteer.launch();
// //   const page = await browser.newPage();
// //   await page.setContent(html:any);
// //   const pdfBuffer = await page.pdf({ format: 'A4' });

// //   await browser.close();
// //   return pdfBuffer;
// // }



import PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';

interface InvoicePdfData {
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  gymName: string;
  gymAddress: string;
  gymPhone: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  membershipName: string;
  membershipDuration: string;
  startDate: Date;
  endDate: Date;
  currentPayment: {
    amount: number;
    date: Date;
    method: string;
    transactionId?: string;
  };
  totalAmount: number;
  amountPaid: number;
  dueAmount: number;
  amountInWords: string;
  taxType?: string;
  taxAmount?: number;
  terms: string;
}

export async function generateInvoicePdf(data: InvoicePdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Collect PDF chunks
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Add content to PDF
    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    // Gym Information
    doc.fontSize(12).text(data.gymName, { align: 'right' });
    doc.fontSize(10).text(data.gymAddress, { align: 'right' });
    doc.fontSize(10).text(`Phone: ${data.gymPhone}`, { align: 'right' });
    doc.moveDown();

    // Invoice Details
    doc.fontSize(12).text(`Invoice Number: ${data.invoiceNumber}`);
    doc.fontSize(10).text(`Date: ${data.invoiceDate.toLocaleDateString()}`);
    if (data.dueDate) {
      doc.text(`Due Date: ${data.dueDate.toLocaleDateString()}`);
    }
    doc.moveDown();

    // Customer Information
    doc.fontSize(12).text('Bill To:');
    doc.fontSize(10).text(data.customerName);
    doc.text(data.customerPhone);
    doc.text(data.customerEmail || "");
    doc.moveDown();

    // Membership Details
    doc.fontSize(12).text('Membership Details:');
    doc.fontSize(10).text(`Plan: ${data.membershipName}`);
    doc.text(`Duration: ${data.membershipDuration}`);
    doc.text(`Start Date: ${data.startDate.toLocaleDateString()}`);
    doc.text(`End Date: ${data.endDate.toLocaleDateString()}`);
    doc.moveDown();

    // Payment Details
    doc.fontSize(12).text('Payment Details:');
    doc.fontSize(10).text(`Amount Paid: ₹${data.amountPaid}`);
    doc.text(`Due Amount: ₹${data.dueAmount}`);
    doc.text(`Total Amount: ₹${data.totalAmount}`);
    doc.text(`Amount in Words: ${data.amountInWords}`);
    doc.moveDown();

    // Current Payment
    doc.fontSize(12).text('Current Payment:');
    doc.fontSize(10).text(`Amount: ₹${data.currentPayment.amount}`);
    doc.text(`Date: ${data.currentPayment.date.toLocaleDateString()}`);
    doc.text(`Method: ${data.currentPayment.method}`);
    if (data.currentPayment.transactionId) {
      doc.text(`Transaction ID: ${data.currentPayment.transactionId}`);
    }
    doc.moveDown();

    // Tax Information
    if (data.taxType && data.taxAmount) {
      doc.fontSize(12).text('Tax Details:');
      doc.fontSize(10).text(`Type: ${data.taxType}`);
      doc.text(`Amount: ₹${data.taxAmount}`);
      doc.moveDown();
    }

    // Terms and Conditions
    doc.fontSize(10).text('Terms and Conditions:', { underline: true });
    doc.fontSize(8).text(data.terms);

    // Finalize PDF
    doc.end();
  });
}