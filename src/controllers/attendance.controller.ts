// import { Request, Response } from "express";
// import { AttendanceService } from "../services/attendance.service";
// import { handleErrorResponse } from "../utils/handleErrorResponse";

// export class AttendanceController {
//   static async punchAttendance(req: Request, res: Response) {
//     try {
//       const { userId, method, deviceId } = req.body;

//       const result = await AttendanceService.punchAttendance({ userId, method, deviceId });

//       res.status(result.statusCode).json({
//         success: result.success,
//         message: result.message,
//       });
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   }
// }




import { Request, Response } from "express";
import { AttendanceService } from "../services/attendance.service";
import { AttendanceMethod } from "@prisma/client";
import { verifyQRToken } from "../utils/jwt";
import crypto from 'crypto';

export class AttendanceController {
  // 🎯 Mobile app scans QR and sends token
  static async punchViaQR(req: Request, res: Response) {
    try {
      const { token } = req.body;
      console.log("token", token);
      console.log("req.body", req.body);
      console.log("req.user", req.user);
      

      const decoded: any = verifyQRToken(token);
      console.log("decoded", decoded);
      if (!decoded) {
        res.status(401).json({ message: "Invalid or expired QR token" });
        return
      }

      // const userId = req.user!.id; // user from auth middleware
      const userId = req.user!.userId;
      const deviceId = decoded.deviceId;


      console.log("userId", userId);
      console.log("deviceId", deviceId);
      // const payload = {
      //   deviceId: deviceId,
      //   timestamp: Date.now(),
      //   nonce: crypto.randomBytes(16).toString('hex')
      // };


      const result = await AttendanceService.punchAttendance({
        userId,
        method: AttendanceMethod.QR_SCAN,
        deviceId,
      });

      res.status(result.statusCode).json(result);
    } catch (err) {
      res.status(500).json({ message: "Error punching via QR" });
    }
  }

  // 🎯 Biometric device posts directly to backend
  static async punchViaBiometric(req: Request, res: Response) {
    try {

      const { userId, method, deviceId } = req.body;
      console.log("req.body", req.body);
      console.log("userId", userId);
      console.log("method", method);
      console.log("deviceId", deviceId);

      const result = await AttendanceService.punchAttendance({
        userId,
        method: AttendanceMethod.BIOMETRIC,
        deviceId,
      });

      res.status(result.statusCode).json(result);
    } catch (err) {
      res.status(500).json({ message: "Error punching via biometric" });
    }
  }
}

