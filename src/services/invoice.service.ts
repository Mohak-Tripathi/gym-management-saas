// // services/invoice.service.ts
// import { PrismaClient } from "@prisma/client";
// import { AppError } from '../utils/AppError';
// import { generatePdfBuffer } from '../utils/pdfGenerator';
// const prisma = new PrismaClient();


// import { toWords } from 'number-to-words';
// import { v4 as uuidv4 } from 'uuid';
// import { uploadFileBufferToS3, uploadFileToS3 } from '../utils/s3';

// export class InvoiceService {

//     static async generate(traineeId: string) {
//         const trainee = await prisma.trainee.findFirst({
//           where: { id: traineeId },
//           include: {
//             user: true,
//             gym: true,
//             gymBranch: true,
//             traineeMemberships: {
//               include: {
//                 membership: true,
//                 payments: true,
//               },
//             },
//           },
//         });
      
//         console.log("Trainee Data:", trainee);

//         if (!trainee) {
//           throw new AppError("Trainee not found", 404, "TRAINEE_NOT_FOUND");
//         }
      
//         // Choose the latest or most relevant membership
//         const membershipRecord = trainee.traineeMemberships?.[0]; // Or use custom logic to pick the right one
      
//         if (!membershipRecord) {
//           throw new AppError("Membership record not found", 404, "NO_MEMBERSHIP_FOUND");
//         }
      
//         const { startDate, endDate, discountedPrice, payments, membership } = membershipRecord;
      
//         const totalPaid = payments.reduce((sum:any, p:any) => sum + parseFloat(p.amountPaid.toString()), 0);
//         const dueAmount = parseFloat(discountedPrice.toString()) - totalPaid;
      
//         const receiptNumber = "GYM-" + uuidv4().slice(0, 8).toUpperCase();
//         const amountInWords = toWords(Number(discountedPrice)) + " rupees only";
//         const terms = "No refunds. Valid only for selected plan. Taxes included.";
      
//         const pdfBuffer = await generatePdfBuffer({
//           name: trainee.user.fullName,
//           phone: trainee.user.phone,
//           gymName: trainee.gym.name,
//           branchName: trainee.gymBranch.name,
//           receiptNumber,
//           membershipName: membership.name,
//           startDate,
//           endDate,
//           amountPaid: totalPaid,
//           dueAmount,
//           amountInWords,
//           terms,
//         });
      
//         // const pdfUrl = await uploadFileToS3(pdfBuffer, `invoices`);

//         const pdfUrlData = await uploadFileBufferToS3(pdfBuffer, {
//             originalName: `${receiptNumber}.pdf`,
//             mimeType: 'application/pdf',
//             folder: 'invoices',
//           });
      
//         // const invoice = await prisma.invoice.create({
//         //   data: {
//         //     traineeId: trainee.id,
//         //     traineeMembershipId: membershipRecord.id,
//         //     amountPaid: totalPaid,
//         //     totalAmountDue: parseFloat(discountedPrice.toString()),
//         //     paymentMethod: payments[0]?.paymentMethod ?? "OTHER",
//         //     paymentDate: new Date(),
//         //     receiptNumber,
//         //     amountInWords,
//         //     terms,
//         //     pdfUrl:`https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${pdfUrlData.key}`,
//         //     gymId: trainee.gymId,
//         //     gymBranchId: trainee.gymBranchId,
//         //   },
//         // });
      
//         // return invoice;
//         return "hello world";
//       }
      
// }



import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { generateInvoicePdf } from "../utils/pdfGenerator";

import { getPresignedImageUrl } from "../utils/getPresignedImageUrl";
import { uploadFileBufferToS3 } from "../utils/s3";

const prisma = new PrismaClient();

export class InvoiceService {
  static async generatePdfForInvoice(invoiceId: string, gymId: string) {
    // 1. Fetch complete invoice data
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        gymId
      },
      include: {
        membership: {
          include: {
            trainee: {
              include: {
                user: true
              }
            },
            membership: true
          }
        },
        gym: true,
        gymBranch: true,
        payments: {
          orderBy: {
            paymentDate: 'desc'
          },
          take: 1
        }
      }
    });

    if (!invoice) {
      throw new AppError('Invoice not found', 404, 'INVOICE_NOT_FOUND');
    }

    // 2. Prepare data for PDF
    // const pdfData = {
    //   // Customer Information
    //   customerName: invoice.membership.trainee.user.fullName,
    //   customerPhone: invoice.membership.trainee.user.phone,
    //   customerEmail: invoice.membership.trainee.user.email || "",
      
    //   // Gym Information
    //   gymName: invoice.gym.name,
    //   gymAddress: invoice.gymBranch.address,
    //   gymPhone: "9838532766",
      
    //   // Invoice Details
    //   invoiceNumber: invoice.receiptNumber,
    //   invoiceDate: invoice.createdAt || undefined,
    //   dueDate: invoice.nextPaymentDate || undefined,
      
    //   // Membership Details
    //   membershipName: invoice.membership.membership.name,
    //   membershipDuration: `${invoice.membership.membership.baseDuration} months`,
    //   startDate: invoice.startDate,
    //   endDate: invoice.endDate,
      
    //   currentPayment: {
    //     amount: invoice.amountPaid,
    //     date: invoice.payments[0]?.paymentDate,
    //     method: invoice.payments[0]?.paymentMethod,
    //     transactionId: invoice.payments[0]?.transactionId || undefined  // Convert null to undefined
    //   },
    //   totalAmount: invoice.membership.discountedPrice,
    //   amountPaid: invoice.amountPaid,
    //   dueAmount: invoice.dueAmount,
    //   amountInWords: invoice.amountInWords,
      
    //   // Tax Information
    //   taxType: invoice.taxType,
    //   taxAmount: invoice.taxAmount,
      
    //   // Terms and Conditions
    //   terms: invoice.terms || 'No refunds. Valid only for selected plan. Taxes included.'
    // };



    const pdfData = {
      // Customer Information
      customerName: invoice.membership.trainee.user.fullName || '',
      customerPhone: invoice.membership.trainee.user.phone || '',
      customerEmail: invoice.membership.trainee.user.email || '',
      
      // Gym Information
      gymName: invoice.gym.name || '',
      gymAddress: invoice.gymBranch.address || '',
      gymPhone:  '9090909099',
      
      // Invoice Details
      invoiceNumber: invoice.receiptNumber || '',
      invoiceDate: invoice.createdAt || undefined,
      dueDate: invoice.nextPaymentDate || undefined,
      
      // Membership Details
      membershipName: invoice.membership.membership.name || '',
      membershipDuration: `${invoice.membership.membership.baseDuration || 0} months`,
      startDate: invoice.startDate || undefined,
      endDate: invoice.endDate || undefined,
      
      // Payment Details
      currentPayment: {
        amount: invoice.amountPaid || 0,
        date: invoice.payments[0]?.paymentDate || undefined,
        method: invoice.payments[0]?.paymentMethod || undefined,
        transactionId: invoice.payments[0]?.transactionId || undefined
      },
      // totalAmount: invoice.membership.discountedPrice || 0,
      totalAmount: Number(invoice.membership.discountedPrice) || 0,
      amountPaid: invoice.amountPaid || 0,
      dueAmount: invoice.dueAmount || 0,
      amountInWords: invoice.amountInWords || '',
      
      // Tax Information
      taxType: invoice.taxType || undefined,
      taxAmount: invoice.taxAmount || 0,
      
      // Terms and Conditions
      terms: invoice.terms || 'No refunds. Valid only for selected plan. Taxes included.'
    };
    // 3. Generate PDF
    const pdfBuffer = await generateInvoicePdf(pdfData);

    // 4. Upload to S3
    // const s3Key = `invoices/${invoice.gymId}/${invoice.receiptNumber}.pdf`;
    // await uploadToS3(pdfBuffer, s3Key, 'application/pdf');

    //reploy
    const pdfUrlData = await uploadFileBufferToS3(pdfBuffer, {
      originalName: `${invoice.receiptNumber}.pdf`,
      mimeType: 'application/pdf',
      folder: 'invoices'
    });

    // 5. Generate presigned URL (valid for 1 hour)
    const presignedUrl = await getPresignedImageUrl(pdfUrlData.key);

    // 6. Update invoice with PDF URL if not already set
    if (!invoice.pdfUrl) {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          // pdfUrl: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`
          pdfUrl: pdfUrlData.key 
        }
      });
    }

    return {
      invoice,
      presignedUrl
    };
  }
}