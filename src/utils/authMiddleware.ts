// authMiddleware.ts (Express-style)
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { UserRole } from '@prisma/client';

interface JwtPayload {
  userId: string;
  role: UserRole;
  gymId: string;
  gymBranchId: string | null;
}

export const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader){
    res.status(401).json({ error: "Missing token" })
    return
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: "JWT secret not configured" });
      return 
    }
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
    return
  }
};





export const authorize =
  (...allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Access denied' });
    return 
    }
    next();
  };
