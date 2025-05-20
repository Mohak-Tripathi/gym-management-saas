import { MaintenanceScheduleDatabase } from "../database/maintenanceSchedule.database";
import { AppError } from "../utils/AppError";

export class MaintenanceScheduleService {
  static async create(data: any) {
    try {
      return await MaintenanceScheduleDatabase.create(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error creating maintenance schedule",
        500,
        "MAINTENANCE_SCHEDULE_SERVICE_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string, gymBranchId: string) {
    try {
      return await MaintenanceScheduleDatabase.getAll(gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error fetching maintenance schedules",
        500,
        "MAINTENANCE_SCHEDULE_SERVICE_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string, gymBranchId: string) {
    try {
      const schedule = await MaintenanceScheduleDatabase.getById(id, gymId, gymBranchId);
      if (!schedule) {
        throw new AppError(
          "Maintenance schedule not found",
          404,
          "MAINTENANCE_SCHEDULE_NOT_FOUND"
        );
      }
      return schedule;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error fetching maintenance schedule with ID: ${id}`,
        500,
        "MAINTENANCE_SCHEDULE_SERVICE_FETCH_BY_ID_ERROR"
      );
    }
  }

  static async update(id: string, data: any, gymId: string, gymBranchId: string) {
    try {
      const schedule = await MaintenanceScheduleDatabase.getById(id, gymId, gymBranchId);
      if (!schedule) {
        throw new AppError(
          "Maintenance schedule not found",
          404,
          "MAINTENANCE_SCHEDULE_NOT_FOUND"
        );
      }
      return await MaintenanceScheduleDatabase.update(id, { ...data, gymId, gymBranchId });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error updating maintenance schedule with ID: ${id}`,
        500,
        "MAINTENANCE_SCHEDULE_SERVICE_UPDATE_ERROR"
      );
    }
  }

  static async delete(id: string, gymId: string, gymBranchId: string) {
    try {
      const schedule = await MaintenanceScheduleDatabase.getById(id, gymId, gymBranchId);
      if (!schedule) {
        throw new AppError(
          "Maintenance schedule not found",
          404,
          "MAINTENANCE_SCHEDULE_NOT_FOUND"
        );
      }
      return await MaintenanceScheduleDatabase.delete(id, gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error deleting maintenance schedule with ID: ${id}`,
        500,
        "MAINTENANCE_SCHEDULE_SERVICE_DELETE_ERROR"
      );
    }
  }

  static async getByEquipmentId(equipmentId: string, gymId: string, gymBranchId: string) {
    try {
      return await MaintenanceScheduleDatabase.getByEquipmentId(equipmentId, gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Error fetching maintenance schedules for equipment ID: ${equipmentId}`,
        500,
        "MAINTENANCE_SCHEDULE_SERVICE_FETCH_BY_EQUIPMENT_ERROR"
      );
    }
  }

  static async getUpcoming(gymId: string, gymBranchId: string) {
    try {
      return await MaintenanceScheduleDatabase.getUpcoming(gymId, gymBranchId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error fetching upcoming maintenance schedules",
        500,
        "MAINTENANCE_SCHEDULE_SERVICE_FETCH_UPCOMING_ERROR"
      );
    }
  }
}