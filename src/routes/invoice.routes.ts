// routes/invoice.routes.ts

import { Router } from "express";
import { InvoiceController } from '../controllers/invoice.controller';
import { authMiddleware, authorize } from '../utils/authMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();
router.use(authMiddleware); 

router.post('/generate', InvoiceController.generateInvoice); // Called after membership onboarding or retry

router.get('/:invoiceId/download', InvoiceController.downloadInvoice); // Presigned URL delivery

export default router;







