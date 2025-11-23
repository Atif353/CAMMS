import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ReportService } from '../../services/ReportService.js';

describe('ReportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('resolveDateRange', () => {
    it('should return custom dates when provided', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      const result = ReportService.resolveDateRange('MONTHLY', startDate, endDate);

      expect(result.startDate).toEqual(startDate);
      expect(result.endDate).toEqual(endDate);
    });

    it('should return weekly range for WEEKLY type', () => {
      const result = ReportService.resolveDateRange('WEEKLY', null, null);

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
      expect(result.endDate.getTime()).toBeGreaterThan(result.startDate.getTime());
      const daysDiff = (result.endDate.getTime() - result.startDate.getTime()) / (1000 * 60 * 60 * 24);
      expect(daysDiff).toBeGreaterThanOrEqual(6);
      expect(daysDiff).toBeLessThanOrEqual(7);
    });

    it('should return monthly range for MONTHLY type', () => {
      const result = ReportService.resolveDateRange('MONTHLY', null, null);

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
      expect(result.endDate.getTime()).toBeGreaterThan(result.startDate.getTime());
      const daysDiff = (result.endDate.getTime() - result.startDate.getTime()) / (1000 * 60 * 60 * 24);
      expect(daysDiff).toBeGreaterThanOrEqual(27);
      expect(daysDiff).toBeLessThanOrEqual(31);
    });

    it('should return five-month range for FIVE_MONTH type', () => {
      const result = ReportService.resolveDateRange('FIVE_MONTH', null, null);

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
      expect(result.endDate.getTime()).toBeGreaterThan(result.startDate.getTime());
      const daysDiff = (result.endDate.getTime() - result.startDate.getTime()) / (1000 * 60 * 60 * 24);
      expect(daysDiff).toBeGreaterThanOrEqual(140);
      expect(daysDiff).toBeLessThanOrEqual(155);
    });

    it('should default to weekly if no type provided', () => {
      const result = ReportService.resolveDateRange(null, null, null);

      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
    });
  });
});
