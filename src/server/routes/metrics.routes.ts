import { Router } from 'express';
import * as metricsController from '../controllers/metrics.controller';
import { authenticate, authorizeRole } from '../middlewares/auth.middleware';

const router = Router();

// Only ADMIN can access metrics
router.use(authenticate);
router.use(authorizeRole(['ADMIN']));

router.get('/', metricsController.getMetrics);

export default router;
