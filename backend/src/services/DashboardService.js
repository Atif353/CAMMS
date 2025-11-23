import { ActivityModel } from '../models/ActivityModel.js';
import { NotificationModel } from '../models/NotificationModel.js';
import { UserModel } from '../models/UserModel.js';
import { getWeekRange, getMonthRange, formatDate, getDateRange } from '../utils/dateUtils.js';

export const DashboardService = {
  async getInstructorDashboard(instructorId, dateRange = 'weekly') {
    const selectedRange = getDateRange(dateRange);
    const weekRange = getWeekRange();
    const monthRange = getMonthRange();

    // Get activities for selected date range
    const rangeActivities = await ActivityModel.findByDateRange(
      formatDate(selectedRange.startDate),
      formatDate(selectedRange.endDate),
      instructorId
    );

    // Get activities for this week (for comparison)
    const weekActivities = await ActivityModel.findByDateRange(
      formatDate(weekRange.startDate),
      formatDate(weekRange.endDate),
      instructorId
    );

    // Get activities for this month
    const monthActivities = await ActivityModel.findByDateRange(
      formatDate(monthRange.startDate),
      formatDate(monthRange.endDate),
      instructorId
    );

    // Calculate stats for selected range
    const weekStats = {
      totalActivities: rangeActivities.length,
      totalTimeSpent: rangeActivities.reduce((sum, a) => sum + (a.time_spent_minutes || 0), 0),
      completed: rangeActivities.filter((a) => a.status === 'COMPLETED').length,
      pending: rangeActivities.filter((a) => a.status === 'PENDING').length,
    };

    const monthStats = {
      totalActivities: monthActivities.length,
      totalTimeSpent: monthActivities.reduce((sum, a) => sum + (a.time_spent_minutes || 0), 0),
    };

    // Group by activity type for chart
    const activityTypeCount = {};
    rangeActivities.forEach((activity) => {
      const type = activity.activity_type_code;
      activityTypeCount[type] = (activityTypeCount[type] || 0) + 1;
    });

    // Time spent per day/month based on date range
    let dailyTimeSpent = {};
    const today = new Date();
    
    if (dateRange === 'yearly') {
      // For yearly, group by months
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear = today.getFullYear();
      
      // Initialize all months of the year
      for (let month = 0; month < 12; month++) {
        const monthKey = `${monthNames[month]} ${currentYear}`;
        dailyTimeSpent[monthKey] = 0;
      }
      
      // Group activities by month
      rangeActivities.forEach((activity) => {
        const activityDate = new Date(activity.activity_date);
        const monthIndex = activityDate.getMonth();
        const monthKey = `${monthNames[monthIndex]} ${currentYear}`;
        if (dailyTimeSpent[monthKey] !== undefined) {
          dailyTimeSpent[monthKey] += activity.time_spent_minutes || 0;
        }
      });
    } else {
      // For daily, weekly, monthly - group by days
      let daysToShow = 7;
      if (dateRange === 'daily') daysToShow = 1;
      else if (dateRange === 'weekly') daysToShow = 7;
      else if (dateRange === 'monthly') daysToShow = 30;
      
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);
        dailyTimeSpent[dateStr] = 0;
      }

      rangeActivities.forEach((activity) => {
        const dateStr = formatDate(activity.activity_date);
        if (dailyTimeSpent[dateStr] !== undefined) {
          dailyTimeSpent[dateStr] += activity.time_spent_minutes || 0;
        }
      });
    }

    // Get unread notifications count
    const unreadCount = await NotificationModel.getUnreadCount(instructorId);

    // Activity trends (last 4 weeks)
    const weeklyTrends = [];
    for (let week = 3; week >= 0; week--) {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - (week * 7) - 6);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekActivities = await ActivityModel.findByDateRange(
        formatDate(weekStart),
        formatDate(weekEnd),
        instructorId
      );
      
      weeklyTrends.push({
        week: `Week ${4 - week}`,
        activities: weekActivities.length,
        timeSpent: weekActivities.reduce((sum, a) => sum + (a.time_spent_minutes || 0), 0),
      });
    }

    // Today's activities count
    const todayActivities = rangeActivities.filter(
      (a) => formatDate(a.activity_date) === formatDate(today)
    );

    // Activity completion rate
    const completionRate = weekStats.totalActivities > 0
      ? Math.round((weekStats.completed / weekStats.totalActivities) * 100)
      : 0;

    return {
      weekStats,
      monthStats,
      activityTypeCount,
      dailyTimeSpent: dateRange === 'yearly' 
        ? Object.entries(dailyTimeSpent).map(([month, minutes]) => ({
            date: month,
            minutes,
          }))
        : Object.entries(dailyTimeSpent).map(([date, minutes]) => ({
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            minutes,
          })),
      unreadNotifications: unreadCount,
      weeklyTrends,
      todayActivities: todayActivities.length,
      completionRate,
    };
  },

  async getAdminDashboard(dateRange = 'weekly') {
    const selectedRange = getDateRange(dateRange);
    // Get total instructors
    const totalInstructors = await UserModel.count({ role: 'INSTRUCTOR' });

    // Get today's activities
    const today = formatDate(new Date());
    const todayActivities = await ActivityModel.findByDateRange(today, today);

    // Get activities for selected date range
    const rangeActivities = await ActivityModel.findByDateRange(
      formatDate(selectedRange.startDate),
      formatDate(selectedRange.endDate)
    );

    // Get this week's activities (for comparison)
    const weekRange = getWeekRange();
    const weekActivities = await ActivityModel.findByDateRange(
      formatDate(weekRange.startDate),
      formatDate(weekRange.endDate)
    );

    // Get all instructors with activity counts
    const instructors = await UserModel.findAll({ role: 'INSTRUCTOR' });
    const instructorStats = await Promise.all(
      instructors.map(async (instructor) => {
        const activities = await ActivityModel.findByDateRange(
          formatDate(selectedRange.startDate),
          formatDate(selectedRange.endDate),
          instructor.id
        );
        return {
          id: instructor.id,
          name: instructor.name,
          email: instructor.email,
          activityCount: activities.length,
          totalTimeSpent: activities.reduce((sum, a) => sum + (a.time_spent_minutes || 0), 0),
        };
      })
    );

    // Sort by activity count
    instructorStats.sort((a, b) => b.activityCount - a.activityCount);

    // Activity distribution by type
    const activityDistribution = {};
    rangeActivities.forEach((activity) => {
      const type = activity.activity_type_code;
      activityDistribution[type] = (activityDistribution[type] || 0) + 1;
    });

    // Activity trends based on date range
    let dailyActivityTrend = {};
    
    if (dateRange === 'yearly') {
      // For yearly, group by months
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear = new Date().getFullYear();
      
      // Initialize all months of the year
      for (let month = 0; month < 12; month++) {
        const monthKey = `${monthNames[month]} ${currentYear}`;
        dailyActivityTrend[monthKey] = 0;
      }
      
      // Group activities by month
      rangeActivities.forEach((activity) => {
        const activityDate = new Date(activity.activity_date);
        const monthIndex = activityDate.getMonth();
        const monthKey = `${monthNames[monthIndex]} ${currentYear}`;
        if (dailyActivityTrend[monthKey] !== undefined) {
          dailyActivityTrend[monthKey] += 1;
        }
      });
    } else {
      // For daily, weekly, monthly - group by days
      let daysToShow = 7;
      if (dateRange === 'daily') daysToShow = 1;
      else if (dateRange === 'weekly') daysToShow = 7;
      else if (dateRange === 'monthly') daysToShow = 30;
      
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);
        dailyActivityTrend[dateStr] = 0;
      }

      rangeActivities.forEach((activity) => {
        const dateStr = formatDate(activity.activity_date);
        if (dailyActivityTrend[dateStr] !== undefined) {
          dailyActivityTrend[dateStr] += 1;
        }
      });
    }

    // Activity status distribution
    const statusDistribution = {
      COMPLETED: rangeActivities.filter((a) => a.status === 'COMPLETED').length,
      PENDING: rangeActivities.filter((a) => a.status === 'PENDING').length,
    };

    // Average time per activity
    const avgTimePerActivity = rangeActivities.length > 0
      ? Math.round(rangeActivities.reduce((sum, a) => sum + (a.time_spent_minutes || 0), 0) / rangeActivities.length)
      : 0;

    return {
      totalInstructors,
      todayActivities: todayActivities.length,
      weekActivities: rangeActivities.length,
      topInstructors: instructorStats.slice(0, 5),
      activityDistribution,
      dailyActivityTrend: dateRange === 'yearly'
        ? Object.entries(dailyActivityTrend).map(([month, count]) => ({
            date: month,
            count,
          }))
        : Object.entries(dailyActivityTrend).map(([date, count]) => ({
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            count,
          })),
      statusDistribution,
      avgTimePerActivity,
      totalTimeSpent: rangeActivities.reduce((sum, a) => sum + (a.time_spent_minutes || 0), 0),
    };
  },
};

