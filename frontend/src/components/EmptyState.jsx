import { FiInbox, FiSearch, FiFileText, FiUsers, FiActivity } from 'react-icons/fi';

const EmptyState = ({ 
  icon = FiInbox, 
  title = 'No data found', 
  message = 'There is no data to display',
  action = null 
}) => {
  const Icon = icon;
  
  return (
    <div className="text-center py-12 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
        <Icon className="text-4xl text-blue-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">{message}</p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;


