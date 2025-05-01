"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDatabase = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../utils/AppError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
class UserDatabase {
    static async create(data) {
        try {
            return await prisma.user.create({ data });
        }
        catch (error) {
            console.log(error, "error-user");
            throw new AppError_1.AppError("Error creating user", 500, "USER_DB_CREATE_ERROR");
        }
    }
    static async getAll() {
        try {
            return await prisma.user.findMany();
        }
        catch (error) {
            throw new AppError_1.AppError("Error fetching users", 500, "USER_DB_FETCH_ALL_ERROR");
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
    static async loginCurrentUser(data) {
        const { email, password } = data;
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                gym: true, // optional (if you want to use gym details later)
                gymBranch: true, // optional (if you want branch details later)
            }
        });
        if (!user) {
            throw new AppError_1.AppError("User not found", 404, "USER_DB_NOT_FOUND_ERROR");
        }
        if (!user.password) {
            throw new AppError_1.AppError("User password not set", 500, "USER_DB_PASSWORD_NULL_ERROR");
        }
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            throw new AppError_1.AppError("Invalid credentials", 403, "USER_DB_CREDENTIALS_INVALID_ERROR");
        }
        const payload = {
            userId: user.id,
            role: user.role,
            gymId: user.gymId,
            gymBranchId: user.gymBranchId ?? null,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        return {
            token,
            user: payload,
        };
    }
    static async getById(id) {
        try {
            return await prisma.user.findUnique({
                where: { id }
            });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error fetching user with ID: ${id}`, 500, "USER_DB_FETCH_BY_ID_ERROR");
        }
    }
    static async getByEmail(email) {
        try {
            return await prisma.user.findUnique({
                where: { email }
            });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error fetching user with email: ${email}`, 500, "USER_DB_FETCH_BY_EMAIL_ERROR");
        }
    }
    static async update(id, data) {
        try {
            return await prisma.user.update({ where: { id }, data });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error updating user with ID: ${id}`, 500, "USER_DB_UPDATE_ERROR");
        }
    }
    static async delete(id) {
        try {
            return await prisma.user.delete({ where: { id } });
        }
        catch (error) {
            throw new AppError_1.AppError(`Error deleting user with ID: ${id}`, 500, "USER_DB_DELETE_ERROR");
        }
    }
}
exports.UserDatabase = UserDatabase;
