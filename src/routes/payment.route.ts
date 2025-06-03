import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';


import { authMiddleware} from '../utils/authMiddleware';

const router = Router();

router.use(authMiddleware); 


router.post('/membership/:traineeMembershipId', PaymentController.create);



export default router;
