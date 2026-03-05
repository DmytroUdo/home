import { Router } from 'express';
import { body, query } from 'express-validator';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', userController.getProfile);
router.put(
  '/profile',
  [
    body('name').optional().isString().withMessage('Name must be a string'),
    body('oldPassword').optional().isString().withMessage('Old password must be a string'),
    body('newPassword').optional().isString().isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  ],
  validate,
  userController.updateProfile
);

// Dashboard routes
router.get('/dashboard', userController.getDashboard);

// History routes
router.get(
  '/history',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  validate,
  userController.getHistory
);

// Payment routes
router.get(
  '/payments',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  validate,
  userController.getPayments
);

export default router;
