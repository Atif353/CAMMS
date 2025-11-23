import { ActivityService } from '../services/ActivityService.js';

export const ActivityController = {
  async createActivity(req, res, next) {
    try {
      const activity = await ActivityService.createActivity(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Activity logged successfully',
        data: activity,
      });
    } catch (error) {
      next(error);
    }
  },

  async getActivities(req, res, next) {
    try {
      const { startDate, endDate, activityType, status, instructorId, search, page = 1, limit = 10 } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;

      const isAdmin = req.user.role === 'ADMIN';
      const instructorIdFilter = isAdmin ? (instructorId || null) : req.user.id;

      const activities = await ActivityService.getActivitiesByInstructor(instructorIdFilter, {
        startDate,
        endDate,
        activityType,
        status,
        search,
        limit: limitNum,
        offset,
        getAll: isAdmin,
      });

      const total = await ActivityService.countActivities(instructorIdFilter, {
        startDate,
        endDate,
        activityType,
        status,
        search,
        getAll: isAdmin,
      });

      res.status(200).json({
        success: true,
        data: activities,
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

  async getActivityById(req, res, next) {
    try {
      const activity = await ActivityService.getActivityById(req.params.id);
      res.status(200).json({
        success: true,
        data: activity,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateActivity(req, res, next) {
    try {
      const isAdmin = req.user.role === 'ADMIN';
      const instructorId = isAdmin ? null : req.user.id;
      const activity = await ActivityService.updateActivity(req.params.id, instructorId, req.body, isAdmin);
      res.status(200).json({
        success: true,
        message: 'Activity updated successfully',
        data: activity,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteActivity(req, res, next) {
    try {
      const isAdmin = req.user.role === 'ADMIN';
      const instructorId = isAdmin ? null : req.user.id;
      const result = await ActivityService.deleteActivity(req.params.id, instructorId, isAdmin);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },

  async markAsCompleted(req, res, next) {
    try {
      const isAdmin = req.user.role === 'ADMIN';
      const instructorId = isAdmin ? null : req.user.id;
      const activity = await ActivityService.updateActivity(req.params.id, instructorId, { status: 'COMPLETED' }, isAdmin);
      res.status(200).json({
        success: true,
        message: 'Activity marked as completed',
        data: activity,
      });
    } catch (error) {
      next(error);
    }
  },
};

