import express from 'express';
import { getUsers, createUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, adminOnly, getUsers)
  .post(protect, adminOnly, createUser);

export default router;
