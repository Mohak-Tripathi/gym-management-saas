"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraineeMembershipController = void 0;
const traineemembership_service_1 = require("../services/traineemembership.service");
const handleErrorResponse_1 = require("../utils/handleErrorResponse");
class TraineeMembershipController {
    //   static async create(req: Request, res: Response) {
    //     try {
    //       const traineeMembership = await TraineeMembershipService.createTraineeMembership(req.body);
    //       res.status(201).json({
    //         status: "success",
    //         data: traineeMembership
    //       });
    //     } catch (err) {
    //       handleErrorResponse(res, err);
    //     }
    //   }
    static async getAll(req, res) {
        try {
            const traineeMemberships = await traineemembership_service_1.TraineeMembershipService.getAllTraineeMemberships();
            res.status(200).json({
                status: "success",
                data: traineeMemberships
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const traineeMembership = await traineemembership_service_1.TraineeMembershipService.getTraineeMembershipById(id);
            res.status(200).json({
                status: "success",
                data: traineeMembership
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const traineeMembership = await traineemembership_service_1.TraineeMembershipService.updateTraineeMembership(id, req.body);
            res.status(200).json({
                status: "success",
                data: traineeMembership
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            await traineemembership_service_1.TraineeMembershipService.deleteTraineeMembership(id);
            res.status(204).json({
                status: "success",
                data: null
            });
        }
        catch (err) {
            (0, handleErrorResponse_1.handleErrorResponse)(res, err);
        }
    }
}
exports.TraineeMembershipController = TraineeMembershipController;
