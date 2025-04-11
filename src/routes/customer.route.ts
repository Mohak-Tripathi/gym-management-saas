import { Router } from 'express';
import CustomerController from '../controllers/customer.controller';

const router = Router();
const customerController = new CustomerController();

router.post('/register', customerController.register);

export default router;
