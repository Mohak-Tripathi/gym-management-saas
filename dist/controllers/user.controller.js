"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../services/user.service"));
const handleErrorResponse_1 = require("../utils/handleErrorResponse");
class UserController {
    static async createUser(req, res) {
        try {
            const user = await user_service_1.default.createUser(req.body);
            res.status(201).json({
                status: 'success',
                data: user
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async getAllUsers(req, res) {
        try {
            const users = await user_service_1.default.getAllUsers();
            res.status(200).json({
                status: 'success',
                data: users
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async loginUser(req, res) {
        try {
            const loginCredentials = await user_service_1.default.loginUserByEmailAndPassword(req.body);
            res.status(200).json({
                status: 'success',
                data: loginCredentials
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async getUserById(req, res) {
        try {
            const user = await user_service_1.default.getUserById(req.params.id);
            res.status(200).json({
                status: 'success',
                data: user
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async getUserByEmail(req, res) {
        try {
            const user = await user_service_1.default.getUserByEmail(req.params.email);
            res.status(200).json({
                status: 'success',
                data: user
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async updateUser(req, res) {
        try {
            const user = await user_service_1.default.updateUser(req.params.id, req.body);
            res.status(200).json({
                status: 'success',
                data: user
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async deleteUser(req, res) {
        try {
            await user_service_1.default.deleteUser(req.params.id);
            res.status(200).json({
                status: 'success',
                message: 'User deleted successfully'
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
}
exports.default = UserController;
