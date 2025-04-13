"use strict";
// import { Request, Response } from "express";
// import { MembershipService } from "../services/membership.service";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipController = void 0;
const membership_service_1 = require("../services/membership.service");
const handleErrorResponse_1 = require("../utils/handleErrorResponse");
class MembershipController {
}
exports.MembershipController = MembershipController;
_a = MembershipController;
MembershipController.create = async (req, res) => {
    try {
        const data = req.body;
        const membership = await membership_service_1.MembershipService.createMembership(data);
        res.status(201).json(membership);
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
MembershipController.getAll = async (req, res) => {
    try {
        const memberships = await membership_service_1.MembershipService.getAllMemberships();
        res.json(memberships);
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
MembershipController.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const membership = await membership_service_1.MembershipService.getMembershipById(id);
        if (!membership) {
            res.status(404).json({
                message: "Membership not found",
                code: "MEMBERSHIP_NOT_FOUND",
            });
            return;
        }
        res.json(membership);
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
MembershipController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const membership = await membership_service_1.MembershipService.updateMembership(id, data);
        res.json(membership);
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
MembershipController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await membership_service_1.MembershipService.deleteMembership(id);
        res.json({ message: "Deleted successfully" });
    }
    catch (err) {
        (0, handleErrorResponse_1.handleErrorResponse)(res, err);
    }
};
