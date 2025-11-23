import express from 'express';
import { DashboardController } from '../controllers/DashboardController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard data endpoints
 */

router.use(authMiddleware);

/**
 * @swagger
 * /dashboard/instructor:
 *   get:
 *     summary: Get instructor dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly, yearly]
 *           default: weekly
 *         description: Date range filter
 *     responses:
 *       200:
 *         description: Instructor dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                     charts:
 *                       type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/instructor', roleMiddleware('INSTRUCTOR'), DashboardController.getInstructorDashboard);

/**
 * @swagger
 * /dashboard/admin:
 *   get:
 *     summary: Get admin dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly, yearly]
 *           default: weekly
 *         description: Date range filter
 *     responses:
 *       200:
 *         description: Admin dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                     charts:
 *                       type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/admin', roleMiddleware('ADMIN'), DashboardController.getAdminDashboard);

export default router;

