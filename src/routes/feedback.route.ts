import { Router } from 'express';
import { FeedbackController } from '../controllers/feedback.controller';


import { authMiddleware} from '../utils/authMiddleware';


const router = Router();

router.use(authMiddleware); 


router.post('/', FeedbackController.create);
router.get('/', FeedbackController.getAll);
router.get('/:id', FeedbackController.getById);
router.put('/:id', FeedbackController.update);
router.delete('/:id', FeedbackController.delete);

export default router;
