import { jest } from '@jest/globals';

export const ReportModel = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateFilePath: jest.fn(),
  delete: jest.fn(),
  findRecentDuplicate: jest.fn(),
};

export default ReportModel;

