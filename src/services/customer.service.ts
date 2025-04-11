import CustomerRepository from '../database/customer.repository';

export default class CustomerService {
  private customerRepo = new CustomerRepository();

  async registerCustomer(data: any) {
    // Business logic here (e.g., validations, transformations)
    //return this.customerRepo.createCustomer(data);
    return { message: 'Customer registered successfully' };
  }
}
