import express from 'express';
import { ReportController } from '../controllers/ReportController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import Joi from 'joi';

const router = express.Router();

const generateReportSchema = Joi.object({
  reportType: Joi.string().valid('WEEKLY', 'MONTHLY', 'FIVE_MONTH').allow('', null).optional(),
  instructorId: Joi.string().uuid().allow(null, '').optional(),
  startDate: Joi.alternatives().try(
    Joi.date().iso(),
    Joi.string().allow('', null),
    Joi.valid(null, '')
  ).optional(),
  endDate: Joi.alternatives().try(
    Joi.date().iso(),
    Joi.string().allow('', null),
    Joi.valid(null, '')
  ).optional(),
  filters: Joi.object().optional(),
  format: Joi.string().valid('pdf', 'excel').optional(),
}).custom((value, helpers) => {
  const hasReportType = value.reportType && value.reportType !== '';
  const hasDates = value.startDate && value.startDate !== '' && value.endDate && value.endDate !== '';
  
  if (!hasReportType && !hasDates) {
    return helpers.error('any.custom', {
      message: 'Either reportType or both startDate and endDate must be provided'
    });
  }
  
  return value;
});

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report generation and management endpoints
 */

router.use(authMiddleware);

/**
 * @swagger
 * /reports/generate:
 *   post:
 *     summary: Generate and download report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportType:
 *                 type: string
 *                 enum: [WEEKLY, MONTHLY, FIVE_MONTH]
 *               instructorId:
 *                 type: string
 *                 format: uuid
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               format:
 *                 type: string
 *                 enum: [pdf, excel]
 *                 default: pdf
 *     responses:
 *       200:
 *         description: Report file downloaded
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Validation error
 */
router.post('/generate', validateRequest(generateReportSchema), ReportController.generateReport);

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get list of reports
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 */
router.get('/', ReportController.getReports);

/**
 * @swagger
 * /reports/{id}:
 *   get:
 *     summary: Get report by ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Report details
 *       404:
 *         description: Report not found
 */
router.get('/:id', ReportController.getReportById);

/**
 * @swagger
 * /reports/{id}/download:
 *   get:
 *     summary: Download report file
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Report file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/:id/download', ReportController.downloadReport);

/**
 * @swagger
 * /reports/{id}:
 *   delete:
 *     summary: Delete report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Report deleted successfully
 */
router.delete('/:id', ReportController.deleteReport);

export default router;

