import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationApi } from '../api/notificationApi';
import { getProfileImage } from '../utils/profileImage';
import DarkModeToggle from './DarkModeToggle';
import {
  FiLayout,
  FiUsers,
  FiFileText,
  FiSettings,
  FiPlusCircle,
  FiList,
  FiBell,
  FiLogOut,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiActivity,
} from 'react-icons/fi';

const Sidebar = ({ onToggle, mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isInstructor } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    if (isInstructor) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      
      const handleNotificationRead = () => {
        fetchUnreadCount();
      };
      
      window.addEventListener('notificationRead', handleNotificationRead);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('notificationRead', handleNotificationRead);
      };
    }
  }, [isInstructor, location.pathname]);

  useEffect(() => {
    const handleUserUpdate = (event) => {
      if (event.detail) {
        setCurrentUser(event.detail);
        setImageKey(prev => prev + 1);
      }
    };
    
    window.addEventListener('userUpdated', handleUserUpdate);
    return () => window.removeEventListener('userUpdated', handleUserUpdate);
  }, []);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    if (onToggle) {
      onToggle(collapsed);
    }
    window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { collapsed } }));
  }, [collapsed, onToggle]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.data.data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FiLayout },
    { path: '/admin/users', label: 'Manage Users', icon: FiUsers },
    { path: '/admin/activities', label: 'All Activities', icon: FiList },
    { path: '/admin/reports', label: 'Reports', icon: FiFileText },
    { path: '/admin/settings', label: 'Settings', icon: FiSettings },
  ];

  const instructorMenuItems = [
    { path: '/instructor/dashboard', label: 'Dashboard', icon: FiLayout },
    { path: '/instructor/log-activity', label: 'Log Activity', icon: FiPlusCircle },
    { path: '/instructor/activities', label: 'My Activities', icon: FiList },
    { path: '/instructor/reports', label: 'Reports', icon: FiFileText },
    { path: '/instructor/notifications', label: 'Notifications', icon: FiBell },
  ];

  const menuItems = isAdmin ? adminMenuItems : instructorMenuItems;

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        />
      )}
      
      <div className={`
        fixed left-0 top-0 h-full z-50 flex flex-col
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-600 dark:border-gray-700
        shadow-xl
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        
        <div className="relative p-5 border-b border-gray-200 dark:border-gray-600 dark:border-gray-700">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 dark:from-blue-600 dark:via-indigo-600 dark:to-purple-700 flex items-center justify-center shadow-lg flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
              <FiActivity size={24} color="white" />
            </div>
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">CAMMS</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Activity Management</p>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 items-center justify-center rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 dark:border-gray-600 text-gray-600 dark:text-gray-300 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-all"
          >
            {collapsed ? <FiChevronRight size={12} /> : <FiChevronLeft size={12} />}
          </button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isNotifications = item.path === '/instructor/notifications';
              const showBadge = isNotifications && unreadCount > 0;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={`
                    group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${active 
                      ? 'bg-primary-500 dark:bg-primary-600 text-white shadow-md' 
                      : 'text-gray-700 dark:text-gray-200 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <div className="relative flex-shrink-0">
                    <Icon size={20} className={active ? 'text-white' : ''} />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center px-1 bg-danger-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                  
                  {!collapsed && (
                    <span className="font-medium text-sm truncate">{item.label}</span>
                  )}
                  
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-gray-200 dark:border-gray-600 dark:border-gray-700 p-3 space-y-2">
          <div className={`flex ${collapsed ? 'justify-center' : 'justify-between items-center'} px-2 py-2`}>
            {!collapsed && (
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300 dark:text-gray-400">Theme</span>
            )}
            <DarkModeToggle />
          </div>
          
          <Link
            to={isAdmin ? '/admin/profile' : '/instructor/profile'}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="relative flex-shrink-0">
              <img
                src={(() => {
                  const profileUser = currentUser || user;
                  const profileImg = profileUser?.profile_image;
                  if (profileImg) {
                    if (profileImg.startsWith('http')) return profileImg;
                    if (profileImg.startsWith('/assets')) {
                      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                      return `${apiUrl}${profileImg}?v=${imageKey}`;
                    }
                    return `${profileImg}?v=${imageKey}`;
                  }
                  return getProfileImage(profileUser, profileUser?.id);
                })()}
                alt={(currentUser || user)?.name || 'User'}
                className="w-9 h-9 rounded-full object-cover border-2 border-primary-400 dark:border-primary-500"
                key={`sidebar-img-${(currentUser || user)?.id}-${imageKey}`}
                onError={(e) => {
                  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent((currentUser || user)?.name || 'User')}&background=3b82f6&color=ffffff&size=36`;
                  if (!e.target.src.includes('ui-avatars.com')) {
                    e.target.src = fallbackUrl;
                  }
                }}
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success-400 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white dark:text-white truncate">
                  {(currentUser || user)?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {(currentUser || user)?.email}
                </p>
              </div>
            )}
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-danger-500 hover:bg-danger-600 text-white font-medium transition-colors shadow-sm"
          >
            <FiLogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

