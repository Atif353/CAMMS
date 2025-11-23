import httpClient from './httpClient';

export const notificationApi = {
  getAll: (params) => httpClient.get('/notifications', { params }),
  getUnreadCount: () => httpClient.get('/notifications/unread-count'),
  markAsRead: (id) => httpClient.patch(`/notifications/${id}/read`),
};

