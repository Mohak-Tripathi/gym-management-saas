


import { Request, Response, RequestHandler } from 'express';
import { InvoiceService } from '../services/invoice.service';
import { handleErrorResponse } from '../utils/handleErrorResponse';

export class InvoiceController {
  // static generateInvoice: RequestHandler = async (req: Request, res: Response) => {
  //   const data = req.body;
  //   const { gymId, gymBranchId } = req.user!;

  //   if (!gymId || !gymBranchId) {
  //     res.status(400).json({ error: "Gym ID and Branch ID are required" });
  //     return 
  //   }

  //   try {
  //     const invoice = await InvoiceService.generate({
  //       ...data,
  //       gymId,
  //       gymBranchId,
  //     });

  //     res.status(201).json(invoice);
  //   } catch (err) {
  //     handleErrorResponse(res, err);
  //   }
  // };

  static async generateInvoicePdf(req: Request, res: Response) {
    try {
      const { invoiceId } = req.params;
      const { gymId } = req.user!;

      const result = await InvoiceService.generatePdfForInvoice(invoiceId, gymId);
      
      res.status(200).json({
        status: 'success',
        data: {
          pdfUrl: result.presignedUrl,
          invoice: result.invoice
        }
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }



//   static downloadInvoice: RequestHandler = async (req: Request, res: Response) => {
//     const { invoiceId } = req.params;

//     try {
//       const url = await InvoiceService.getPresignedUrl(invoiceId);

//       if (!url) {
//          res.status(404).json({ message: "Invoice file not found" });
//          return 
//       }

//       res.json({ url });
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   };
}
