import { Request, Response } from 'express';
import CustomerService from '../services/customer.service';

export default class CustomerController {
  private customerService = new CustomerService();

  async register(req: Request, res: Response) {
    try {
      const result = await this.customerService.registerCustomer(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
}
