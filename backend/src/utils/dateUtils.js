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

export const getDateRange = (range = 'weekly') => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  switch (range) {
    case 'daily':
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      return { startDate: startOfDay, endDate: today };
    
    case 'weekly':
      return getWeekRange(today);
    
    case 'monthly':
      return getMonthRange(today);
    
    case 'yearly':
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      startOfYear.setHours(0, 0, 0, 0);
      return { startDate: startOfYear, endDate: today };
    
    default:
      return getWeekRange(today);
  }
};

