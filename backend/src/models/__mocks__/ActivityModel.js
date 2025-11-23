import { jest } from '@jest/globals';

export const ActivityModel = {
  create: jest.fn(),
  findById: jest.fn(),
  findByInstructor: jest.fn(),
  findByDateRange: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export default ActivityModel;

