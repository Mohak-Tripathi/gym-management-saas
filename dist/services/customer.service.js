"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customer_repository_1 = __importDefault(require("../database/customer.repository"));
class CustomerService {
    constructor() {
        this.customerRepo = new customer_repository_1.default();
    }
    async registerCustomer(data) {
        // Business logic here (e.g., validations, transformations)
        //return this.customerRepo.createCustomer(data);
        return { message: 'Customer registered successfully' };
    }
}
exports.default = CustomerService;
