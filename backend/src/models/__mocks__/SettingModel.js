import { jest } from '@jest/globals';

export const SettingModel = {
  findByKey: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

export default SettingModel;

