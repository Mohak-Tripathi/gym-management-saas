// services/invoice.service.ts
import { PrismaClient } from "@prisma/client";
import { AppError } from '../utils/AppError';
import { generatePdfBuffer } from '../utils/pdfGenerator';
const prisma = new PrismaClient();


import { toWords } from 'number-to-words';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileBufferToS3, uploadFileToS3 } from '../utils/s3';

export class InvoiceService {

    static async generate(traineeId: string) {
        const trainee = await prisma.trainee.findFirst({
          where: { id: traineeId },
          include: {
            user: true,
            gym: true,
            gymBranch: true,
            traineeMemberships: {
              include: {
                membership: true,
                payments: true,
              },
            },
          },
        });
      
        console.log("Trainee Data:", trainee);

        if (!trainee) {
          throw new AppError("Trainee not found", 404, "TRAINEE_NOT_FOUND");
        }
      
        // Choose the latest or most relevant membership
        const membershipRecord = trainee.traineeMemberships?.[0]; // Or use custom logic to pick the right one
      
        if (!membershipRecord) {
          throw new AppError("Membership record not found", 404, "NO_MEMBERSHIP_FOUND");
        }
      
        const { startDate, endDate, discountedPrice, payments, membership } = membershipRecord;
      
        const totalPaid = payments.reduce((sum:any, p:any) => sum + parseFloat(p.amountPaid.toString()), 0);
        const dueAmount = parseFloat(discountedPrice.toString()) - totalPaid;
      
        const receiptNumber = "GYM-" + uuidv4().slice(0, 8).toUpperCase();
        const amountInWords = toWords(Number(discountedPrice)) + " rupees only";
        const terms = "No refunds. Valid only for selected plan. Taxes included.";
      
        const pdfBuffer = await generatePdfBuffer({
          name: trainee.user.fullName,
          phone: trainee.user.phone,
          gymName: trainee.gym.name,
          branchName: trainee.gymBranch.name,
          receiptNumber,
          membershipName: membership.name,
          startDate,
          endDate,
          amountPaid: totalPaid,
          dueAmount,
          amountInWords,
          terms,
        });
      
        // const pdfUrl = await uploadFileToS3(pdfBuffer, `invoices`);

        const pdfUrlData = await uploadFileBufferToS3(pdfBuffer, {
            originalName: `${receiptNumber}.pdf`,
            mimeType: 'application/pdf',
            folder: 'invoices',
          });
      
        // const invoice = await prisma.invoice.create({
        //   data: {
        //     traineeId: trainee.id,
        //     traineeMembershipId: membershipRecord.id,
        //     amountPaid: totalPaid,
        //     totalAmountDue: parseFloat(discountedPrice.toString()),
        //     paymentMethod: payments[0]?.paymentMethod ?? "OTHER",
        //     paymentDate: new Date(),
        //     receiptNumber,
        //     amountInWords,
        //     terms,
        //     pdfUrl:`https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${pdfUrlData.key}`,
        //     gymId: trainee.gymId,
        //     gymBranchId: trainee.gymBranchId,
        //   },
        // });
      
        // return invoice;
        return "hello world";
      }
      
}
