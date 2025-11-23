import prisma from '../config/prisma.js';

export const NotificationModel = {
  async create(notificationData) {
    return await prisma.notification.create({
      data: {
        userId: notificationData.userId,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        priority: notificationData.priority,
        meta: notificationData.meta || {},
      },
    });
  },

  async findByUserId(userId, filters = {}) {
    const where = {
      userId,
    };

    if (filters.isRead !== undefined) {
      where.isRead = filters.isRead;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    return await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: filters.limit,
    });
  },

  async findById(id) {
    const notificationId = parseInt(id, 10);
    if (isNaN(notificationId)) {
      return null;
    }

    return await prisma.notification.findUnique({
      where: { id: notificationId },
    });
  },

  async markAsRead(id, userId) {
    try {
      const notificationId = parseInt(id, 10);
      if (isNaN(notificationId)) {
        return null;
      }

      const notification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId,
        },
      });

      if (!notification) {
        return null;
      }

      return await prisma.notification.update({
        where: { id: notificationId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });
    } catch (error) {
      return null;
    }
  },

  async getUnreadCount(userId) {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  },

  async delete(id) {
    const notificationId = parseInt(id, 10);
    if (isNaN(notificationId)) {
      throw new Error('Invalid notification ID');
    }

    return await prisma.notification.delete({
      where: { id: notificationId },
      select: {
        id: true,
      },
    });
  },
};
