import { AttendanceDatabase } from "../database/attendance.database";
import { UserDatabase } from "../database/user.database";
import { AppError } from "../utils/AppError";
import { AttendanceMethod, AttendanceStatus } from "@prisma/client";
import { triggerSonoff } from "../utils/sonoffGate";

interface PunchInput {
  userId: string;
  method: AttendanceMethod;
  deviceId?: string;
}

export class AttendanceService {
  static async punchAttendance({ userId, method, deviceId }: PunchInput) {
    console.log("userIdD ", userId);
    console.log("methodD", method);
    console.log("deviceIdD", deviceId);
    if (!userId || !method) {
      throw new AppError("Missing required fields", 400, "ATTENDANCE_VALIDATION_ERROR");
    }

    const user = await UserDatabase.getUserWithMembership(userId);
    console.log("userMyD", user);

    if (!user) {
      throw new AppError("User not found", 404, "ATTENDANCE_USER_NOT_FOUND");
    }


    const status: AttendanceStatus = user.role === "TRAINEE" && (!user.trainee?.traineeMemberships?.length)
    ? "DENIED" 
    : "SUCCESS";

    const attendance = await AttendanceDatabase.createAttendance({
      userId,
      gymId: user.gymId,
      gymBranchId: user.gymBranchId!,
      method,
      status,
    });

    console.log("Myattendance", attendance);

    if (status === "SUCCESS") {
      await triggerSonoff(deviceId); // 🔓 open gate if success
    }

    // return {
    //   statusCode: status === "BLOCKED" ? 403 : 200,
    //   success: status === "SUCCESS",
    //   message: status === "BLOCKED" ? "Membership expired. Access denied." : "Attendance recorded successfully",
    // };
    return {
      statusCode: status === "DENIED" ? 403 : 200,
      success: status === "SUCCESS",
      message:
        status === "DENIED"
          ? "Membership expired or not found. Access denied."
          : "Attendance recorded successfully",
    };
  }
}
