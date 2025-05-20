import { Router } from 'express';
import { MaintenanceScheduleController } from '../controllers/maintenanceSchedule.controller';
import { authMiddleware, authorize } from '../utils/authMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// UseLess Route  (Not Using)
router.get('/equipment/:equipmentId', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), MaintenanceScheduleController.getByEquipmentId);

// Get upcoming maintenance schedules
router.get('/upcoming', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), MaintenanceScheduleController.getUpcoming);

// Create a new maintenance schedule
router.post('/', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), MaintenanceScheduleController.create);
// Get all maintenance schedules
router.get('/', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), MaintenanceScheduleController.getAll);
// Get maintenance schedule by ID
router.get('/:id', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), MaintenanceScheduleController.getById);

// Update maintenance schedule
router.put('/:id', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), MaintenanceScheduleController.update);

// Delete maintenance schedule
router.delete('/:id', authorize(UserRole.SUPERADMIN, UserRole.ADMIN), MaintenanceScheduleController.delete);



export default router;