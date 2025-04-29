import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();

export class UserDatabase {
  static async create(data: any) {
    try {
      return await prisma.user.create({ data });
    } catch (error) {
      console.log(error, "error-user")
      throw new AppError(
        "Error creating user",
        500,
        "USER_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll() {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      throw new AppError(
        "Error fetching users",
        500,
        "USER_DB_FETCH_ALL_ERROR"
      );
    }
  }


  
  // static async loginCurrentUser(data:any) {
  //   const { email, password } = data;

  //   const user =  await prisma.user.findUnique({
  //     where: { email }
  //   });
  
  //   if (!user) {
  //     throw new AppError(
  //       "user not found",
  //       404,
  //       "USER_DB_NOT_FOUND_ERROR"
  //     );
  //   }
  
  //   const isValid = await bcrypt.compare(password, user.password);
  
  //   if (!isValid) {
  //     throw new AppError(
  //       "invalid credentials",
  //       403,
  //       "USER_DB_CREDENTIALS_FOUND_WRONG"
  //     );
  //   }
  
  //   const payload = {
  //     userId: user.id,
  //     role: user.role,
  //     gymId: user.gymId,
  //     gymBranchId: user.gymBranchId ?? null,
  //   };
  
  //   const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
  //     expiresIn: '7d',
  //   });
  
  //   return ({
  //     token,
  //     user: payload,
  //   });
  // }


  static async loginCurrentUser(data: any) {
    const { email, password } = data;
  
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        gym: true,        // optional (if you want to use gym details later)
        gymBranch: true,  // optional (if you want branch details later)
      }
    });
  
    if (!user) {
      throw new AppError(
        "User not found",
        404,
        "USER_DB_NOT_FOUND_ERROR"
      );
    }
  
    const isValid = await bcrypt.compare(password, user.password);
  
    if (!isValid) {
      throw new AppError(
        "Invalid credentials",
        403,
        "USER_DB_CREDENTIALS_INVALID_ERROR"
      );
    }
  
    const payload = {
      userId: user.id,
      role: user.role,
      gymId: user.gymId,
      gymBranchId: user.gymBranchId ?? null,
    };
  
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });
  
    return {
      token,
      user: payload,
    };
  }
  

  static async getById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id }
      });
    } catch (error) {
      throw new AppError(
        `Error fetching user with ID: ${id}`,
        500,
        "USER_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async getByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      throw new AppError(
        `Error fetching user with email: ${email}`,
        500,
        "USER_DB_FETCH_BY_EMAIL_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
      return await prisma.user.update({ where: { id }, data });
    } catch (error) {
      throw new AppError(
        `Error updating user with ID: ${id}`,
        500,
        "USER_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string) {
    try {
      return await prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new AppError(
        `Error deleting user with ID: ${id}`,
        500,
        "USER_DB_DELETE_ERROR"
      );
    }
  }
}
