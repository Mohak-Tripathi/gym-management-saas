"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = __importDefault(require("../controllers/customer.controller"));
const router = (0, express_1.Router)();
const customerController = new customer_controller_1.default();
router.post('/register', customerController.register);
exports.default = router;
