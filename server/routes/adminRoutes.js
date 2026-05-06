import express from 'express';
import { getAllGrievances } from '../controllers/grievanceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/all').get(protect, admin, getAllGrievances);

export default router;
