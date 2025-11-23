import { jest } from '@jest/globals';

export const getWeekRange = jest.fn();
export const getMonthRange = jest.fn();
export const getFiveMonthRange = jest.fn();
export const formatDate = jest.fn();
export const formatDateTime = jest.fn();
export const getDateRange = jest.fn();

export default {
  getWeekRange,
  getMonthRange,
  getFiveMonthRange,
  formatDate,
  formatDateTime,
  getDateRange,
};

