import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { AppError } from '../utils/AppError';

export class PaymentController {
  private static paymentService = new PaymentService();

  static async create(req: Request, res: Response) {
    try {
      const { traineeMembershipId } = req.params;
      const { 
        amount, 
        paymentMethod, 
        transactionId,
        taxType,
        taxAmount 
      } = req.body;

      // Get gym and branch info from authenticated user

      const { gymId } = req.user!;
      const gymBranchId = req.query.gymBranchId as string;

      // Validate required fields
      if (!amount || !paymentMethod) {
        throw new AppError(
          'Amount and payment method are required',
          400,
          'INVALID_INPUT'
        );
      }

      // Process payment and create invoice
      const result = await PaymentController.paymentService.createMembershipPayment({
        traineeMembershipId,
        amount,
        paymentMethod,
        transactionId,
        taxType,
        taxAmount,
        gymId,
        gymBranchId
      });

      res.status(201).json({
        status: 'success',
        data: result
      });

    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
          code: error.code
        });
      } else {
        console.error('Payment creation error:', error);
        res.status(500).json({
          status: 'error',
          message: 'Internal server error'
        });
      }
    }
  }

  // Optional: Get payment history for a membership
  static async getMembershipPayments(req: Request, res: Response) {
    try {
      const { traineeMembershipId } = req.params;
      const gymId = req.user.gymId;

      const payments = await PaymentController.paymentService.getMembershipPayments(
        traineeMembershipId,
        gymId
      );

      res.status(200).json({
        status: 'success',
        data: payments
      });

    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
          code: error.code
        });
      } else {
        console.error('Get payments error:', error);
        res.status(500).json({
          status: 'error',
          message: 'Internal server error'
        });
      }
    }
  }

  // Optional: Get single payment details
  static async getPaymentDetails(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const gymId = req.user.gymId;

      const payment = await PaymentController.paymentService.getPaymentDetails(
        paymentId,
        gymId
      );

      res.status(200).json({
        status: 'success',
        data: payment
      });

    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
          code: error.code
        });
      } else {
        console.error('Get payment details error:', error);
        res.status(500).json({
          status: 'error',
          message: 'Internal server error'
        });
      }
    }
  }
}