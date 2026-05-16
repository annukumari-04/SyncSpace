import express from 'express';
import {
  createProject,
  getProjects,
  deleteProject,
  getMyProjects,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Publicly available to authenticated users (with specific handlers)
router.route('/my-projects').get(protect, getMyProjects);

// Admin only routes
router
  .route('/')
  .post(protect, adminOnly, createProject)
  .get(protect, adminOnly, getProjects);

router
  .route('/:id')
  .delete(protect, adminOnly, deleteProject);

export default router;
