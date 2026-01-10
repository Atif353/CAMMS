export const getWeekRange = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { startDate: monday, endDate: sunday };
};

export const getMonthRange = (date = new Date()) => {
  const d = new Date(date);
  const startDate = new Date(d.getFullYear(), d.getMonth(), 1);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
};

export const getFiveMonthRange = (date = new Date()) => {
  const d = new Date(date);
  const endDate = new Date(d);
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date(d);
  startDate.setMonth(startDate.getMonth() - 5);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);
  return { startDate, endDate };
};

export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const formatDateTime = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

export const minutesToHours = (minutes) => {
  if (!minutes || minutes === 0) return { days: 0, hours: 0, minutes: 0 };
  const totalHours = Math.floor(minutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const remainingMinutes = minutes % 60;
  return { days, hours, minutes: remainingMinutes };
};

export const formatTimeDisplay = (totalMinutes) => {
  if (!totalMinutes || totalMinutes === 0) return '0h';
  const { days, hours, minutes } = minutesToHours(totalMinutes);
  
  if (days > 0) {
    const parts = [`${days}d`];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    return parts.join(' ');
  }
  
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

export const getDateRange = (range = 'weekly') => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  switch (range) {
    case 'daily':
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      return { startDate: startOfDay, endDate: today };
    
    case 'weekly':
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - 6);
      weekStart.setHours(0, 0, 0, 0);
      return { startDate: weekStart, endDate: today };
    
    case 'monthly':
      const monthStart = new Date(today);
      monthStart.setDate(monthStart.getDate() - 29);
      monthStart.setHours(0, 0, 0, 0);
      return { startDate: monthStart, endDate: today };
    
    case 'yearly':
      const yearStart = new Date(today);
      yearStart.setMonth(yearStart.getMonth() - 11);
      yearStart.setDate(1);
      yearStart.setHours(0, 0, 0, 0);
      return { startDate: yearStart, endDate: today };
    
    default:
      const defaultStart = new Date(today);
      defaultStart.setDate(defaultStart.getDate() - 6);
      defaultStart.setHours(0, 0, 0, 0);
      return { startDate: defaultStart, endDate: today };
  }
};

