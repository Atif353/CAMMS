import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PROJECT_ROOT } from '../config/paths.js';
import { UserModel } from '../models/UserModel.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(PROJECT_ROOT, 'uploads', 'Images');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    if (!req.user || !req.user.id) {
      return cb(new Error('User not authenticated'));
    }
    const ext = path.extname(file.originalname);
    cb(null, `profile-${req.user.id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
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

      if (!fs.existsSync(req.file.path)) {
        throw new Error('File was not saved by multer');
      }

      const oldUser = await UserModel.findById(req.user.id, true);
      if (oldUser?.profile_image) {
        const oldImagePath = oldUser.profile_image.startsWith('uploads/') 
          ? path.join(PROJECT_ROOT, oldUser.profile_image)
          : path.join(PROJECT_ROOT, 'uploads', 'Images', path.basename(oldUser.profile_image));
        if (fs.existsSync(oldImagePath) && oldImagePath !== req.file.path) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (deleteError) {
            console.error('Error deleting old image:', deleteError);
          }
        }
      }

      const imagePath = `uploads/Images/${req.file.filename}`;
      await UserModel.updateProfileImage(req.user.id, imagePath);

      res.status(200).json({
        success: true,
        message: 'Profile image uploaded successfully',
        data: {
          imagePath,
          filename: req.file.filename,
        },
      });
    } catch (error) {
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      }
      next(error);
    }
  });
};

