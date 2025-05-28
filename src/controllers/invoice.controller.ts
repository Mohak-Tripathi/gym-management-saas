// // controllers/invoice.controller.ts
// import { Request, Response } from 'express';
// import { InvoiceService } from '../services/invoice.service';

// export const InvoiceController = {
//   async generateInvoice(req: Request, res: Response) {
//     try {
//       const invoiceData = req.body; // contains traineeId, payment details etc.
//       const result = await InvoiceService.generate(invoiceData);
//       res.status(201).json(result);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Failed to generate invoice' });
//     }
//   },

//   async downloadInvoice(req: Request, res: Response) {
//     try {
//       const { invoiceId } = req.params;
//       const url = await InvoiceService.getPresignedUrl(invoiceId);
//       res.json({ url });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Download failed' });
//     }
//   }
// };


import { Request, Response, RequestHandler } from 'express';
import { InvoiceService } from '../services/invoice.service';
import { handleErrorResponse } from '../utils/handleErrorResponse';

export class InvoiceController {
  static generateInvoice: RequestHandler = async (req: Request, res: Response) => {
    const data = req.body;
    const { gymId, gymBranchId } = req.user!;

    if (!gymId || !gymBranchId) {
      res.status(400).json({ error: "Gym ID and Branch ID are required" });
      return 
    }

    try {
      const invoice = await InvoiceService.generate({
        ...data,
        gymId,
        gymBranchId,
      });

      res.status(201).json(invoice);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };



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
