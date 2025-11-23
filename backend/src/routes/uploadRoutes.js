import express from 'express';
import { uploadProfileImage } from '../controllers/UploadController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload endpoints
 */

router.use(authMiddleware);

/**
 * @swagger
 * /upload/profile-image:
 *   post:
 *     summary: Upload profile image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profileImage
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpeg, jpg, png, gif, webp, max 5MB)
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     imagePath:
 *                       type: string
 *                     filename:
 *                       type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/profile-image', uploadProfileImage);

export default router;

