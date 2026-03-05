import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authLimiter } from '../middlewares/rate-limit.middleware';

const router = Router();

// Apply rate limiting to all auth routes
router.use(authLimiter);

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

router.post('/refresh-token', authController.refreshToken);

router.get('/verify-email', authController.verifyEmail);

router.post(
  '/request-password-reset',
  [body('email').isEmail().withMessage('Valid email is required')],
  validate,
  authController.requestPasswordReset
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  validate,
  authController.resetPassword
);

export default router;
