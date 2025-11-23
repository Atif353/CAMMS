import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { UserModel } from '../models/UserModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../frontend/public/assets');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (req.user && req.user.id) {
      cb(null, `profile-${req.user.id}${ext}`);
    } else {
      const tempName = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
      cb(null, tempName);
    }
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  },
}).single('profileImage');

export const uploadProfileImage = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    try {
      if (!req.user || !req.user.id) {
        throw new Error('User not authenticated');
      }

      const ext = path.extname(req.file.originalname);
      const finalFilename = `profile-${req.user.id}${ext}`;
      const finalPath = path.join(__dirname, '../../../frontend/public/assets', finalFilename);

      const fileExists = fs.existsSync(req.file.path);


      if (!fileExists) {
        throw new Error('File was not saved by multer');
      }

      if (req.file.filename !== finalFilename) {
        fs.renameSync(req.file.path, finalPath);

      }

      const finalExists = fs.existsSync(finalPath);


      if (!finalExists) {
        throw new Error('File not found at final path');
      }

      const oldUser = await UserModel.findById(req.user.id);
      if (oldUser?.profile_image && oldUser.profile_image !== `/assets/${finalFilename}`) {
        const oldImagePath = path.join(__dirname, '../../../frontend/public', oldUser.profile_image);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);

          } catch (deleteError) {
            console.error('⚠️ Error deleting old image:', deleteError);
          }
        }
      }

      const imagePath = `/assets/${finalFilename}`;
      await UserModel.updateProfileImage(req.user.id, imagePath);


      res.status(200).json({
        success: true,
        message: 'Profile image uploaded successfully',
        data: {
          imagePath,
          filename: finalFilename,
        },
      });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  });
};

