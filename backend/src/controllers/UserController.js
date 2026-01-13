import { UserService } from '../services/UserService.js';

export const UserController = {
  async createUser(req, res, next) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllUsers(req, res, next) {
    try {
      const { role, search, page = 1, limit = 10 } = req.query;
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
      const offset = (pageNum - 1) * limitNum;

      const users = await UserService.getAllUsers({
        role,
        search,
        limit: limitNum,
        offset,
      });

      const total = await UserService.countUsers({ role, search });

      res.status(200).json({
        success: true,
        data: users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }
      const user = await UserService.getUserById(req.params.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }
      const result = await UserService.deleteUser(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};

