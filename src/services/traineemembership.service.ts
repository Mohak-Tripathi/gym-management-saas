import { TraineeMembershipDatabase } from "../database/traineemembership.database";
import { AppError } from "../utils/AppError";

export class TraineeMembershipService {
//   static async createTraineeMembership(data: any) {
//     try {
//       return await TraineeMembershipDatabase.create(data);
//     } catch (error) {
//       if (error instanceof AppError) {
//         throw error;
//       }
//       throw new AppError(
//         "Service error while creating trainee membership",
//         500,
//         "TRAINEE_MEMBERSHIP_SERVICE_CREATE_ERROR"
//       );
//     }
//   }

  static async getAllTraineeMemberships() {
    try {
      return await TraineeMembershipDatabase.getAll();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Service error while fetching all trainee memberships",
        500,
        "TRAINEE_MEMBERSHIP_SERVICE_GET_ALL_ERROR"
      );
    }
  }

  static async getTraineeMembershipById(id: string) {
    try {
      return await TraineeMembershipDatabase.getById(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error while fetching trainee membership with ID: ${id}`,
        500,
        "TRAINEE_MEMBERSHIP_SERVICE_GET_BY_ID_ERROR"
      );
    }
  }

  static async updateTraineeMembership(id: string, data: unknown) {
    try {
      return await TraineeMembershipDatabase.update(id, data);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error while updating trainee membership with ID: ${id}`,
        500,
        "TRAINEE_MEMBERSHIP_SERVICE_UPDATE_ERROR"
      );
    }
  }

  static async deleteTraineeMembership(id: string) {
    try {
      return await TraineeMembershipDatabase.delete(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Service error while deleting trainee membership with ID: ${id}`,
        500,
        "TRAINEE_MEMBERSHIP_SERVICE_DELETE_ERROR"
      );
    }
  }
}
