import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { AppError } from '../utils/AppError';
import { handleErrorResponse } from '../utils/handleErrorResponse';
import { PaymentMode } from '@prisma/client';

export class PaymentController {
 

  static async create(req: Request, res: Response) {
    try {
      const { traineeMembershipId } = req.params;
      const { 
        amount, 
        paymentMode, 
        transactionId,
        taxType,
        taxAmount ,
        nextPaymentDate
      } = req.body;

      
    // Validate payment method
    if (!Object.values(PaymentMode).includes(paymentMode)) {
      throw new AppError('Invalid payment method', 400, 'INVALID_PAYMENT_METHOD');
    }

    // Generate transactionId for specific payment methods if not provided
    let finalTransactionId = transactionId;
    if (!transactionId && ['CARD', 'UPI', 'BANK_TRANSFER', 'WALLET'].includes(paymentMode)) {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      finalTransactionId = `TXN-${timestamp}-${random}`;
    }

      // Get gym and branch info from authenticated user

      const { gymId } = req.user!;
      const gymBranchId = req.query.gymBranchId as string;

      // // Validate required fields
      // if (!amount || !paymentMethod) {
      //   throw new AppError(
      //     'Amount and payment method are required',
      //     400,
      //     'INVALID_INPUT'
      //   );
      // }
      const paymentService = new PaymentService();
      // Process payment and create invoice
      const result = await paymentService.createMembershipPayment({
        traineeMembershipId,
        amount,
        paymentMode,
        transactionId: finalTransactionId,
        taxType,
        taxAmount,
        gymId,
        gymBranchId,
        nextPaymentDate
      });

      res.status(201).json({
        status: 'success',
        data: result
      });

    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  // // Optional: Get payment history for a membership
  // static async getMembershipPayments(req: Request, res: Response) {
  //   try {
  //     const { traineeMembershipId } = req.params;
  //     const gymId = req.user.gymId;

  //     const payments = await PaymentController.paymentService.getMembershipPayments(
  //       traineeMembershipId,
  //       gymId
  //     );

  //     res.status(200).json({
  //       status: 'success',
  //       data: payments
  //     });

  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       res.status(error.statusCode).json({
  //         status: 'error',
  //         message: error.message,
  //         code: error.code
  //       });
  //     } else {
  //       console.error('Get payments error:', error);
  //       res.status(500).json({
  //         status: 'error',
  //         message: 'Internal server error'
  //       });
  //     }
  //   }
  // }

  // Optional: Get single payment details
  // static async getPaymentDetails(req: Request, res: Response) {
  //   try {
  //     const { paymentId } = req.params;
  //     const gymId = req.user.gymId;

  //     const payment = await PaymentController.paymentService.getPaymentDetails(
  //       paymentId,
  //       gymId
  //     );

  //     res.status(200).json({
  //       status: 'success',
  //       data: payment
  //     });

  //   } catch (error) {
  //     if (error instanceof AppError) {
  //       res.status(error.statusCode).json({
  //         status: 'error',
  //         message: error.message,
  //         code: error.code
  //       });
  //     } else {
  //       console.error('Get payment details error:', error);
  //       res.status(500).json({
  //         status: 'error',
  //         message: 'Internal server error'
  //       });
  //     }
  //   }
  // }
}