import { PaymentMode, PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";
import convertAmountToWords from "../utils/WordsToNum";
const prisma = new PrismaClient();

interface CreatePaymentData {
  traineeMembershipId: string;
  amount: number;
  paymentMode: PaymentMode;
  transactionId?: string;
  taxType?: string;
  taxAmount?: number;
  gymId: string;
  gymBranchId: string;
  nextPaymentDate?: Date; // Add this field
}

// export class PaymentService {
//   async createMembershipPayment(data: CreatePaymentData) {
//     try {

//         const traineeMembership = await tx.traineeMembership.findUnique({
//             where: { id: traineeMembershipId },
//             include: { trainee: true, membership: true }
//           });
//           if (!traineeMembership) {
//             throw new AppError('Trainee membership not found', 404, 'NOT_FOUND');
//           }

//       return await prisma.$transaction(async (tx) => {
//         // 1. Create the payment record
//         const payment = await tx.payment.create({
//           data: {
//             amount: data.amount,
//             paymentMethod: data.paymentMethod,
//             transactionId: data.transactionId,
//             traineeMembershipId: data.traineeMembershipId,
//             gymId: data.gymId,
//             gymBranchId: data.gymBranchId
//           }
//         });

//         // 2. Create the invoice record
//         const invoice = await tx.invoice.create({
//           data: {
//             amount: data.amount,
//             taxType: data.taxType,
//             taxAmount: data.taxAmount || 0,
//             paymentId: payment.id,
//             traineeMembershipId: data.traineeMembershipId,
//             gymId: data.gymId,
//             gymBranchId: data.gymBranchId
//           }
//         });

//         // 3. Update trainee membership payment status
//         await tx.traineeMembership.update({
//           where: { id: data.traineeMembershipId },
//           data: {
//             lastPaymentDate: new Date(),
//             paymentStatus: 'PAID'
//           }
//         });

//         return {
//           payment,
//           invoice
//         };
//       });
//     } catch (error) {
//       console.error('Payment creation error:', error);
//       throw new AppError(
//         'Failed to process payment',
//         500,
//         'PAYMENT_PROCESSING_ERROR'
//       );
//     }
//   }

//   async getMembershipPayments(traineeMembershipId: string, gymId: string) {
//     try {
//       return await prisma.payment.findMany({
//         where: {
//           traineeMembershipId,
//           gymId
//         },
//         include: {
//           invoice: true
//         },
//         orderBy: {
//           createdAt: 'desc'
//         }
//       });
//     } catch (error) {
//       console.error('Get payments error:', error);
//       throw new AppError(
//         'Failed to fetch payments',
//         500,
//         'PAYMENT_FETCH_ERROR'
//       );
//     }
//   }

//   async getPaymentDetails(paymentId: string, gymId: string) {
//     try {
//       const payment = await prisma.payment.findFirst({
//         where: {
//           id: paymentId,
//           gymId
//         },
//         include: {
//           invoice: true,
//           traineeMembership: {
//             include: {
//               trainee: {
//                 include: {
//                   user: true
//                 }
//               }
//             }
//           }
//         }
//       });

//       if (!payment) {
//         throw new AppError(
//           'Payment not found',
//           404,
//           'PAYMENT_NOT_FOUND'
//         );
//       }

//       return payment;
//     } catch (error) {
//       console.error('Get payment details error:', error);
//       throw new AppError(
//         'Failed to fetch payment details',
//         500,
//         'PAYMENT_DETAILS_FETCH_ERROR'
//       );
//     }
//   }
// }

// src/services/payment.service.ts

export class PaymentService {
  private async generateReceiptNumber(tx: any): Promise<string> {
    try {
      // Get current year
      const year = new Date().getFullYear();

      // Get branch code (first 3 digits of branch ID)
      const branchCode = "001"; // You can make this dynamic based on gymBranchId

      // Get the last receipt number for this year and branch
      const lastInvoice = await tx.invoice.findFirst({
        where: {
          receiptNumber: {
            startsWith: `INV-${year}-${branchCode}`,
          },
        },
        orderBy: {
          receiptNumber: "desc",
        },
      });

      let sequenceNumber = 1;
      if (lastInvoice) {
        // Extract the sequence number from last receipt
        const lastSequence = parseInt(lastInvoice.receiptNumber.split("-")[3]);
        sequenceNumber = lastSequence + 1;
      }

      // Format: INV-YYYY-BRANCH-XXXX
      return `INV-${year}-${branchCode}-${String(sequenceNumber).padStart(4, "0")}`;
    } catch (error) {
      throw new AppError(
        "Error generating receipt number",
        500,
        "RECEIPT_NUMBER_ERROR"
      );
    }
  }

  async createMembershipPayment({
    traineeMembershipId,
    amount,
    paymentMode,
    transactionId,
    taxType,
    taxAmount,
    gymId,
    gymBranchId,
    nextPaymentDate,
  }: CreatePaymentData) {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch trainee membership
      // const traineeMembership = await tx.traineeMembership.findUnique({
      //   where: { id: traineeMembershipId },
      //   include: { trainee: true, membership: true }
      // });

      const traineeMembership = await tx.traineeMembership.findUnique({
        where: { id: traineeMembershipId },
        include: {
          trainee: true,
          membership: true,
          invoices: {
            where: {
              status: {
                in: ["PAID", "PARTIALLY_PAID"],
              },
            },
            select: {
              amountPaid: true,
            },
          },
        },
      });

      if (!traineeMembership) {
        throw new AppError("Trainee membership not found", 404, "NOT_FOUND");
      }

      // Calculate total amount paid so far
      const totalAmountPaid = traineeMembership.invoices.reduce(
        (sum, invoice) => sum + Number(invoice.amountPaid),
        0
      );

      // 2. Calculate due amount
      // const discountedPrice = Number(traineeMembership.discountedPrice);
      // const dueAmount = Math.max(discountedPrice - amount, 0);

      const discountedPrice = Number(traineeMembership.discountedPrice);
      const remainingAmount = discountedPrice - totalAmountPaid;
      const dueAmount = Math.max(remainingAmount - amount, 0);

      // Calculate total amount paid including current payment
      const totalAmountPaidIncludingCurrent = totalAmountPaid + amount;

      // 3. Create Invoice FIRST
      const invoice = await tx.invoice.create({
        data: {
          membershipId: traineeMembershipId,
          amountPaid: amount,
          dueAmount: dueAmount,
          nextPaymentDate,
          taxType,
          taxAmount,
          startDate: traineeMembership.startDate,
          endDate: traineeMembership.endDate,
          status: totalAmountPaidIncludingCurrent >= discountedPrice ? "PAID" : "PARTIALLY_PAID",
          receiptNumber: await this.generateReceiptNumber(tx),
          amountInWords: convertAmountToWords(amount),
          pdfUrl: "", // You can generate and update this after creation if needed
          currency: "INR",
          gymBranchId,
          gymId,
        },
      });

      // 4. Create Payment SECOND (using invoice.id)
      const payment = await tx.payment.create({
        data: {
          paymentDate: new Date(),
          paymentMethod: paymentMode,
          transactionId: transactionId || null,
          invoiceId: invoice.id, // Using the invoice.id created above
          gymId,
          gymBranchId,
        },
      });

      return { invoice, payment };
    });
  }

  // ... rest of the service methods remain the same
}
