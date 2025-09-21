import express from 'express';
import {
  checkRateLimit,
  createResearchTask,
  getAllResearchTasks,
  getResearchTaskById
} from '../controller/controller';

const router = express.Router();

router.get('/check', checkRateLimit);
router.post('/research', createResearchTask);
router.get('/research', getAllResearchTasks);
router.get('/research/:id', getResearchTaskById);

export default router;