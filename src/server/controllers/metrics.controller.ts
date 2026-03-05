import { Request, Response } from 'express';
import * as metricsService from '../services/metrics.service';

export const getMetrics = async (_req: Request, res: Response) => {
  try {
    const metrics = await metricsService.getMetrics();
    res.json({ success: true, data: metrics, message: 'Metrics retrieved successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, data: null, message: 'Failed to retrieve metrics' });
  }
};
