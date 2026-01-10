import { DashboardService } from '../services/DashboardService.js';
import { NotificationService } from '../services/NotificationService.js';

export const DashboardController = {
  async getInstructorDashboard(req, res, next) {
    try {
      await NotificationService.checkAndCreateNotifications(req.user.id);

      const dateRange = req.query.dateRange || 'weekly';
      const dashboard = await DashboardService.getInstructorDashboard(req.user.id, dateRange);
      res.status(200).json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAdminDashboard(req, res, next) {
    try {
      const dateRange = req.query.dateRange || 'weekly';
      const dashboard = await DashboardService.getAdminDashboard(dateRange);
      res.status(200).json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      next(error);
    }
  },
};

