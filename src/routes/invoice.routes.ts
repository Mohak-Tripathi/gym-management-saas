// routes/invoice.routes.ts

import { Router } from "express";
import { InvoiceController } from '../controllers/invoice.controller';
import { authMiddleware, authorize } from '../utils/authMiddleware';

const router = Router();
router.use(authMiddleware); 

// router.post('/generate', InvoiceController.generateInvoice); // Called after membership onboarding or retry

// Add new route for generating PDF for existing invoice
router.get('/:invoiceId/pdf', InvoiceController.generateInvoicePdf);
// router.get('/:invoiceId/download', InvoiceController.downloadInvoice); // Presigned URL delivery

export default router;







