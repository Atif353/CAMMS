import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../index.js';
import prisma from '../../config/prisma.js';

describe('Dashboard API Integration Tests', () => {
  let instructorToken;
  let adminToken;
  let testInstructor;
  let testAdmin;

  beforeAll(async () => {
    await prisma.$connect();

    const instructorSignup = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test Instructor',
        email: 'instructor@dashboard.com',
        password: 'password123',
        role: 'INSTRUCTOR',
      });

    const instructorLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'instructor@dashboard.com',
        password: 'password123',
      });

    instructorToken = instructorLogin.body.data.accessToken;
    testInstructor = instructorLogin.body.data.user;

    const adminSignup = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test Admin',
        email: 'admin@dashboard.com',
        password: 'password123',
        role: 'ADMIN',
      });

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@dashboard.com',
        password: 'password123',
      });

    adminToken = adminLogin.body.data.accessToken;
    testAdmin = adminLogin.body.data.user;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['instructor@dashboard.com', 'admin@dashboard.com'],
        },
      },
    });
    await prisma.$disconnect();
  });

  describe('GET /api/dashboard/instructor', () => {
    it('should get instructor dashboard data', async () => {
      const response = await request(app)
        .get('/api/dashboard/instructor')
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('weekStats');
      expect(response.body.data).toHaveProperty('monthStats');
      expect(response.body.data).toHaveProperty('activityTypeCount');
      expect(response.body.data).toHaveProperty('dailyTimeSpent');
      expect(response.body.data).toHaveProperty('unreadNotifications');
      expect(response.body.data).toHaveProperty('weeklyTrends');
      expect(response.body.data).toHaveProperty('todayActivities');
      expect(response.body.data).toHaveProperty('completionRate');
    });

    it('should reject access without authentication', async () => {
      const response = await request(app)
        .get('/api/dashboard/instructor');

      expect(response.status).toBe(401);
    });

    it('should reject admin access to instructor dashboard', async () => {
      const response = await request(app)
        .get('/api/dashboard/instructor')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/dashboard/admin', () => {
    it('should get admin dashboard data', async () => {
      const response = await request(app)
        .get('/api/dashboard/admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalInstructors');
      expect(response.body.data).toHaveProperty('weekActivities');
      expect(response.body.data).toHaveProperty('activityDistribution');
      expect(response.body.data).toHaveProperty('dailyActivityTrend');
      expect(response.body.data).toHaveProperty('statusDistribution');
      expect(response.body.data).toHaveProperty('topInstructors');
      expect(response.body.data).toHaveProperty('todayActivities');
      expect(response.body.data).toHaveProperty('avgTimePerActivity');
      expect(response.body.data).toHaveProperty('totalTimeSpent');
    });

    it('should reject instructor access to admin dashboard', async () => {
      const response = await request(app)
        .get('/api/dashboard/admin')
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(response.status).toBe(403);
    });
  });
});

