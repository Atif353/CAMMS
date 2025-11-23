import { describe, it, expect } from '@jest/globals';
import {
  getWeekRange,
  getMonthRange,
  getFiveMonthRange,
  formatDate,
  getDateRange,
} from '../../utils/dateUtils.js';

describe('dateUtils', () => {
  describe('getWeekRange', () => {
    it('should return start and end dates of current week', () => {
      const result = getWeekRange();

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
      expect(result.endDate.getTime()).toBeGreaterThan(result.startDate.getTime());
    });

    it('should return Monday as start date', () => {
      const result = getWeekRange(new Date('2025-01-15')); // Wednesday

      expect(result.startDate.getDay()).toBe(1); // Monday
    });
  });

  describe('getMonthRange', () => {
    it('should return start and end dates of current month', () => {
      const result = getMonthRange();

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
    });

    it('should return first day of month as start date', () => {
      const result = getMonthRange(new Date('2025-01-15'));

      expect(result.startDate.getDate()).toBe(1);
      expect(result.startDate.getMonth()).toBe(0); // January
    });
  });

  describe('getFiveMonthRange', () => {
    it('should return range covering last 5 months', () => {
      const result = getFiveMonthRange();

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.endDate.getTime()).toBeGreaterThan(result.startDate.getTime());
    });

    it('should start from first day of month 5 months ago', () => {
      const today = new Date('2025-06-15');
      const result = getFiveMonthRange(today);

      expect(result.startDate.getDate()).toBe(1);
      expect(result.startDate.getMonth()).toBe(0); // January (5 months before June)
    });
  });

  describe('formatDate', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date('2025-01-15');
      const result = formatDate(date);

      expect(result).toBe('2025-01-15');
    });

    it('should return null for null input', () => {
      const result = formatDate(null);

      expect(result).toBeNull();
    });
  });

  describe('getDateRange', () => {
    it('should return daily range', () => {
      const result = getDateRange('daily');

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.startDate.getHours()).toBe(0);
      expect(result.startDate.getMinutes()).toBe(0);
    });

    it('should return weekly range', () => {
      const result = getDateRange('weekly');

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
    });

    it('should return monthly range', () => {
      const result = getDateRange('monthly');

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
    });

    it('should return yearly range', () => {
      const result = getDateRange('yearly');

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.startDate.getMonth()).toBe(0);
      expect(result.startDate.getDate()).toBe(1);
    });

    it('should default to weekly for invalid range', () => {
      const result = getDateRange('invalid');

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
    });
  });
});

