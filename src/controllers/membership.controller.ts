// import { Request, Response } from "express";
// import { MembershipService } from "../services/membership.service";

// export class MembershipController {
//   static async create(req: Request, res: Response) {
//     const data = req.body;
//     const membership = await MembershipService.createMembership(data);
//     res.status(201).json(membership);
//   }

//   static async getAll(req: Request, res: Response) {
//     const memberships = await MembershipService.getAllMemberships();
//     res.json(memberships);
//   }

//   static async getById(req: Request, res: Response) {
//     const { id } = req.params;
//     const membership = await MembershipService.getMembershipById(id);
//     if (!membership){
//         res.status(404).json({ message: "Not found" });
//     } else{
//       res.json(membership);
//     }
//   }

//   static async update(req: Request, res: Response) {
//     const { id } = req.params;
//     const data = req.body;
//     const membership = await MembershipService.updateMembership(id, data);
//     res.json(membership);
//   }

//   static async delete(req: Request, res: Response) {
//     const { id } = req.params;
//     await MembershipService.deleteMembership(id);
//     res.json({ message: "Deleted successfully" });
//   }
// }
// import { Request, Response, RequestHandler } from "express";
// import { MembershipService } from "../services/membership.service";
// import { handleErrorResponse } from "../utils/handleErrorResponse";

// export class MembershipController {
//   static create: RequestHandler = async (req: Request, res: Response) => {
//     try {
//       const data = req.body;
//       const gymId = req.user?.gymId; // Get gymId from authenticated user
//       if (!gymId) {
//         throw new Error("Gym ID is required");
//       }
//       const membership = await MembershipService.createMembership({ ...data, gymId });
//       res.status(201).json(membership);
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   }

//   static getAll: RequestHandler = async (req: Request, res: Response) => {
//     try {
//       const gymId = req.user?.gymId;
//       if (!gymId) {
//         throw new Error("Gym ID is required");
//       }
//       const memberships = await MembershipService.getAllMembershipsOfBranch(gymId);
//       res.json(memberships);
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   }

//   static getById: RequestHandler = async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;
//       const gymId = req.user?.gymId;
//       if (!gymId) {
//         throw new Error("Gym ID is required");
//       }
//       const membership = await MembershipService.getMembershipOfBranchById(id, gymId);

//       if (!membership) {
//         res.status(404).json({
//           message: "Membership not found",
//           code: "MEMBERSHIP_NOT_FOUND",
//         });
//         return;
//       }

//       res.json(membership);
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   }

//   static update: RequestHandler = async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;
//       const data = req.body;
//       const gymId = req.user?.gymId;
//       if (!gymId) {
//         throw new Error("Gym ID is required");
//       }
//       const membership = await MembershipService.updateMembershipofBranch(id, data, gymId);
//       res.json(membership);
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   }

//   static delete: RequestHandler = async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;
//       const gymId = req.user?.gymId;
//       if (!gymId) {
//         throw new Error("Gym ID is required");
//       }
//       await MembershipService.deleteMembershipOfBranch(id, gymId);
//       res.json({ message: "Membership deleted successfully" });
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   }
// }

// import { Request, Response, RequestHandler } from "express";
// import { MembershipService } from "../services/membership.service";
// import { handleErrorResponse } from "../utils/handleErrorResponse";

// export class MembershipController {
//   static create: RequestHandler = async (req: Request, res: Response) => {
//     try {
//       const data = req.body;
//       const membership = await MembershipService.createMembership(data);
//       res.status(201).json(membership);
//     } catch (err) {
//      handleErrorResponse(res, err);
//     }
//   }

//   static getAll: RequestHandler = async (req: Request, res: Response) => {
//     try {
//       const memberships = await MembershipService.getAllMemberships();
//       res.json(memberships);
//     } catch (err) {
//        handleErrorResponse(res, err);
//     }
//   }

//   static getById: RequestHandler = async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;
//       const membership = await MembershipService.getMembershipById(id);

//       if (!membership) {
//         res.status(404).json({
//           message: "Membership not found",
//           code: "MEMBERSHIP_NOT_FOUND",
//         });
//         return;
//       }

//       res.json(membership);
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   }

//   static update: RequestHandler = async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;
//       const data = req.body;
//       const membership = await MembershipService.updateMembership(id, data);
//       res.json(membership);
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   }

//   static delete: RequestHandler = async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params;
//       await MembershipService.deleteMembership(id);
//       res.json({ message: "Deleted successfully" });
//     } catch (err) {
//       handleErrorResponse(res, err);
//     }
//   }
// }

import { Request, Response, RequestHandler } from "express";
import { MembershipService } from "../services/membership.service";
import { handleErrorResponse } from "../utils/handleErrorResponse";

export class MembershipController {
  static create: RequestHandler = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const { gymId } = req.user!; // Get both gymId and branchId from authenticated user

      if (!gymId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      
      const membership = await MembershipService.createMembership({
        ...data,
        gymId
      });
      console.log(membership, "membership123")
      res.status(201).json(membership);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };

  static getAll: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { gymId } = req.user!;
      if (!gymId) {
        throw new Error("Gym ID is required");
      }
      // If using query parameter approach
      const gymBranchId = req.query.gymBranchId as string;

      const memberships = await MembershipService.getMemberships(
        gymId,
        gymBranchId
      );
      res.json(memberships);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };

  static getById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const membership = await MembershipService.getMembershipById(
        id,
        gymId,
        gymBranchId
      );

      if (!membership) {
        res.status(404).json({
          message: "Membership not found",
          code: "MEMBERSHIP_NOT_FOUND",
        });
        return;
      }

      res.json(membership);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };

  static update: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      const membership = await MembershipService.updateMembership(
        id,
        data,
        gymId,
        gymBranchId
      );
      res.json(membership);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };

  static delete: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const gymBranchId = req.query.gymBranchId as string;

      const { gymId } = req.user!;

      if (!gymId || !gymBranchId) {
        throw new Error("Gym ID and Branch ID are required");
      }

      await MembershipService.deleteMembership(id, gymId, gymBranchId);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  };
}
