import { NotificationModel } from '../models/NotificationModel.js';
import { ActivityModel } from '../models/ActivityModel.js';
import { SettingModel } from '../models/SettingModel.js';

export const NotificationService = {
  async createNotification(notificationData) {
    const notification = await NotificationModel.create(notificationData);
    return {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      isRead: notification.isRead,
      meta: typeof notification.meta === 'string' ? JSON.parse(notification.meta) : notification.meta,
      createdAt: notification.createdAt,
    };
  },

  async getNotificationsForUser(userId, filters = {}) {
    const notifications = await NotificationModel.findByUserId(userId, filters);
    return notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      isRead: notification.isRead,
      meta: typeof notification.meta === 'string' ? JSON.parse(notification.meta) : notification.meta,
      createdAt: notification.createdAt ? notification.createdAt.toISOString() : null,
      readAt: notification.readAt ? notification.readAt.toISOString() : null,
    }));
  },

  async markAsRead(notificationId, userId) {
    const notification = await NotificationModel.markAsRead(notificationId, userId);
    if (!notification) {
      throw new Error('Notification not found or unauthorized');
    }
    return {
      id: notification.id,
      isRead: notification.isRead,
      readAt: notification.readAt ? notification.readAt.toISOString() : null,
    };
  },

  async getUnreadCount(userId) {
    return await NotificationModel.getUnreadCount(userId);
  },

  async checkAndCreateNotifications(userId) {
    // Get reminder days setting
    const reminderSetting = await SettingModel.findByKey('REMINDER_DAYS_BEFORE_DEADLINE');
    const reminderDays = reminderSetting ? parseInt(reminderSetting.value) : 2;

    // Get pending activities
    const pendingActivities = await ActivityModel.findByInstructor(userId, {
      status: 'PENDING',
    });

    const notifications = [];

    for (const activity of pendingActivities) {
      const activityDate = new Date(activity.activity_date);
      const today = new Date();
      const daysDiff = Math.ceil((activityDate - today) / (1000 * 60 * 60 * 24));

      if (daysDiff <= reminderDays && daysDiff >= 0) {
        // Check if notification already exists
        const existingNotifications = await NotificationModel.findByUserId(userId, {
          isRead: false,
        });

        const alreadyNotified = existingNotifications.some(
          (n) => n.meta?.activity_id === activity.id
        );

        if (!alreadyNotified) {
          const notification = await this.createNotification({
            userId,
            title: 'Pending Activity Reminder',
            message: `You have a pending activity: ${activity.title}. Deadline: ${activity.activity_date}`,
            type: 'REMINDER',
            priority: daysDiff <= 1 ? 'HIGH' : 'MEDIUM',
            meta: { activity_id: activity.id },
          });
          notifications.push(notification);
        }
      }
    }

    return notifications;
  },
};

