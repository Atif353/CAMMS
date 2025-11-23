import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../index.js';
import prisma from '../../config/prisma.js';

describe('Activities API Integration Tests', () => {
  let authToken;
  let testUser;
  let testActivity;

  beforeAll(async () => {
    await prisma.$connect();

    // Clean up any existing test user first
    await prisma.user.deleteMany({
      where: {
        email: 'instructor@test.com',
      },
    });

    // Use signup to create user with proper password hashing
    const signupResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test Instructor',
        email: 'instructor@test.com',
        password: 'password123',
        role: 'INSTRUCTOR',
      });

    // Then login to get the token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'instructor@test.com',
        password: 'password123',
      });

    if (loginResponse.status === 200 && loginResponse.body.data?.accessToken) {
      authToken = loginResponse.body.data.accessToken;
      testUser = loginResponse.body.data.user;
    } else {
      throw new Error(`Failed to authenticate test user: ${JSON.stringify(loginResponse.body)}`);
    }

    testActivity = {
      activityType: 'MDB_REPLY',
      title: 'Test Activity',
      description: 'Test description',
      timeSpentMinutes: 30,
      activityDate: new Date().toISOString().split('T')[0],
      status: 'COMPLETED',
    };
  });

  afterAll(async () => {
    if (testUser) {
      await prisma.activity.deleteMany({
        where: {
          instructorId: testUser.id,
        },
      });
    }
    await prisma.user.deleteMany({
      where: {
        email: 'instructor@test.com',
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/activities', () => {
    it('should create a new activity', async () => {
      const response = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testActivity);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(testActivity.title);
    });

    it('should reject activity without authentication', async () => {
      const response = await request(app)
        .post('/api/activities')
        .send(testActivity);

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/activities', () => {
    it('should get list of activities', async () => {
      const response = await request(app)
        .get('/api/activities')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body).toHaveProperty('pagination');
    });

    it('should filter activities by status', async () => {
      const response = await request(app)
        .get('/api/activities?status=COMPLETED')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});

