import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

export class MaintenanceScheduleDatabase {
  static async create(data: any) {
    try {
      if (!data.gymId || !data.gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MAINTENANCE_SCHEDULE_GYM_BRANCH_ID_REQUIRED"
        );
      }
      return await prisma.maintenanceSchedule.create({
        data,
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              serialNumber: true,
              status: true
            }
          },
          gym: {
            select: {
              id: true,
              name: true
            }
          },
          gymBranch: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
    } catch (error) {
      console.error("Maintenance Schedule Create Error:", error);
      throw new AppError(
        "Error creating maintenance schedule",
        500,
        "MAINTENANCE_SCHEDULE_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string, gymBranchId: string) {
    try {
      if (!gymId || !gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MAINTENANCE_SCHEDULE_GYM_BRANCH_ID_REQUIRED"
        );
      }

      return await prisma.maintenanceSchedule.findMany({
        where: {
          gymId,
          gymBranchId
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              serialNumber: true,
              status: true
            }
          },
          gym: {
            select: {
              id: true,
              name: true
            }
          },
          gymBranch: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
           nextDueDate: 'asc'
        }
      });
    } catch (error) {
      console.error("Maintenance Schedule Fetch All Error:", error);
      throw new AppError(
        "Error fetching maintenance schedules",
        500,
        "MAINTENANCE_SCHEDULE_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string, gymBranchId: string) {
    try {
      if (!gymId || !gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MAINTENANCE_SCHEDULE_GYM_BRANCH_ID_REQUIRED"
        );
      }

      return await prisma.maintenanceSchedule.findUnique({
        where: {
          id,
          gymId,
          gymBranchId
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              serialNumber: true,
              status: true
            }
          },
          gym: {
            select: {
              id: true,
              name: true
            }
          },
          gymBranch: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
    } catch (error) {
      console.error("Maintenance Schedule Fetch By ID Error:", error);
      throw new AppError(
        `Error fetching maintenance schedule with ID: ${id}`,
        500,
        "MAINTENANCE_SCHEDULE_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any) {
    try {
        if (!data.gymId || !data.gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MAINTENANCE_SCHEDULE_GYM_BRANCH_ID_REQUIRED"
        );
      }

      return await prisma.maintenanceSchedule.update({
        where: {
          id,
          gymId: data.gymId,
          gymBranchId:data.gymBranchId
        },
        data,
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              serialNumber: true,
              status: true
            }
          },
          gym: {
            select: {
              id: true,
              name: true
            }
          },
          gymBranch: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
    } catch (error) {
      console.error("Maintenance Schedule Update Error:", error);
      throw new AppError(
        `Error updating maintenance schedule with ID: ${id}`,
        500,
        "MAINTENANCE_SCHEDULE_DB_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string, gymId: string, gymBranchId: string) {
    try {
      if (!gymId || !gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MAINTENANCE_SCHEDULE_GYM_BRANCH_ID_REQUIRED"
        );
      }

      return await prisma.maintenanceSchedule.delete({
        where: {
          id,
          gymId,
          gymBranchId
        }
      });
    } catch (error) {
      console.error("Maintenance Schedule Delete Error:", error);
      throw new AppError(
        `Error deleting maintenance schedule with ID: ${id}`,
        500,
        "MAINTENANCE_SCHEDULE_DB_DELETE_ERROR"
      );
    }
  }

  static async getByEquipmentId(equipmentId: string, gymId: string, gymBranchId: string) {
    try {
      if (!gymId || !gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MAINTENANCE_SCHEDULE_GYM_BRANCH_ID_REQUIRED"
        );
      }

      return await prisma.maintenanceSchedule.findMany({
        where: {
          equipmentId,
          gymId,
          gymBranchId
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              serialNumber: true,
              status: true
            }
          },
          gym: {
            select: {
              id: true,
              name: true
            }
          },
          gymBranch: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
           nextDueDate: 'asc'
        }
      });
    } catch (error) {
      console.error("Maintenance Schedule Fetch By Equipment Error:", error);
      throw new AppError(
        `Error fetching maintenance schedules for equipment ID: ${equipmentId}`,
        500,
        "MAINTENANCE_SCHEDULE_DB_FETCH_BY_EQUIPMENT_ERROR"
      );
    }
  }

  static async getUpcoming(gymId: string, gymBranchId: string) {
    try {
      if (!gymId || !gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "MAINTENANCE_SCHEDULE_GYM_BRANCH_ID_REQUIRED"
        );
      }


      const currentDate = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(currentDate.getDate() + 7);

      const upcomingSchedules = await prisma.maintenanceSchedule.findMany({
        where: {
          gymId,
          gymBranchId,
        //   nextDueDate: {
        //     gte: currentDate
        //   }
          nextDueDate: {
            gte: currentDate,
            lte: sevenDaysFromNow
          }
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              serialNumber: true,
              status: true
            }
          },
          gym: {
            select: {
              id: true,
              name: true
            }
          },
          gymBranch: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
           nextDueDate: 'asc'
        }
      });

       // Return empty array if no results found
       return upcomingSchedules;
    } catch (error) {
      console.error("Maintenance Schedule Fetch Upcoming Error:", error);
      throw new AppError(
        "Error fetching upcoming maintenance schedules",
        500,
        "MAINTENANCE_SCHEDULE_DB_FETCH_UPCOMING_ERROR"
      );
    }
  }
}