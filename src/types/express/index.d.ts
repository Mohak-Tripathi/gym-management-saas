// // src/types/express/index.d.ts
// import { JwtPayload } from 'jsonwebtoken';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: string | JwtPayload; // Adjust type as per your decoded token
//     }
//   }
// }


import { UserRole } from '@prisma/client';

interface CustomJwtPayload {
  userId: string;
  role: UserRole;
  gymId: string;
  gymBranchId: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}