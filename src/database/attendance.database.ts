
// import { PrismaClient } from "@prisma/client";
import { AttendanceMethod, AttendanceStatus } from "@prisma/client";
import { AppError } from "../utils/AppError";

import prisma from "../prisma"
// const prisma = new PrismaClient();


interface AttendanceData {
  userId: string;
  gymId: string;
  gymBranchId: string;
  method: AttendanceMethod;
  deviceId?: string;
  status: AttendanceStatus;
}

// export class AttendanceDatabase {
//   static async createAttendance(data: any) {
//     try {


//       console.log("Attempting to create attendance with data:", data);
//       const result = await prisma.attendance.create({ data });
//       console.log("Attendance created successfully:", result);
//       return result;
//     } catch (error) {
//       console.log("error", error);
//       throw new AppError("Error recording attendance", 500, "ATTENDANCE_DB_CREATE_ERROR");
//     }
//   }
// }



export class AttendanceDatabase {
  static async createAttendance(data: any) {
    try {
      return await prisma.attendance.create({
        data: {
          ...data,
          user: {
            connect: {
              id: data.userId
            }
          }
        }
      });
    } catch (error) {
      console.error("Error in createAttendance:", error);
      throw new AppError("Error recording attendance", 500, "ATTENDANCE_DB_CREATE_ERROR");
    }
  }
}
