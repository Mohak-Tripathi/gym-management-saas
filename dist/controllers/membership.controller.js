"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipController = void 0;
const membership_service_1 = require("../services/membership.service");
class MembershipController {
    static async create(req, res) {
        const data = req.body;
        const membership = await membership_service_1.MembershipService.createMembership(data);
        res.status(201).json(membership);
    }
    static async getAll(req, res) {
        const memberships = await membership_service_1.MembershipService.getAllMemberships();
        res.json(memberships);
    }
    static async getById(req, res) {
        const { id } = req.params;
        const membership = await membership_service_1.MembershipService.getMembershipById(id);
        if (!membership) {
            res.status(404).json({ message: "Not found" });
        }
        else {
            res.json(membership);
        }
    }
    static async update(req, res) {
        const { id } = req.params;
        const data = req.body;
        const membership = await membership_service_1.MembershipService.updateMembership(id, data);
        res.json(membership);
    }
    static async delete(req, res) {
        const { id } = req.params;
        await membership_service_1.MembershipService.deleteMembership(id);
        res.json({ message: "Deleted successfully" });
    }
}
exports.MembershipController = MembershipController;
