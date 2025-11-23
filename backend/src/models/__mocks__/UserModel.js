import { jest } from '@jest/globals';

export const UserModel = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  updateProfileImage: jest.fn(),
  update: jest.fn(),
};

export default UserModel;

