import { Request, Response } from 'express';
import { generateQRToken } from '../utils/jwt';

export class QRController {
  static async getQRToken(req: Request, res: Response) {
    try {
      const { deviceId } = req.query;

      if (!deviceId || typeof deviceId !== 'string') {
        res.status(400).json({ message: 'deviceId is required' });
        return
      }

      const token = generateQRToken(deviceId);
      const qrData = `https://gym-management-saas-frontend-lcle.vercel.app/scan?token=${token}`;
    //   const qrData = `https://blue-bikes-carry.loca.lt/api/attendance/punch/qr?token=${token}`;

      res.json({ token, qrData }); // You can just send token if scanning in app
    } catch (err) {
      res.status(500).json({ message: 'Error generating QR' });
    }
  }
}
