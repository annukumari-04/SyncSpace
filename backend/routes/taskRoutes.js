import express from 'express';
import {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, adminOnly, createTask)
  .get(protect, getTasks); // All users can GET tasks, controller handles filtering

router
  .route('/:id')
  .delete(protect, adminOnly, deleteTask);

router
  .route('/:id/status')
  .patch(protect, updateTaskStatus); // Any authenticated user can hit this, controller verifies ownership

export default router;
