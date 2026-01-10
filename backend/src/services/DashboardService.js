import { ActivityModel } from '../models/ActivityModel.js';
import { NotificationModel } from '../models/NotificationModel.js';
import { UserModel } from '../models/UserModel.js';
import { getWeekRange, getMonthRange, formatDate, getDateRange, minutesToHours, formatTimeDisplay } from '../utils/dateUtils.js';

export const DashboardService = {
  async getInstructorDashboard(instructorId, dateRange = 'weekly') {
    const selectedRange = getDateRange(dateRange);
    const weekRange = getWeekRange();
    const monthRange = getMonthRange();

    const rangeActivities = await ActivityModel.findByDateRange(
      formatDate(selectedRange.startDate),
      formatDate(selectedRange.endDate),
      instructorId
    );

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

    const totalTimeMinutes = rangeActivities.reduce((sum, a) => sum + (a.time_spent_minutes || 0), 0);
    const totalTimeHours = minutesToHours(totalTimeMinutes);
    const monthTimeMinutes = monthActivities.reduce((sum, a) => sum + (a.time_spent_minutes || 0), 0);
    const monthTimeHours = minutesToHours(monthTimeMinutes);

    const weekStats = {
      totalActivities: rangeActivities.length,
      totalTimeSpent: totalTimeMinutes,
      totalTimeSpentDays: totalTimeHours.days,
      totalTimeSpentHours: totalTimeHours.hours,
      totalTimeSpentMinutes: totalTimeHours.minutes,
      totalTimeSpentFormatted: formatTimeDisplay(totalTimeMinutes),
      completed: rangeActivities.filter((a) => a.status === 'COMPLETED').length,
      pending: rangeActivities.filter((a) => a.status === 'PENDING').length,
    };

    const monthStats = {
      totalActivities: monthActivities.length,
      totalTimeSpent: monthTimeMinutes,
      totalTimeSpentDays: monthTimeHours.days,
      totalTimeSpentHours: monthTimeHours.hours,
      totalTimeSpentMinutes: monthTimeHours.minutes,
      totalTimeSpentFormatted: formatTimeDisplay(monthTimeMinutes),
    };

    const activityTypeCount = {};
    rangeActivities.forEach((activity) => {
      const type = activity.activity_type_code;
      activityTypeCount[type] = (activityTypeCount[type] || 0) + 1;
    });

    let dailyTimeSpent = {};
    const today = new Date();
    
    if (dateRange === 'yearly') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        dailyTimeSpent[monthKey] = 0;
      }
      
      rangeActivities.forEach((activity) => {
        const activityDate = new Date(activity.activity_date);
        const monthKey = `${monthNames[activityDate.getMonth()]} ${activityDate.getFullYear()}`;
        if (dailyTimeSpent[monthKey] !== undefined) {
          dailyTimeSpent[monthKey] += activity.time_spent_minutes || 0;
        }
      });
    } else {
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

    const unreadCount = await NotificationModel.getUnreadCount(instructorId);

    const trends = [];
    if (dateRange === 'yearly') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        monthEnd.setHours(23, 59, 59, 999);
        
        const monthActivities = await ActivityModel.findByDateRange(
          formatDate(monthStart),
          formatDate(monthEnd),
          instructorId
        );
        
        const monthMinutes = monthActivities.reduce((sum, a) => sum + (a.time_spent_minutes || 0), 0);
        trends.push({
          date: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
          month: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
          activities: monthActivities.length,
          timeSpent: monthMinutes,
          timeSpentHours: minutesToHours(monthMinutes).hours,
        });
      }
    } else {
      let daysToShow = 7;
      if (dateRange === 'daily') daysToShow = 1;
      else if (dateRange === 'weekly') daysToShow = 7;
      else if (dateRange === 'monthly') daysToShow = 30;
      
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);
        
        const dayActivities = await ActivityModel.findByDateRange(
          formatDate(dayStart),
          formatDate(dayEnd),
          instructorId
        );
        
        const dayMinutes = dayActivities.reduce((sum, a) => sum + (a.time_spent_minutes || 0), 0);
        const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        trends.push({
          date: formattedDate,
          day: formattedDate,
          week: formattedDate,
          month: formattedDate,
          activities: dayActivities.length,
          timeSpent: dayMinutes,
          timeSpentHours: minutesToHours(dayMinutes).hours,
        });
      }
    }

    const todayActivities = rangeActivities.filter(
      (a) => formatDate(a.activity_date) === formatDate(today)
    );

    const completionRate = weekStats.totalActivities > 0
      ? Math.round((weekStats.completed / weekStats.totalActivities) * 100)
      : 0;

    return {
      weekStats,
      monthStats,
      activityTypeCount,
      dailyTimeSpent: Object.entries(dailyTimeSpent).map(([key, minutes]) => {
        const timeData = minutesToHours(minutes);
        return {
          date: dateRange === 'yearly' ? key : new Date(key).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          minutes,
          days: timeData.days,
          hours: timeData.hours,
          hoursFormatted: formatTimeDisplay(minutes),
        };
      }),
      trends,
      unreadNotifications: unreadCount,
      todayActivities: todayActivities.length,
      completionRate,
    };
  },

  async getAdminDashboard(dateRange = 'weekly') {
    const selectedRange = getDateRange(dateRange);
    const totalInstructors = await UserModel.count({ role: 'INSTRUCTOR' });

    const todayStr = formatDate(new Date());
    const todayActivities = await ActivityModel.findByDateRange(todayStr, todayStr);

    const rangeActivities = await ActivityModel.findByDateRange(
      formatDate(selectedRange.startDate),
      formatDate(selectedRange.endDate)
    );

    const instructors = await UserModel.findAll({ role: 'INSTRUCTOR' });
    const instructorStats = await Promise.all(
      instructors.map(async (instructor) => {
        const activities = await ActivityModel.findByDateRange(
          formatDate(selectedRange.startDate),
          formatDate(selectedRange.endDate),
          instructor.id
        );
        const timeMinutes = activities.reduce((sum, a) => sum + (a.time_spent_minutes || 0), 0);
        const timeHours = minutesToHours(timeMinutes);
        return {
          id: instructor.id,
          name: instructor.name,
          email: instructor.email,
          activityCount: activities.length,
          totalTimeSpent: timeMinutes,
          totalTimeSpentDays: timeHours.days,
          totalTimeSpentHours: timeHours.hours,
          totalTimeSpentMinutes: timeHours.minutes,
          totalTimeSpentFormatted: formatTimeDisplay(timeMinutes),
        };
      })
    );

    instructorStats.sort((a, b) => b.activityCount - a.activityCount);

    const activityDistribution = {};
    rangeActivities.forEach((activity) => {
      const type = activity.activity_type_code;
      activityDistribution[type] = (activityDistribution[type] || 0) + 1;
    });

    let dailyActivityTrend = {};
    const today = new Date();
    
    if (dateRange === 'yearly') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        dailyActivityTrend[monthKey] = 0;
      }
      
      rangeActivities.forEach((activity) => {
        const activityDate = new Date(activity.activity_date);
        const monthKey = `${monthNames[activityDate.getMonth()]} ${activityDate.getFullYear()}`;
        if (dailyActivityTrend[monthKey] !== undefined) {
          dailyActivityTrend[monthKey] += 1;
        }
      });
    } else {
      let daysToShow = 7;
      if (dateRange === 'daily') daysToShow = 1;
      else if (dateRange === 'weekly') daysToShow = 7;
      else if (dateRange === 'monthly') daysToShow = 30;
      
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(today);
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

    const totalTimeMinutes = rangeActivities.reduce((sum, a) => sum + (a.time_spent_minutes || 0), 0);
    const totalTimeHours = minutesToHours(totalTimeMinutes);
    const avgTimeMinutes = rangeActivities.length > 0
      ? Math.round(totalTimeMinutes / rangeActivities.length)
      : 0;
    const avgTimeHours = minutesToHours(avgTimeMinutes);

    return {
      totalInstructors,
      todayActivities: todayActivities.length,
      weekActivities: rangeActivities.length,
      topInstructors: instructorStats.slice(0, 5),
      activityDistribution,
      dailyActivityTrend: Object.entries(dailyActivityTrend).map(([key, count]) => ({
        date: dateRange === 'yearly' ? key : new Date(key).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        count,
      })),
      statusDistribution,
      avgTimePerActivity: avgTimeMinutes,
      avgTimePerActivityDays: avgTimeHours.days,
      avgTimePerActivityHours: avgTimeHours.hours,
      avgTimePerActivityMinutes: avgTimeHours.minutes,
      avgTimePerActivityFormatted: formatTimeDisplay(avgTimeMinutes),
      totalTimeSpent: totalTimeMinutes,
      totalTimeSpentDays: totalTimeHours.days,
      totalTimeSpentHours: totalTimeHours.hours,
      totalTimeSpentMinutes: totalTimeHours.minutes,
      totalTimeSpentFormatted: formatTimeDisplay(totalTimeMinutes),
    };
  },
};

