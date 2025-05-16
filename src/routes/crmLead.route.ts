import { Router } from 'express';
import {CrmLeadController} from '../controllers/crmLead.controller';

import { authMiddleware, authorize } from '../utils/authMiddleware';
// import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware); 

router.post('/', CrmLeadController.createCRMLead);
router.get('/', CrmLeadController.getAllCRMLeads);
router.get('/:id', CrmLeadController.getCRMLeadById);
router.put('/:id', CrmLeadController.updateCRMLead);
router.delete('/:id', CrmLeadController.deleteCRMLead);

export default router;