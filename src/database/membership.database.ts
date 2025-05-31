
import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export class MembershipDatabase {
  static async create(data: any) {
    console.log(data, "data890")
    try {
      if (!data.gymId || !data.gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MEMBERSHIP_DB_GYM_BRANCH_ID_REQUIRED"
        );
      }
      return await prisma.membership.create({ data });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error creating membership",
        500,
        "MEMBERSHIP_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string, branchId: string) {
    try {
      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MEMBERSHIP_DB_GYM_BRANCH_ID_REQUIRED"
        );
      }
      return await prisma.membership.findMany({
        where: { 
          gymId,
          gymBranchId:branchId
        },
        orderBy: {
          createdAt: 'asc'  // Older first, newest last
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error fetching memberships",
        500,
        "MEMBERSHIP_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string, branchId: string) {
    try {
      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MEMBERSHIP_DB_GYM_BRANCH_ID_REQUIRED"
        );
      }
      return await prisma.membership.findFirst({
        where: { 
          id,
          gymId,
          gymBranchId:branchId
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Error fetching membership with ID: ${id}`,
        500,
        "MEMBERSHIP_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
      if (!data.gymId || !data.gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MEMBERSHIP_DB_GYM_BRANCH_ID_REQUIRED"
        );
      }
      return await prisma.membership.update({
        where: { 
          id,
          gymId: data.gymId,
          gymBranchId:data.gymBranchId
 
        },
        data
      });
    } catch (error) {
      console.log(error, "update error")
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Error updating membership with ID: ${id}`,
        500,
        "MEMBERSHIP_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string, gymId: string, branchId: string) {
    try {
      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MEMBERSHIP_DB_GYM_BRANCH_ID_REQUIRED"
        );
      }
      return await prisma.membership.delete({
        where: { 
          id,
          gymId,
          gymBranchId: branchId
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Error deleting membership with ID: ${id}`,
        500,
        "MEMBERSHIP_DB_DELETE_ERROR"
      );
    }
  }
}

// import { PrismaClient } from '@prisma/client';
// import { AppError } from '../utils/AppError';

// const prisma = new PrismaClient();

// export class MembershipDatabase {
//   static async create(data: any) {
//     try {
//       if (!data.gymId) {
//         throw new AppError(
//           "Gym ID is required",
//           400,
//           "MEMBERSHIP_DB_GYM_ID_REQUIRED"
//         );
//       }
//       return await prisma.membership.create({ data });
//     } catch (error) {
//       if (error instanceof AppError) {
//         throw error;
//       }
//       throw new AppError(
//         "Error creating membership",
//         500,
//         "MEMBERSHIP_DB_CREATE_ERROR"
//       );
//     }
//   }

//   static async getAll(gymId: string) {
//     try {
//       if (!gymId) {
//         throw new AppError(
//           "Gym ID is required",
//           400,
//           "MEMBERSHIP_DB_GYM_ID_REQUIRED"
//         );
//       }
//       return await prisma.membership.findMany({
//         where: { gymId }
//       });
//     } catch (error) {
//       if (error instanceof AppError) {
//         throw error;
//       }
//       throw new AppError(
//         "Error fetching memberships",
//         500,
//         "MEMBERSHIP_DB_FETCH_ALL_ERROR"
//       );
//     }
//   }

//   static async getById(id: string, gymId: string) {
//     try {
//       if (!gymId) {
//         throw new AppError(
//           "Gym ID is required",
//           400,
//           "MEMBERSHIP_DB_GYM_ID_REQUIRED"
//         );
//       }
//       return await prisma.membership.findFirst({
//         where: { id, gymId }
//       });
//     } catch (error) {
//       if (error instanceof AppError) {
//         throw error;
//       }
//       throw new AppError(
//         `Error fetching membership with ID: ${id}`,
//         500,
//         "MEMBERSHIP_DB_FETCH_BY_ID_ERROR"
//       );
//     }
//   }

//   static async update(id: string, data: any) {
//     try {
//       if (!data.gymId) {
//         throw new AppError(
//           "Gym ID is required",
//           400,
//           "MEMBERSHIP_DB_GYM_ID_REQUIRED"
//         );
//       }
//       return await prisma.membership.update({
//         where: { id, gymId: data.gymId },
//         data
//       });
//     } catch (error) {
//       if (error instanceof AppError) {
//         throw error;
//       }
//       throw new AppError(
//         `Error updating membership with ID: ${id}`,
//         500,
//         "MEMBERSHIP_DB_UPDATE_ERROR"
//       );
//     }
//   }

//   static async delete(id: string, gymId: string) {
//     try {
//       if (!gymId) {
//         throw new AppError(
//           "Gym ID is required",
//           400,
//           "MEMBERSHIP_DB_GYM_ID_REQUIRED"
//         );
//       }
//       return await prisma.membership.delete({
//         where: { id, gymId }
//       });
//     } catch (error) {
//       if (error instanceof AppError) {
//         throw error;
//       }
//       throw new AppError(
//         `Error deleting membership with ID: ${id}`,
//         500,
//         "MEMBERSHIP_DB_DELETE_ERROR"
//       );
//     }
//   }
// }

// import { PrismaClient } from '@prisma/client';
// import { AppError } from '../utils/AppError';

// const prisma = new PrismaClient();

// export class MembershipDatabase {
//   static async create(data: any) {
//     try {
//       return await prisma.membership.create({ data });
//     } catch (error) {
//       throw new AppError(
//         "Error creating membership",
//         500,
//         "MEMBERSHIP_DB_CREATE_ERROR"
//       );
//     }
//   }

//   static async getAll() {
//     try {
//       return await prisma.membership.findMany();
//     } catch (error) {
//       throw new AppError(
//         "Error fetching memberships",
//         500,
//         "MEMBERSHIP_DB_FETCH_ALL_ERROR"
//       );
//     }
//   }

//   static async getById(id: string) {
//     try {
//       return await prisma.membership.findUnique({ where: { id } });
//     } catch (error) {
//       throw new AppError(
//         `Error fetching membership with ID: ${id}`,
//         500,
//         "MEMBERSHIP_DB_FETCH_BY_ID_ERROR"
//       );
//     }
//   }

//   static async update(id: string, data: any) {
//     try {
//       return await prisma.membership.update({ where: { id }, data });
//     } catch (error) {
//       throw new AppError(
//         `Error updating membership with ID: ${id}`,
//         500,
//         "MEMBERSHIP_DB_UPDATE_ERROR"
//       );
//     }
//   }

//   static async delete(id: string) {
//     try {
//       return await prisma.membership.delete({ where: { id } });
//     } catch (error) {
//       throw new AppError(
//         `Error deleting membership with ID: ${id}`,
//         500,
//         "MEMBERSHIP_DB_DELETE_ERROR"
//       );
//     }
//   }
// }
