import { jest } from '@jest/globals';

export const generateAccessToken = jest.fn();
export const generateRefreshToken = jest.fn();

export default {
  generateAccessToken,
  generateRefreshToken,
};

