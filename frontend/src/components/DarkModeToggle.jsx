import { FiMoon, FiSun } from 'react-icons/fi';
import { useDarkMode } from '../hooks/useDarkMode';

const DarkModeToggle = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="
        relative
        p-2.5
        rounded-xl
        bg-gray-200 dark:bg-gray-700
        hover:bg-gray-300 dark:hover:bg-gray-600
        transition-all duration-300
        group
        focus:outline-none
        focus:ring-2
        focus:ring-primary-500
        focus:ring-offset-2
      "
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        <FiSun
          className={`
            absolute inset-0
            text-yellow-500
            transition-all duration-500
            ${isDark ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}
          `}
        />
        
        <FiMoon
          className={`
            absolute inset-0
            text-gray-700 dark:text-gray-200 dark:text-gray-300
            transition-all duration-500
            ${isDark ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'}
          `}
        />
      </div>

      <span className="
        absolute
        -bottom-10
        left-1/2
        transform -translate-x-1/2
        px-2 py-1
        bg-gray-900 dark:bg-gray-100
        text-white dark:text-gray-900 dark:text-white
        text-xs
        rounded
        opacity-0
        group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none
        whitespace-nowrap
      ">
        {isDark ? 'Light mode' : 'Dark mode'}
      </span>
    </button>
  );
};

export default DarkModeToggle;

