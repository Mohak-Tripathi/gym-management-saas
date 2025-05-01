"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = async (plain) => {
    const saltRounds = 10;
    return await bcrypt_1.default.hash(plain, saltRounds);
};
exports.hashPassword = hashPassword;
