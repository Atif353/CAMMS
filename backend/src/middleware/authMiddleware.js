import { verifyToken } from '../utils/jwt.js';
import { UserModel } from '../models/UserModel.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyToken(token);
      const user = await UserModel.findById(decoded.sub);

      if (!user || !user.is_active) {
        return res.status(401).json({ message: 'User not found or inactive' });
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role_name,
      };

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

