import express from 'express';
import {
  createGrievance,
  getGrievanceById,
  getUserGrievances,
  updateGrievanceStatus,
  upvoteGrievance,
  getPublicGrievances
} from '../controllers/grievanceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/public').get(getPublicGrievances);
router.route('/').post(protect, createGrievance);
router.route('/user/:userId').get(protect, getUserGrievances);
router.route('/:id/upvote').put(protect, upvoteGrievance);
router.route('/:id')
  .get(getGrievanceById)
  .put(protect, admin, updateGrievanceStatus);

export default router;
