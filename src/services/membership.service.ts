
// import { MembershipDatabase } from "../database/membership.database";
// import { AppError } from "../utils/AppError";

// export class MembershipService {
//   static async createMembership(data: any) {
//     try {
//       return await MembershipDatabase.create(data);
//     } catch (error) {
//       if (error instanceof AppError) {
//         throw error;
//       }
//       throw new AppError(
//         "Service error while creating membership",
//         500,
//         "MEMBERSHIP_SERVICE_CREATE_ERROR"
//       );
//     }
//   }


//   static async getMemberships(gymId: string, branchId: string,  user:any) {
//     try {
//       return await MembershipDatabase.getAll(gymId, branchId);
//     } catch (error) {
//       if (error instanceof AppError) {
//         throw error;
//       }
//       throw new AppError(
//         "Service error while fetching all memberships",
//         500,
//         "MEMBERSHIP_SERVICE_GET_ALL_ERROR"
//       );
//     }
//   }

//   static async getMembershipById(id: string, gymId: string) {
//     try {
//       return await MembershipDatabase.getById(id, gymId);
//     } catch (error) {
//       if (error instanceof AppError) {
//         throw error;
//       }
//       throw new AppError(
//         `Service error while fetching membership with ID: ${id}`,
//         500,
//         "MEMBERSHIP_SERVICE_GET_BY_ID_ERROR"
//       );
//     }
//   }

//   static async updateMembership(id: string, data: any, gymId: string) {
//     try {
//       return await MembershipDatabase.update(id, { ...data, gymId });
//     } catch (error) {
//       if (error instanceof AppError) {
//         throw error;
//       }
//       throw new AppError(
//         `Service error while updating membership with ID: ${id}`,
//         500,
//         "MEMBERSHIP_SERVICE_UPDATE_ERROR"
//       );
//     }
//   }

//   static async deleteMembership(id: string, gymId: string) {
//     try {
//       return await MembershipDatabase.delete(id, gymId);
//     } catch (error) {
//       if (error instanceof AppError) {
//         throw error;
//       }
//       throw new AppError(
//         `Service error while deleting membership with ID: ${id}`,
//         500,
//         "MEMBERSHIP_SERVICE_DELETE_ERROR"
//       );
//     }
//   }
// }

// import { MembershipDatabase } from "../database/membership.database";
// import { AppError } from "../utils/AppError";

// export class MembershipService {
//   static async createMembership(data: any) {
//     try {
//       return await MembershipDatabase.create(data);
//     } catch (error) {
//          // Re-throw database or other lower-level AppErrors
//       if (error instanceof AppError) {
//         throw error;
//       }
//       // Create new service-specific error for unknown errors
//       throw new AppError(
//         "Service error while creating membership",
//         500,
//         "MEMBERSHIP_SERVICE_CREATE_ERROR"
//       );
//     }
//   }

//   static async getAllMemberships() {
//     try {
//       return await MembershipDatabase.getAll();
//     } catch (error) {
//                  // Re-throw database or other lower-level AppErrors
//       if (error instanceof AppError) {
//         throw error;
//       }
//        // Create new service-specific error for unknown errors
//       throw new AppError(
//         "Service error while fetching all memberships",
//         500,
//         "MEMBERSHIP_SERVICE_GET_ALL_ERROR"
//       );
//     }
//   }

//   static async getMembershipById(id: string) {
//     try {
//       return await MembershipDatabase.getById(id);
//     } catch (error) {
//       if (error instanceof AppError) {
//         throw error;
//       }
//       throw new AppError(
//         `Service error while fetching membership with ID: ${id}`,
//         500,
//         "MEMBERSHIP_SERVICE_GET_BY_ID_ERROR"
//       );
//     }
//   }

//   static async updateMembership(id: string, data: unknown) {
//     try {
//       return await MembershipDatabase.update(id, data);
//     } catch (error) {
//       if (error instanceof AppError) {
//         throw error;
//       }
//       throw new AppError(
//         `Service error while updating membership with ID: ${id}`,
//         500,
//         "MEMBERSHIP_SERVICE_UPDATE_ERROR"
//       );
//     }
//   }

//   static async deleteMembership(id: string) {
//     try {
//       return await MembershipDatabase.delete(id);
//     } catch (error) {
//       if (error instanceof AppError) {
//         throw error;
//       }
//       throw new AppError(
//         `Service error while deleting membership with ID: ${id}`,
//         500,
//         "MEMBERSHIP_SERVICE_DELETE_ERROR"
//       );
//     }
//   }
// }



// membership.service.ts

import { MembershipDatabase } from "../database/membership.database";
import { AppError } from "../utils/AppError";

export class MembershipService {
  static async createMembership(data: any) {
    try {
      return await MembershipDatabase.create(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Service error while creating membership",
        500,
        "MEMBERSHIP_SERVICE_CREATE_ERROR"
      );
    }
  }

  static async getMemberships(gymId: string, branchId: string) {
    try {
      return await MembershipDatabase.getAll(gymId, branchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Service error while fetching all memberships",
        500,
        "MEMBERSHIP_SERVICE_GET_ALL_ERROR"
      );
    }
  }

  static async getMembershipById(id: string, gymId: string, branchId: string) {
    try {
      return await MembershipDatabase.getById(id, gymId, branchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Service error while fetching membership with ID: ${id}`,
        500,
        "MEMBERSHIP_SERVICE_GET_BY_ID_ERROR"
      );
    }
    
  }

  static async updateMembership(id: string, data: any, gymId: string, branchId: string) {
    try {
      return await MembershipDatabase.update(id, { ...data, gymId, gymBranchId: branchId });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Service error while updating membership with ID: ${id}`,
        500,
        "MEMBERSHIP_SERVICE_UPDATE_ERROR"
      );
    }
  }

  static async deleteMembership(id: string, gymId: string, branchId: string) {
    try {
      return await MembershipDatabase.delete(id, gymId, branchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Service error while deleting membership with ID: ${id}`,
        500,
        "MEMBERSHIP_SERVICE_DELETE_ERROR"
      );
    }
  }
}
