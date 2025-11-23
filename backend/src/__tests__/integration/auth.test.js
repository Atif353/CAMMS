import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../index.js';
import prisma from '../../config/prisma.js';

describe('Authentication API Integration Tests', () => {
  let testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    role: 'INSTRUCTOR',
  };

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('successfully');
      expect(response.body.data).toHaveProperty('email', testUser.email);
    });

    it('should reject duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect([400, 500]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect([401, 500]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });

    it('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect([401, 500]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });
});

