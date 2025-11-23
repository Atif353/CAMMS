import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';

/**
 * NAVBAR COMPONENT
 * 
 * Enhanced with dark mode support for viva demonstration
 * 
 * Key features to explain:
 * 1. Responsive design (mobile-friendly)
 * 2. Dark mode toggle integration
 * 3. Role-based navigation (Admin vs Instructor)
 * 4. Smooth hover effects
 */
const Navbar = () => {
  const { user, logout, isAdmin, isInstructor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 dark:bg-gray-800 shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to={isAdmin ? '/admin/dashboard' : '/instructor/dashboard'} className="flex items-center">
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">CAMMS</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/reports"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Reports
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Settings
                  </Link>
                </>
              )}
              {isInstructor && (
                <>
                  <Link
                    to="/instructor/dashboard"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/instructor/log-activity"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Log Activity
                  </Link>
                  <Link
                    to="/instructor/activities"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Activities
                  </Link>
                  <Link
                    to="/instructor/reports"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Reports
                  </Link>
                  <Link
                    to="/instructor/notifications"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Notifications
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle - Easy to demo in viva */}
            <DarkModeToggle />
            
            <span className="text-sm text-gray-700 dark:text-gray-200 dark:text-gray-300">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-danger-500 hover:bg-danger-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


