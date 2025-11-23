import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleSidebarToggle = (event) => {
      setSidebarCollapsed(event.detail.collapsed);
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Sidebar onToggle={setSidebarCollapsed} mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      <main className={`flex-1 transition-all duration-300 p-3 sm:p-4 md:p-6 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} ml-0 pt-12 md:pt-4`}>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden fixed top-3 left-3 z-30 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white p-2.5 rounded-lg shadow-lg transition-colors"
        >
          <FiMenu className="text-xl" />
        </button>
        <div className="w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
