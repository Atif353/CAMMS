import { jest } from '@jest/globals';

const mockPrisma = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $transaction: jest.fn((callback) => Promise.resolve(callback({}))),
  activity: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  activityType: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  role: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  setting: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
  },
  report: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  notification: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

export default mockPrisma;

