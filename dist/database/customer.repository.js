"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomerRepository {
    async createCustomer(data) {
        // return prisma.customer.create({ data });
        return { message: 'Customer registered successfully' };
    }
}
exports.default = CustomerRepository;
