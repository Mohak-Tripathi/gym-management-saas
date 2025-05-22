import { Request, Response } from "express";
import UserService from "../services/user.service";
import { AppError } from "../utils/AppError";
import { handleErrorResponse } from "../utils/handleErrorResponse";

class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const data = req.body;
      const { gymId } = req.user!; // Get both gymId and branchId from authenticated user

      if (!gymId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const user = await UserService.createUser({ ...data, gymId });
      res.status(201).json({
        status: "success",
        data: user,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
      // If using query parameter approach
      const gymBranchId = req.query.gymBranchId as string;

      const users = await UserService.getAllUsers(gymId, gymBranchId);
      res.status(200).json({
        status: "success",
        data: users,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async loginUser(req: Request, res: Response) {
    try {
      const loginCredentials = await UserService.loginUserByEmailAndPassword(
        req.body
      );
      res.status(200).json({
        status: "success",
        data: loginCredentials,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const passwordChanged = await UserService.userChangePassword(
        req.body,
        id
      );
      res.status(200).json({
        status: "success",
        data: passwordChanged,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const user = await UserService.getUserById(id, gymId, gymBranchId);
      res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async getUserByEmail(req: Request, res: Response) {
    try {

      const { email } = req.params;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const user = await UserService.getUserByEmail(email, gymId, gymBranchId );
      res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {


      const { id } = req.params;
      const data = req.body;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const user = await UserService.updateUser(    
        id,
        data,
        gymId,
        gymBranchId);
      res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {


      const { id } = req.params;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      await UserService.deleteUser(id, gymId, gymBranchId);
      res.status(200).json({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }
}

export default UserController;
