import { Router } from 'express';
import { QRController } from '../controllers/qr.controllers';

const router = Router();

router.get('/', QRController.getQRToken); // /api/qr?deviceId=branch123

export default router;





