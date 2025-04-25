import { Request, Response } from 'express';
import UserService from '../services/user.service';
import { AppError } from '../utils/AppError';
import { handleErrorResponse } from '../utils/handleErrorResponse';


class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({
        status: 'success',
        data: user
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
     res.status(200).json({
        status: 'success',
        data: users
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const user = await UserService.getUserById(req.params.id);
       res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async getUserByEmail(req: Request, res: Response) {
    try {
      const user = await UserService.getUserByEmail(req.params.email);
      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      await UserService.deleteUser(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'User deleted successfully'
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

 
}




export default UserController;
