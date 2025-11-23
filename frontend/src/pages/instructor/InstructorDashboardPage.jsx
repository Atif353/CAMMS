import { useEffect, useState, useMemo } from 'react';
import Layout from '../../components/Layout';
import { dashboardApi } from '../../api/dashboardApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';
import {
  FiActivity,
  FiClock,
  FiAlertCircle,
  FiBell,
  FiTrendingUp,
  FiPlusCircle,
  FiFileText,
  FiList,
  FiTarget,
  FiAward,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const InstructorDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('weekly');
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const chartColors = {
    text: isDark ? '#e2e8f0' : '#475569',
    grid: isDark ? '#334155' : '#cbd5e1',
    tooltipBg: isDark ? '#1e293b' : '#ffffff',
    tooltipBorder: isDark ? '#3b82f6' : '#3b82f6',
    tooltipText: isDark ? '#f1f5f9' : '#1e293b'
  };

  useEffect(() => {
    fetchDashboard();
  }, [dateRange]);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardApi.getInstructor({ dateRange });
      setDashboard(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const abbreviateActivityType = (type) => {
    const abbreviations = {
      'TICKET RESPONSE': 'Ticket',
      'EMAIL RESPONSE': 'Email',
      'WEEKLY SESSION': 'Session',
      'MDB REPLY': 'MDB',
      'ASSIGNMENT MARKING': 'Marking',
      'GDB MARKING': 'GDB',
      'ASSIGNMENT UPLOAD': 'Upload',
    };
    const fullName = type.replace(/_/g, ' ');
    return abbreviations[fullName] || fullName.substring(0, 10);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  // Recalculate pie chart data when dashboard or dateRange changes
  // IMPORTANT: This hook must be called before any conditional returns
  const pieChartData = useMemo(() => {
    if (!dashboard?.activityTypeCount) return [];
    return Object.entries(dashboard.activityTypeCount).map(([type, count]) => {
      const fullName = type.replace(/_/g, ' ');
      return {
        name: abbreviateActivityType(type),
        fullName: fullName,
        value: count,
      };
    });
  }, [dashboard?.activityTypeCount, dateRange]);

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
              <FiActivity className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, <span className="text-blue-600 dark:text-blue-400">{user?.name}</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Here's what's happening with your courses today.</p>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10 rounded-2xl shadow-lg p-3 sm:p-4 border-2 border-blue-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">View Data:</span>
            <div className="flex flex-wrap gap-2">
              {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    dateRange === range
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold mb-1">This Week</p>
                <p className="text-4xl font-bold text-blue-700 dark:text-blue-300 mt-2">{dashboard?.weekStats?.totalActivities || 0}</p>
                <p className="text-blue-500 dark:text-blue-400 text-xs mt-1 font-medium">activities</p>
              </div>
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <FiActivity className="text-3xl text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-1">Time Spent</p>
                <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-300 mt-2">{dashboard?.weekStats?.totalTimeSpent || 0}</p>
                <p className="text-emerald-500 dark:text-emerald-400 text-xs mt-1 font-medium">minutes</p>
              </div>
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                <FiClock className="text-3xl text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 dark:text-amber-400 text-sm font-semibold mb-1">Pending Tasks</p>
                <p className="text-4xl font-bold text-amber-700 dark:text-amber-300 mt-2">{dashboard?.weekStats?.pending || 0}</p>
                <p className="text-amber-500 dark:text-amber-400 text-xs mt-1 font-medium">items</p>
              </div>
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                <FiAlertCircle className="text-3xl text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-1">Alerts</p>
                <p className="text-4xl font-bold text-indigo-700 dark:text-indigo-300 mt-2">{dashboard?.unreadNotifications || 0}</p>
                <p className="text-indigo-500 dark:text-indigo-400 text-xs mt-1 font-medium">unread</p>
              </div>
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center shadow-md">
                <FiBell className="text-3xl text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Type Chart */}
          <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-700/30 rounded-2xl shadow-xl p-6 border-2 border-blue-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiTrendingUp className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Activities Trend ({dateRange.charAt(0).toUpperCase() + dateRange.slice(1)})
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={320} key={`line-chart-${dateRange}`}>
            <LineChart data={dashboard?.trends || dashboard?.weeklyTrends || dashboard?.dailyTrends || dashboard?.monthlyTrends || dashboard?.yearlyTrends || []} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.5} />
              <XAxis 
                dataKey={dateRange === 'daily' ? 'day' : dateRange === 'weekly' ? 'week' : dateRange === 'monthly' ? 'month' : 'year'} 
                tick={{ fill: chartColors.text, fontSize: 11, fontWeight: 500 }}
                stroke={chartColors.text}
              />
              <YAxis 
                yAxisId="left"
                label={{ value: 'Activities', angle: -90, position: 'insideLeft', fill: '#3b82f6', fontSize: 12, fontWeight: 600 }}
                tick={{ fill: '#3b82f6', fontSize: 11, fontWeight: 500 }}
                stroke="#3b82f6"
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                label={{ value: 'Time (min)', angle: 90, position: 'insideRight', fill: '#10b981', fontSize: 12, fontWeight: 600 }}
                tick={{ fill: '#10b981', fontSize: 11, fontWeight: 500 }}
                stroke="#10b981"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: chartColors.tooltipBg, 
                  border: `2px solid ${chartColors.tooltipBorder}`,
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: chartColors.tooltipText
                }}
                cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="activities" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 2 }}
                name="Activities"
                animationDuration={1000}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="timeSpent" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 6, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 2 }}
                name="Time (min)"
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Type Distribution */}
        <div className="bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/10 rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-purple-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiTarget className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Activity Type Distribution ({dateRange.charAt(0).toUpperCase() + dateRange.slice(1)})
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={320} key={`pie-chart-${dateRange}`}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={110}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={3}
                  animationDuration={1000}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [value, props.payload.fullName]}
                  contentStyle={{ 
                    backgroundColor: chartColors.tooltipBg, 
                    border: '2px solid #8b5cf6',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(139, 92, 246, 0.15)',
                    padding: '12px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: chartColors.tooltipText
                  }}
                  itemStyle={{ color: chartColors.tooltipText }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }}
                  formatter={(value, entry) => entry.payload.fullName}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl p-6 border border-purple-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FiAward className="text-purple-600 dark:text-purple-400 text-xl" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Completion Rate</h3>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Completed</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{dashboard?.weekStats?.completed || 0} / {dashboard?.weekStats?.totalActivities || 0}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ 
                      width: `${dashboard?.completionRate || 0}%` 
                    }}
                  >
                    <span className="text-xs font-bold text-white">{dashboard?.completionRate || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FiActivity className="text-blue-600 dark:text-blue-400 text-xl" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Today's Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Activities Logged</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-xl">{dashboard?.todayActivities || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Monthly Total</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{dashboard?.monthStats?.totalActivities || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Monthly Time</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{dashboard?.monthStats?.totalTimeSpent || 0} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InstructorDashboardPage;
