import { GymDatabase } from '../database/gym.database';
import { AppError } from '../utils/AppError';

class GymService {
  static async createGym(data: any) {
    try {
      return await GymDatabase.create(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating gym', 500, 'GYM_SERVICE_CREATE_ERROR');
    }
  }

  static async getAllGyms() {
    try {
      return await GymDatabase.getAll();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching gyms', 500, 'GYM_SERVICE_FETCH_ALL_ERROR');
    }
  }

  static async getGymById(id: string) {
    try {
      const gym = await GymDatabase.getById(id);
      if (!gym) {
        throw new AppError('Gym not found', 404, 'GYM_NOT_FOUND');
      }
      return gym;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error fetching gym with ID: ${id}`, 500, 'GYM_SERVICE_FETCH_BY_ID_ERROR');
    }
  }

  static async updateGym(id: string, data: any) {
    try {
      const gym = await GymDatabase.getById(id);
      if (!gym) {
        throw new AppError('Gym not found', 404, 'GYM_NOT_FOUND');
      }
      return await GymDatabase.update(id, data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error updating gym with ID: ${id}`, 500, 'GYM_SERVICE_UPDATE_ERROR');
    }
  }

  static async deleteGym(id: string) {
    try {
      const gym = await GymDatabase.getById(id);
      if (!gym) {
        throw new AppError('Gym not found', 404, 'GYM_NOT_FOUND');
      }
      return await GymDatabase.delete(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error deleting gym with ID: ${id}`, 500, 'GYM_SERVICE_DELETE_ERROR');
    }
  }
}

export default GymService;
