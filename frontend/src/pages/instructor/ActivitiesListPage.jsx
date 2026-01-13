import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { activityApi } from '../../api/activityApi';
import { format, parseISO } from 'date-fns';
import { useToast } from '../../components/Toast';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';
import { FiList, FiCalendar, FiFilter, FiCheckCircle, FiClock, FiEdit, FiTrash2, FiCheck, FiMoreVertical, FiActivity, FiFileText, FiTrendingUp, FiMessageSquare, FiUpload, FiMail } from 'react-icons/fi';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="flex flex-col items-center justify-center text-center p-8">
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
      <Icon className="text-4xl text-gray-400 dark:text-gray-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-sm">{message}</p>
  </div>
);

const ActivitiesListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({});
  const menuRefs = useRef({});
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    activityType: '',
    status: '',
    search: '',
  });
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchActivities();
  }, [currentPage, filters.startDate, filters.endDate, filters.activityType, filters.status, filters.search]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 10 };
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.activityType) params.activityType = filters.activityType;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const response = await activityApi.getAll(params);
      setActivities(response?.data?.data || []);
      if (response?.data?.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const handleEdit = (activity) => {
    navigate(`/instructor/activities/${activity.id}/edit`);
  };

  const handleMarkAsCompleted = async (id) => {
    try {
      await activityApi.markAsCompleted(id);
      toast.success('Activity marked as completed');
      fetchActivities();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark activity as completed');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#545454',
    });

    if (result.isConfirmed) {
      try {
        await activityApi.delete(id);
        toast.success('Activity has been deleted');
        fetchActivities();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete activity');
      }
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'MDB_REPLY': return <FiMessageSquare />;
      case 'TICKET_RESPONSE': return <FiCheckCircle />;
      case 'ASSIGNMENT_UPLOAD': return <FiUpload />;
      case 'ASSIGNMENT_MARKING': return <FiEdit />;
      case 'GDB_MARKING': return <FiFileText />;
      case 'WEEKLY_SESSION': return <FiClock />;
      case 'EMAIL_RESPONSE': return <FiMail />;
      default: return <FiActivity />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiList className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Activities</h1>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">View and manage all your logged activities</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-5 flex items-center space-x-2">
            <FiFilter className="text-blue-600 text-lg sm:text-xl" />
            <span className="tracking-tight">Filters & Search</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            <div className="md:col-span-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Search</label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, description, course, or instructor..."
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Activity Type</label>
              <select
                value={filters.activityType}
                onChange={(e) => handleFilterChange('activityType', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700"
              >
                <option value="">All Types</option>
                <option value="MDB_REPLY">MDB Reply</option>
                <option value="TICKET_RESPONSE">Ticket Response</option>
                <option value="ASSIGNMENT_UPLOAD">Assignment Upload</option>
                <option value="ASSIGNMENT_MARKING">Assignment Marking</option>
                <option value="GDB_MARKING">GDB Marking</option>
                <option value="WEEKLY_SESSION">Weekly Session</option>
                <option value="EMAIL_RESPONSE">Email Response</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700"
              >
                <option value="">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <FiCalendar />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">
                    Course
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <FiClock />
                      <span className="hidden sm:inline">Time</span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                {loading ? (
                  <LoadingSkeleton type="table" rows={5} />
                ) : activities.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12">
                      <EmptyState
                        icon={FiActivity}
                        title="No Activities Found"
                        message="You haven't logged any activities yet. Start by logging your first activity!"
                      />
                    </td>
                  </tr>
                ) : (
                  (activities || []).map((activity) => (
                    <tr key={activity.id} className="hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors duration-200 group">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 hidden sm:flex">
                            {getActivityIcon(activity.activityType)}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-medium">
                            {activity.activityDate ? format(parseISO(activity.activityDate.split('T')[0]), 'MMM dd, yyyy') : '-'}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 sm:hidden">
                            {getActivityIcon(activity.activityType)}
                          </div>
                          <span>{activity.activityTypeLabel || activity.activityType}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white max-w-[150px] sm:max-w-none truncate sm:whitespace-normal">{activity.title}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium hidden sm:table-cell">
                        {activity.courseCode || '-'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-bold">
                        {activity.timeSpentMinutes} min
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center space-x-1 ${
                            activity.status === 'COMPLETED'
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {activity.status === 'COMPLETED' ? (
                            <FiCheckCircle className="text-xs" />
                          ) : (
                            <FiClock className="text-xs" />
                          )}
                          <span>{activity.status}</span>
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                        <div className="relative" ref={el => menuRefs.current[activity.id] = el}>
                          <button
                            onClick={(e) => {
                              const buttonRect = e.currentTarget.getBoundingClientRect();
                              const viewportHeight = window.innerHeight;
                              const menuHeight = 150; // Approximate menu height
                              const spaceBelow = viewportHeight - buttonRect.bottom;
                              const spaceAbove = buttonRect.top;
                              const showAbove = spaceBelow < menuHeight && spaceAbove > menuHeight;
                              
                              setMenuPosition({
                                [activity.id]: showAbove ? 'above' : 'below'
                              });
                              setOpenMenuId(openMenuId === activity.id ? null : activity.id);
                            }}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Actions"
                          >
                            <FiMoreVertical className="text-sm sm:text-base" />
                          </button>
                          {openMenuId === activity.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className={`absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-30 py-1 ${
                                menuPosition[activity.id] === 'above' 
                                  ? 'bottom-full mb-2' 
                                  : 'top-full mt-2'
                              }`}>
                                {activity.status !== 'COMPLETED' && (
                                  <button
                                    onClick={() => {
                                      handleMarkAsCompleted(activity.id);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center space-x-2 transition-colors"
                                  >
                                    <FiCheck className="text-base" />
                                    <span>Mark as Completed</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    handleEdit(activity);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-2 transition-colors"
                                >
                                  <FiEdit className="text-base" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(activity.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400 flex items-center space-x-2 transition-colors"
                                >
                                  <FiTrash2 className="text-base" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ActivitiesListPage;
