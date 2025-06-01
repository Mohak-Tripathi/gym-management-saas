// TODO => 
//     Daily duplicate attendance prevention
// Location/device-based restrictions
// Bulk punch API for admins
// Attendance summary endpoint


import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { authMiddleware } from '../utils/authMiddleware';

const router = Router();

router.use(authMiddleware); // Optional, if you want to restrict

// router.post('/punch', AttendanceController.punchAttendance);
router.post("/punch/qr",  AttendanceController.punchViaQR);
router.post("/punch/biometric", AttendanceController.punchViaBiometric);

export default router;
