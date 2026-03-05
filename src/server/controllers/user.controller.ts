import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as userService from '../services/user.service';
import * as dashboardService from '../services/dashboard.service';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const profile = await userService.getUserProfile(userId);
    res.json({ success: true, data: profile, message: 'Profile retrieved successfully' });
  } catch (error: any) {
    res.status(404).json({ success: false, data: null, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, oldPassword, newPassword } = req.body;
    const updatedUser = await userService.updateProfile(userId, name, oldPassword, newPassword);
    res.json({ success: true, data: updatedUser, message: 'Profile updated successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, data: null, message: error.message });
  }
};

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const dashboardData = await dashboardService.getDashboardData(userId);
    res.json({ success: true, data: dashboardData, message: 'Dashboard data retrieved successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, data: null, message: 'Failed to retrieve dashboard data' });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const history = await dashboardService.getUsageHistory(userId, page, limit);
    res.json({ success: true, data: history, message: 'Usage history retrieved successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, data: null, message: 'Failed to retrieve usage history' });
  }
};

export const getPayments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const payments = await dashboardService.getPaymentHistory(userId, page, limit);
    res.json({ success: true, data: payments, message: 'Payment history retrieved successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, data: null, message: 'Failed to retrieve payment history' });
  }
};
