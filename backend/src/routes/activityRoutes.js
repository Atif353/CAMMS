import express from 'express';
import { ActivityController } from '../controllers/ActivityController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import Joi from 'joi';

const router = express.Router();

const createActivitySchema = Joi.object({
  activityType: Joi.string()
    .valid(
      'MDB_REPLY',
      'TICKET_RESPONSE',
      'ASSIGNMENT_UPLOAD',
      'ASSIGNMENT_MARKING',
      'GDB_MARKING',
      'WEEKLY_SESSION',
      'EMAIL_RESPONSE'
    )
    .required(),
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(1000).required(),
  courseCode: Joi.string().max(20).required(),
  timeSpentMinutes: Joi.number().integer().min(0),
  activityDate: Joi.date().required(),
  meta: Joi.object(),
  status: Joi.string().valid('COMPLETED', 'PENDING'),
});

const updateActivitySchema = Joi.object({
  title: Joi.string().min(3).max(200),
  description: Joi.string().max(1000),
  courseCode: Joi.string().max(20),
  timeSpentMinutes: Joi.number().integer().min(0),
  activityDate: Joi.date(),
  meta: Joi.object(),
  status: Joi.string().valid('COMPLETED', 'PENDING'),
});

/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: Activity management endpoints
 */

router.use(authMiddleware);

/**
 * @swagger
 * /activities:
 *   post:
 *     summary: Log a new activity
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Activity'
 *     responses:
 *       201:
 *         description: Activity created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', validateRequest(createActivitySchema), ActivityController.createActivity);

/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Get list of activities
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [COMPLETED, PENDING]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of activities
 *       401:
 *         description: Unauthorized
 */
router.get('/', ActivityController.getActivities);

/**
 * @swagger
 * /activities/{id}:
 *   get:
 *     summary: Get activity by ID
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Activity ID
 *     responses:
 *       200:
 *         description: Activity details
 *       404:
 *         description: Activity not found
 */
router.get('/:id', ActivityController.getActivityById);

/**
 * @swagger
 * /activities/{id}:
 *   put:
 *     summary: Update activity
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Activity'
 *     responses:
 *       200:
 *         description: Activity updated successfully
 *       404:
 *         description: Activity not found
 */
router.put('/:id', validateRequest(updateActivitySchema), ActivityController.updateActivity);

/**
 * @swagger
 * /activities/{id}/complete:
 *   patch:
 *     summary: Mark activity as completed
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Activity marked as completed
 */
router.patch('/:id/complete', ActivityController.markAsCompleted);

/**
 * @swagger
 * /activities/{id}:
 *   delete:
 *     summary: Delete activity
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Activity deleted successfully
 *       404:
 *         description: Activity not found
 */
router.delete('/:id', ActivityController.deleteActivity);

export default router;

