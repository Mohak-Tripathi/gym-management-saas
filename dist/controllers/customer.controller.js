"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customer_service_1 = __importDefault(require("../services/customer.service"));
class CustomerController {
    constructor() {
        this.customerService = new customer_service_1.default();
    }
    async register(req, res) {
        try {
            const result = await this.customerService.registerCustomer(req.body);
            res.status(201).json(result);
        }
        catch (err) {
            res.status(500).json({ error: 'Something went wrong' });
        }
    }
}
exports.default = CustomerController;
