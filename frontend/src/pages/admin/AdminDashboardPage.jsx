import { useEffect, useState, useMemo } from 'react';
import Layout from '../../components/Layout';
import { dashboardApi } from '../../api/dashboardApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import {
  FiUsers,
  FiActivity,
  FiTrendingUp,
  FiBarChart2,
  FiLayout,
  FiClock,
  FiTarget,
  FiAward,
  FiCalendar,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const AdminDashboardPage = () => {
  const navigate = useNavigate();
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
      const response = await dashboardApi.getAdmin({ dateRange });
      setDashboard(response?.data?.data || null);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setDashboard(null);
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

  const formatTimeForCard = (timeFormatted, range, totalMinutes) => {
    if (!timeFormatted || timeFormatted === '0h') return '0h';
    if (!totalMinutes || totalMinutes === 0) return '0h';
    
    const totalHours = totalMinutes / 60;
    const days = Math.floor(totalHours / 24);
    const hours = Math.floor(totalHours % 24);
    const minutes = totalMinutes % 60;
    
    if (range === 'yearly') {
      if (days >= 1) {
        const weeks = Math.round(days / 7 * 10) / 10;
        if (weeks >= 4) {
          const months = Math.round(weeks / 4.33 * 10) / 10;
          return months >= 1 ? `${months} months` : `${weeks} weeks`;
        }
        return `${days} days`;
      }
      return timeFormatted;
    }
    
    if (range === 'monthly') {
      if (days >= 7) {
        const weeks = Math.round(days / 7 * 10) / 10;
        return weeks >= 4 ? `${Math.round(weeks)} weeks` : `${days} days`;
      }
      if (days > 0) {
        if (hours === 0 && minutes === 0) return `${days} days`;
        if (hours === 0) return `${days}d ${minutes}m`;
        if (minutes === 0) return `${days}d ${hours}h`;
        return `${days}d ${hours}h`;
      }
      if (hours > 0) {
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    }
    
    if (range === 'weekly') {
      if (days > 0) {
        if (hours === 0 && minutes === 0) return `${days} days`;
        if (hours === 0) return `${days}d`;
        if (minutes === 0) return `${days}d ${hours}h`;
        return `${days}d ${hours}h`;
      }
      if (hours > 0) {
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    }
    
    return timeFormatted;
  };

  const chartData = useMemo(() => {
    if (!dashboard?.activityDistribution) return [];
    return Object.entries(dashboard.activityDistribution).map(([type, count]) => {
      const fullName = type.replace(/_/g, ' ');
      return {
        name: abbreviateActivityType(type),
        fullName: fullName,
        value: count,
      };
    });
  }, [dashboard?.activityDistribution, dateRange]);

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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <FiLayout className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Welcome back! Here's your system overview.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold mb-1">Total Instructors</p>
                <p className="text-4xl font-bold text-blue-700 dark:text-blue-300 mt-2">{dashboard?.totalInstructors || 0}</p>
                <p className="text-blue-500 dark:text-blue-400 text-xs mt-1 font-medium">Active users</p>
              </div>
              <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                <FiUsers className="text-3xl text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-1">Today's Activities</p>
                <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-300 mt-2">{dashboard?.todayActivities || 0}</p>
                <p className="text-emerald-500 dark:text-emerald-400 text-xs mt-1 font-medium">Logged today</p>
              </div>
              <div className="w-16 h-16 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center shadow-md">
                <FiActivity className="text-3xl text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-1">{dateRange.charAt(0).toUpperCase() + dateRange.slice(1)} Activities</p>
                <p className="text-4xl font-bold text-indigo-700 dark:text-indigo-300 mt-2">{dashboard?.weekActivities || 0}</p>
                <p className="text-indigo-500 dark:text-indigo-400 text-xs mt-1 font-medium">activities</p>
              </div>
              <div className="w-16 h-16 bg-indigo-500 dark:bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <FiTrendingUp className="text-3xl text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-2 border-rose-200 dark:border-rose-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-rose-600 dark:text-rose-400 text-sm font-semibold mb-2">Total Time Spent</p>
                <p className={`font-bold text-rose-700 dark:text-rose-300 leading-tight ${
                  dateRange === 'yearly' ? 'text-2xl sm:text-3xl mb-1' : 
                  dateRange === 'monthly' ? 'text-2xl sm:text-3xl' : 
                  'text-3xl sm:text-4xl'
                }`}>
                  {formatTimeForCard(dashboard?.totalTimeSpentFormatted, dateRange, dashboard?.totalTimeSpent)}
                </p>
                {dateRange === 'yearly' && dashboard?.totalTimeSpent > 0 && (
                  <p className="text-xs text-rose-500 dark:text-rose-400 opacity-75 mt-1">
                    ~{Math.round((dashboard?.totalTimeSpent || 0) / 365 / 60 * 10) / 10} hrs/day avg
                  </p>
                )}
                {dateRange === 'monthly' && dashboard?.totalTimeSpent > 0 && (
                  <p className="text-xs text-rose-500 dark:text-rose-400 opacity-75 mt-1">
                    ~{Math.round((dashboard?.totalTimeSpent || 0) / 30 / 60 * 10) / 10} hrs/day avg
                  </p>
                )}
                {dateRange === 'weekly' && dashboard?.totalTimeSpent > 0 && (
                  <p className="text-xs text-rose-500 dark:text-rose-400 opacity-75 mt-1">
                    ~{Math.round((dashboard?.totalTimeSpent || 0) / 7 / 60 * 10) / 10} hrs/day avg
                  </p>
                )}
                <p className="text-rose-500 dark:text-rose-400 text-xs mt-2 font-medium">
                  {dateRange === 'yearly' ? 'Last 12 months' : 
                   dateRange === 'monthly' ? 'Last 30 days' :
                   dateRange === 'weekly' ? 'Last 7 days' :
                   dateRange.charAt(0).toUpperCase() + dateRange.slice(1) + ' period'}
                </p>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-rose-500 dark:bg-rose-600 rounded-full flex items-center justify-center shadow-md ml-4 flex-shrink-0">
                <FiClock className="text-2xl sm:text-3xl text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10 rounded-2xl shadow-lg p-3 sm:p-4 border-2 border-blue-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 sm:gap-4">
            <div className="flex flex-wrap gap-2">
              {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    dateRange === range
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-700/30 rounded-2xl shadow-xl p-6 border-2 border-blue-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiTrendingUp className="text-white text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {dateRange === 'yearly' ? 'Monthly Activity Trend' : 'Daily Activity Trend'} ({dateRange.charAt(0).toUpperCase() + dateRange.slice(1)})
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={320} key={`line-chart-${dateRange}`}>
            <LineChart data={dashboard?.dailyActivityTrend || []} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.5} />
              <XAxis 
                dataKey="date"
                tick={{ fill: chartColors.text, fontSize: 11, fontWeight: 500 }}
                stroke={chartColors.grid}
                angle={dateRange === 'yearly' ? 0 : -45}
                textAnchor={dateRange === 'yearly' ? 'middle' : 'end'}
                height={dateRange === 'yearly' ? 40 : 80}
              />
              <YAxis 
                tick={{ fill: chartColors.text, fontSize: 11, fontWeight: 500 }}
                stroke={chartColors.grid}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: chartColors.tooltipBg, 
                  border: `2px solid ${chartColors.tooltipBorder}`,
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: chartColors.tooltipText
                }}
                itemStyle={{ color: chartColors.tooltipText }}
                cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 2 }}
                name="Activities"
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-800 dark:to-emerald-900/10 rounded-2xl shadow-xl p-6 border-2 border-emerald-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-500 dark:to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiBarChart2 className="text-white text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Activity Type Distribution ({dateRange.charAt(0).toUpperCase() + dateRange.slice(1)})
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={320} key={`bar-chart-${dateRange}`}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.5} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: chartColors.text, fontSize: 10, fontWeight: 600 }}
                angle={-30}
                textAnchor="end"
                height={80}
                stroke={chartColors.grid}
                interval={0}
              />
              <YAxis 
                tick={{ fill: chartColors.text, fontSize: 11, fontWeight: 500 }}
                stroke={chartColors.grid}
              />
              <Tooltip 
                formatter={(value, name, props) => [value, props.payload.fullName]}
                labelFormatter={(label) => `Activity: ${label}`}
                contentStyle={{ 
                  backgroundColor: chartColors.tooltipBg, 
                  border: '2px solid #10b981',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: chartColors.tooltipText
                }}
                itemStyle={{ color: chartColors.tooltipText }}
                cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
              />
              <Bar 
                dataKey="value" 
                fill="url(#barGradientAdmin)" 
                radius={[12, 12, 0, 0]}
                animationDuration={1000}
              />
              <defs>
                <linearGradient id="barGradientAdmin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={1}/>
                  <stop offset="50%" stopColor="#10b981" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.9}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/10 rounded-2xl shadow-xl p-6 border-2 border-purple-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-500 dark:to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiBarChart2 className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Activity Distribution ({dateRange.charAt(0).toUpperCase() + dateRange.slice(1)})
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={320} key={`pie-chart-${dateRange}`}>
              <PieChart>
                <Pie
                  data={chartData}
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
                  {(chartData || []).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke={isDark ? '#1e293b' : '#fff'}
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
                  wrapperStyle={{ paddingTop: '20px', fontSize: '11px', color: chartColors.text }}
                  formatter={(value, entry) => entry.payload.fullName}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-white to-rose-50/30 dark:from-gray-800 dark:to-rose-900/10 rounded-2xl shadow-xl p-6 border-2 border-rose-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 dark:from-rose-500 dark:to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiUsers className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Active Instructors</h3>
            </div>
            <div className="space-y-3">
              {(dashboard?.topInstructors || []).map((instructor, index) => (
                <div
                  key={instructor.id}
                  className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {instructor.profile_image ? (
                        <img
                          src={(() => {
                            const img = instructor.profile_image;
                            if (img.startsWith('http')) return img;
                            if (img.startsWith('uploads/')) {
                              let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                              if (baseUrl.endsWith('/api')) {
                                baseUrl = baseUrl.replace('/api', '');
                              }
                              return `${baseUrl}/${img}`;
                            }
                            let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                            if (baseUrl.endsWith('/api')) {
                              baseUrl = baseUrl.replace('/api', '');
                            }
                            return `${baseUrl}/${img}`;
                          })()}
                          alt={instructor.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-600 shadow-md"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=3b82f6&color=fff&size=48`;
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{instructor.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{instructor.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">{instructor.activityCount}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">activities</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{instructor.totalTimeSpentFormatted || `${instructor.totalTimeSpent || 0}m`}</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data available</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl p-6 border border-emerald-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FiTarget className="text-emerald-600 dark:text-emerald-400 text-xl" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Activity Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Completed</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xl">{dashboard?.statusDistribution?.COMPLETED || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Pending</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-xl">{dashboard?.statusDistribution?.PENDING || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FiClock className="text-blue-600 dark:text-blue-400 text-xl" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Average Time</h3>
            </div>
            <div className="flex items-end space-x-2">
              <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{dashboard?.avgTimePerActivityFormatted || '0h'}</span>
              <span className="text-gray-600 dark:text-gray-300 mb-1">/activity</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Per activity ({dateRange.charAt(0).toUpperCase() + dateRange.slice(1)})</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl p-6 border border-purple-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <FiAward className="text-purple-600 dark:text-purple-400 text-xl" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Today's Performance</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Activities Today</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{dashboard?.todayActivities || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">{dateRange.charAt(0).toUpperCase() + dateRange.slice(1)} Total</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{dashboard?.weekActivities || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
