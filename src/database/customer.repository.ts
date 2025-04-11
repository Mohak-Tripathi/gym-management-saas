import { measureMemory } from 'vm';
import { prisma } from './prisma';

export default class CustomerRepository {
  async createCustomer(data: any) {
    // return prisma.customer.create({ data });
    return {message: 'Customer registered successfully'}
  }
}
