import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import * as subscriptionService from '../services/subscription.service';
import { authenticate, AuthRequest } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

router.use(authenticate);

router.post(
  '/create',
  [
    body('plan').isIn(['PRO_MONTHLY', 'PRO_ANNUAL', 'ENTERPRISE_MONTHLY', 'ENTERPRISE_ANNUAL']).withMessage('Invalid plan'),
    body('paymentMethodId').isString().notEmpty().withMessage('Payment method ID is required'),
  ],
  validate,
  async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const { plan, paymentMethodId } = req.body;
      const result = await subscriptionService.createSubscription(authReq.user!.id, plan, paymentMethodId);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

router.post('/cancel', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const result = await subscriptionService.cancelSubscription(authReq.user!.id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/reactivate', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const result = await subscriptionService.reactivateSubscription(authReq.user!.id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/status', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const status = await subscriptionService.getSubscriptionStatus(authReq.user!.id);
    res.json({ success: true, data: status });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
