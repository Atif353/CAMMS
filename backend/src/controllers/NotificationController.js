import { NotificationService } from '../services/NotificationService.js';

export const NotificationController = {
  async getNotifications(req, res, next) {
    try {
      const { isRead, type, limit } = req.query;
      const notifications = await NotificationService.getNotificationsForUser(req.user.id, {
        isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
        type,
        limit: limit ? parseInt(limit) : undefined,
      });
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req, res, next) {
    try {
      const result = await NotificationService.markAsRead(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUnreadCount(req, res, next) {
    try {
      const count = await NotificationService.getUnreadCount(req.user.id);
      res.status(200).json({
        success: true,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  },
};

