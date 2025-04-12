import { Request, Response } from "express";
import { MembershipService } from "../services/membership.service";

export class MembershipController {
  static async create(req: Request, res: Response) {
    const data = req.body;
    const membership = await MembershipService.createMembership(data);
    res.status(201).json(membership);
  }

  static async getAll(req: Request, res: Response) {
    const memberships = await MembershipService.getAllMemberships();
    res.json(memberships);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const membership = await MembershipService.getMembershipById(id);
    if (!membership){
        res.status(404).json({ message: "Not found" });
    } else{
      res.json(membership);
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    const membership = await MembershipService.updateMembership(id, data);
    res.json(membership);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await MembershipService.deleteMembership(id);
    res.json({ message: "Deleted successfully" });
  }
}
