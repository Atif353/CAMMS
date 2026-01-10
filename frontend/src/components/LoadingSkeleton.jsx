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

export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton width="w-32" height="h-6" />
        <Skeleton width="w-12" height="h-12" className="rounded-full" />
      </div>
      
      <Skeleton width="w-24" height="h-10" />
      <Skeleton width="w-40" height="h-4" />
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600 dark:border-gray-600">
        <div className="flex space-x-4">
          <Skeleton width="w-1/4" height="h-4" />
          <Skeleton width="w-1/4" height="h-4" />
          <Skeleton width="w-1/4" height="h-4" />
          <Skeleton width="w-1/4" height="h-4" />
        </div>
      </div>
      
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

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <Skeleton width="w-64" height="h-8" />
        <Skeleton width="w-48" height="h-4" className="mt-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

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

