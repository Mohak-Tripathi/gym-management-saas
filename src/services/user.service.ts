import { UserDatabase } from '../database/user.database';
import { AppError } from '../utils/AppError';

class UserService {

    static async createUser(data: any, file?: Express.Multer.File) {
      try {
        return await UserDatabase.create(data, file);
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('Error creating user', 500, 'USER_SERVICE_CREATE_ERROR');
      }
    }
  

  static async getAllUsers(gymId: string, branchId: string) {
    try {
      return await UserDatabase.getAll(gymId, branchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching users', 500, 'USER_SERVICE_FETCH_ALL_ERROR');
    }
  }


  static async loginUserByEmailAndPassword(data:any) {
    try {
      return await UserDatabase.loginCurrentUser(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching users', 500, 'USER_SERVICE_FETCH_ALL_ERROR');
    }
  }


  static async userChangePassword(data:any, userId: string) {
    try {
      return await UserDatabase.changePasswordCurrentUser(data, userId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching users', 500, 'USER_SERVICE_FETCH_ALL_ERROR');
    }
  }


  

  static async getUserById(id: string, gymId: string, branchId: string) {
    try {
      const user = await UserDatabase.getById(id, gymId, branchId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error fetching user with ID: ${id}`, 500, 'USER_SERVICE_FETCH_BY_ID_ERROR');
    }
  }

  static async getUserByEmail(email: string, gymId: string, branchId: string) {
    try {
      const user = await UserDatabase.getByEmail(email, gymId, branchId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error fetching user with email: ${email}`, 500, 'USER_SERVICE_FETCH_BY_EMAIL_ERROR');
    }
  }

  static async updateUser(id: string, data: any, gymId: string, branchId: string, file?: Express.Multer.File) {
    try {
      const user = await UserDatabase.getById(id, gymId, branchId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }
      
      return await UserDatabase.update(id, { ...data, gymId, gymBranchId: branchId }, file);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error updating user with ID: ${id}`, 500, 'USER_SERVICE_UPDATE_ERROR');
    }
  }

  static async deleteUser(id: string, gymId: string, branchId: string) {
    try {
      const user = await UserDatabase.getById(id, gymId, branchId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }
      return await UserDatabase.delete(id, gymId, branchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error deleting user with ID: ${id}`, 500, 'USER_SERVICE_DELETE_ERROR');
    }
  }



 
}

export default UserService;
