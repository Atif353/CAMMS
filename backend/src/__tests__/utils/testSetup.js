import { jest } from '@jest/globals';

export const setupTestMocks = () => {
  const mocks = {
    prisma: {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $transaction: jest.fn((callback) => {
        const tx = {
          activity: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn(), delete: jest.fn() },
          report: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn(), delete: jest.fn() },
          user: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
          role: { findUnique: jest.fn(), findMany: jest.fn() },
          activityType: { findUnique: jest.fn(), findMany: jest.fn() },
          setting: { findUnique: jest.fn(), update: jest.fn() },
        };
        return Promise.resolve(callback(tx));
      }),
      activity: {
        create: jest.fn(),
        findMany: jest.fn(() => Promise.resolve([])),
        findFirst: jest.fn(() => Promise.resolve(null)),
        findUnique: jest.fn(() => Promise.resolve(null)),
        update: jest.fn(),
        delete: jest.fn(),
      },
      report: {
        create: jest.fn(),
        findMany: jest.fn(() => Promise.resolve([])),
        findFirst: jest.fn(() => Promise.resolve(null)),
        findUnique: jest.fn(() => Promise.resolve(null)),
        update: jest.fn(),
        delete: jest.fn(),
      },
      user: {
        create: jest.fn(),
        findMany: jest.fn(() => Promise.resolve([])),
        findUnique: jest.fn(() => Promise.resolve(null)),
        findFirst: jest.fn(() => Promise.resolve(null)),
        update: jest.fn(),
      },
      role: {
        findUnique: jest.fn(() => Promise.resolve(null)),
        findMany: jest.fn(() => Promise.resolve([])),
      },
      activityType: {
        findUnique: jest.fn(() => Promise.resolve(null)),
        findMany: jest.fn(() => Promise.resolve([])),
      },
      setting: {
        findUnique: jest.fn(() => Promise.resolve(null)),
        update: jest.fn(),
      },
    },
  };

  return mocks;
};

export const resetAllMocks = (mocks) => {
  Object.values(mocks.prisma).forEach((value) => {
    if (typeof value === 'object' && value !== null) {
      Object.values(value).forEach((fn) => {
        if (typeof fn?.mockClear === 'function') {
          fn.mockClear();
        }
      });
    } else if (typeof value?.mockClear === 'function') {
      value.mockClear();
    }
  });
};
