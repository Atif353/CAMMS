/**
 * ENHANCED LOADING SKELETON
 * 
 * Purpose: Show placeholder content while data is loading
 * 
 * Why better than spinners?
 * - Shows page structure immediately
 * - Reduces perceived loading time
 * - Professional, modern approach
 * - Less jarring than blank screen
 * 
 * Easy to explain in viva:
 * - "Instead of showing a spinner, I show the skeleton of the content"
 * - "This gives users immediate feedback about what's loading"
 * - "The shimmer animation shows it's loading, not frozen"
 * - "Used in dashboards, tables, and cards"
 */

/**
 * Base Skeleton Component
 * Can be used to create any skeleton shape
 */
export const Skeleton = ({ className = '', width = 'w-full', height = 'h-4' }) => {
  return (
    <div
      className={`
        ${width} ${height}
        bg-gray-200 dark:bg-gray-700
        rounded
        animate-shimmer
        ${className}
      `}
      style={{
        backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        backgroundSize: '200% 100%',
      }}
    />
  );
};

/**
 * Card Skeleton - For dashboard cards
 */
export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton width="w-32" height="h-6" />
        <Skeleton width="w-12" height="h-12" className="rounded-full" />
      </div>
      
      {/* Main content */}
      <Skeleton width="w-24" height="h-10" />
      <Skeleton width="w-40" height="h-4" />
    </div>
  );
};

/**
 * Table Skeleton - For data tables
 */
export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Table header */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600 dark:border-gray-600">
        <div className="flex space-x-4">
          <Skeleton width="w-1/4" height="h-4" />
          <Skeleton width="w-1/4" height="h-4" />
          <Skeleton width="w-1/4" height="h-4" />
          <Skeleton width="w-1/4" height="h-4" />
        </div>
      </div>
      
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="p-4 border-b border-gray-200 dark:border-gray-600 dark:border-gray-700">
          <div className="flex space-x-4">
            <Skeleton width="w-1/4" height="h-4" />
            <Skeleton width="w-1/4" height="h-4" />
            <Skeleton width="w-1/4" height="h-4" />
            <Skeleton width="w-1/4" height="h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Dashboard Skeleton - For full dashboard loading
 */
export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <Skeleton width="w-64" height="h-8" />
        <Skeleton width="w-48" height="h-4" className="mt-2" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <Skeleton width="w-48" height="h-6" className="mb-4" />
          <Skeleton width="w-full" height="h-64" />
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <Skeleton width="w-48" height="h-6" className="mb-4" />
          <Skeleton width="w-full" height="h-64" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;

