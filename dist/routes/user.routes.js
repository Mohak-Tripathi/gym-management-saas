"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const router = (0, express_1.Router)();
// Create a new user
router.post('/', user_controller_1.default.createUser);
router.post("/login", user_controller_1.default.loginUser);
// Get all users
router.get('/', user_controller_1.default.getAllUsers);
// Get user by ID
router.get('/:id', user_controller_1.default.getUserById);
// Get user by email
router.get('/email/:email', user_controller_1.default.getUserByEmail);
// Update user
router.put('/:id', user_controller_1.default.updateUser);
// Delete user
router.delete('/:id', user_controller_1.default.deleteUser);
exports.default = router;
