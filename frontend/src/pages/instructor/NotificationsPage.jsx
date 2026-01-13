import { useEffect, useState, useRef } from 'react';
import Layout from '../../components/Layout';
import { notificationApi } from '../../api/notificationApi';
import { format } from 'date-fns';
import { useToast } from '../../components/Toast';
import { FiBell, FiCheck, FiAlertCircle, FiInfo, FiClock } from 'react-icons/fi';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const buttonRefs = useRef({});

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter === 'unread') params.isRead = 'false';
      if (filter === 'read') params.isRead = 'true';

      const response = await notificationApi.getAll(params);
      setNotifications(response?.data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      toast.success('Notification marked as read');
      fetchNotifications();
      window.dispatchEvent(new CustomEvent('notificationRead'));
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'MEDIUM':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'LOW':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
  };

  const getButtonPosition = (index) => {
    const button = buttonRefs.current[`button-${index}`];
    if (!button) {
      if (index === 0) return 'bottom';
      if (index === notifications.length - 1) return 'above';
      return 'bottom';
    }
    
    const rect = button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const buttonHeight = 50;
    
    if (spaceBelow < buttonHeight + 10 && spaceAbove > buttonHeight + 10) {
      return 'above';
    }
    return 'bottom';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <FiBell className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Stay updated with your alerts and reminders</p>
              </div>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300 text-sm"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {(notifications || []).map((notification, index) => {
            const isLastItem = index === notifications.length - 1;
            const isFirstItem = index === 0;
            
            let position = 'bottom';
            if (isFirstItem) {
              position = 'bottom';
            } else if (isLastItem) {
              position = 'above';
            } else {
              position = getButtonPosition(index);
            }
            
            return (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-l-4 transition-all duration-200 hover:shadow-md ${
                  notification.isRead 
                    ? 'border-gray-300 dark:border-gray-600 opacity-75' 
                    : 'border-blue-500 dark:border-blue-400 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{notification.title}</h3>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(
                          notification.priority
                        )}`}
                      >
                        {notification.priority}
                      </span>
                      {!notification.isRead && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500 dark:bg-blue-600 text-white animate-pulse flex items-center space-x-1">
                          <FiBell className="text-xs" />
                          <span>New</span>
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 mb-3 leading-relaxed">{notification.message}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                      <FiClock className="text-xs" />
                      <span>
                        {notification.createdAt
                          ? format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')
                          : 'Date not available'}
                      </span>
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div 
                      className="relative ml-4"
                      ref={(el) => {
                        if (el) {
                          buttonRefs.current[`button-${index}`] = el;
                        }
                      }}
                    >
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 whitespace-nowrap ${
                          position === 'above' ? 'absolute bottom-full mb-2 right-0' : ''
                        }`}
                      >
                        <FiCheck />
                        <span>Mark as Read</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {notifications.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBell className="text-4xl text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">No notifications found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
