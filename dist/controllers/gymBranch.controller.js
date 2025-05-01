"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GymBranchController = void 0;
const gymBranch_service_1 = require("../services/gymBranch.service");
const handleErrorResponse_1 = require("../utils/handleErrorResponse");
class GymBranchController {
    static async create(req, res) {
        try {
            const gymBranch = await gymBranch_service_1.GymBranchService.create(req.body);
            res.status(201).json(gymBranch);
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async getAll(req, res) {
        try {
            const gymBranches = await gymBranch_service_1.GymBranchService.getAll();
            res.status(200).json(gymBranches);
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const gymBranch = await gymBranch_service_1.GymBranchService.getById(id);
            if (!gymBranch) {
                res.status(404).json({
                    message: "GymBranch not found",
                    code: "GYM_BRANCH_NOT_FOUND"
                });
                return;
            }
            res.status(200).json(gymBranch);
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const updatedGymBranch = await gymBranch_service_1.GymBranchService.update(id, req.body);
            res.status(200).json(updatedGymBranch);
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await gymBranch_service_1.GymBranchService.delete(id);
            res.status(204).send();
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
}
exports.GymBranchController = GymBranchController;
