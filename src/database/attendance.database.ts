
import { PrismaClient } from "@prisma/client";
import { AttendanceMethod, AttendanceStatus } from "@prisma/client";
import { AppError } from "../utils/AppError";


const prisma = new PrismaClient();


interface AttendanceData {
  userId: string;
  gymId: string;
  gymBranchId: string;
  method: AttendanceMethod;
  deviceId?: string;
  status: AttendanceStatus;
}

export class AttendanceDatabase {
  static async createAttendance(data: AttendanceData) {
    try {
      return await prisma.attendance.create({ data });
    } catch (error) {
      throw new AppError("Error recording attendance", 500, "ATTENDANCE_DB_CREATE_ERROR");
    }
  }
}
