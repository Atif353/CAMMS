import { ActivityModel } from '../models/ActivityModel.js';
import { ActivityTypeModel } from '../models/ActivityTypeModel.js';

export const ActivityService = {
  async createActivity(instructorId, activityData) {
    const {
      activityType,
      title,
      description,
      courseCode,
      timeSpentMinutes,
      activityDate,
      meta,
      status,
    } = activityData;

    // Get activity type
    const activityTypeRecord = await ActivityTypeModel.findByCode(activityType);
    if (!activityTypeRecord) {
      throw new Error('Invalid activity type');
    }

    // Create activity
    const activity = await ActivityModel.create({
      instructorId,
      activityTypeId: activityTypeRecord.id,
      title,
      description,
      courseCode,
      timeSpentMinutes,
      activityDate,
      meta: meta || {},
      status: status || 'COMPLETED',
    });

    return {
      id: activity.id,
      activityType: activityType,
      title: activity.title,
      description: activity.description,
      courseCode: activity.course_code,
      timeSpentMinutes: activity.time_spent_minutes,
      activityDate: activity.activity_date,
      meta: typeof activity.meta === 'string' ? JSON.parse(activity.meta) : activity.meta,
      status: activity.status,
      createdAt: activity.created_at,
    };
  },

  async getActivitiesByInstructor(instructorId, filters = {}) {
    const activities = await ActivityModel.findByInstructor(instructorId, filters);
    return activities.map((activity) => ({
      id: activity.id,
      activityType: activity.activity_type_code,
      activityTypeLabel: activity.activity_type_label,
      title: activity.title,
      description: activity.description,
      courseCode: activity.course_code,
      timeSpentMinutes: activity.time_spent_minutes,
      activityDate: activity.activity_date,
      meta: typeof activity.meta === 'string' ? JSON.parse(activity.meta) : activity.meta,
      status: activity.status,
      instructorName: activity.instructor_name,
      instructorEmail: activity.instructor_email,
      createdAt: activity.created_at,
    }));
  },

  async getActivityById(id) {
    const activity = await ActivityModel.findById(id);
    if (!activity) {
      throw new Error('Activity not found');
    }

    return {
      id: activity.id,
      activityType: activity.activity_type_code,
      activityTypeLabel: activity.activity_type_label,
      title: activity.title,
      description: activity.description,
      courseCode: activity.course_code,
      timeSpentMinutes: activity.time_spent_minutes,
      activityDate: activity.activity_date,
      meta: typeof activity.meta === 'string' ? JSON.parse(activity.meta) : activity.meta,
      status: activity.status,
      instructorName: activity.instructor_name,
      createdAt: activity.created_at,
    };
  },

  async updateActivity(id, instructorId, updateData, isAdmin = false) {
    const existingActivity = await ActivityModel.findById(id);
    if (!existingActivity) {
      throw new Error('Activity not found');
    }

    if (!isAdmin && existingActivity.instructor_id !== instructorId) {
      throw new Error('Unauthorized: You can only update your own activities');
    }

    const updatePayload = {};
    if (updateData.title !== undefined) updatePayload.title = updateData.title;
    if (updateData.description !== undefined) updatePayload.description = updateData.description;
    if (updateData.courseCode !== undefined) updatePayload.course_code = updateData.courseCode;
    if (updateData.timeSpentMinutes !== undefined) updatePayload.time_spent_minutes = updateData.timeSpentMinutes;
    if (updateData.activityDate !== undefined) updatePayload.activity_date = updateData.activityDate;
    if (updateData.meta !== undefined) updatePayload.meta = updateData.meta;
    if (updateData.status !== undefined) updatePayload.status = updateData.status;

    const activity = await ActivityModel.update(id, updatePayload);
    const activityType = await ActivityTypeModel.findById(activity.activity_type_id);

    return {
      id: activity.id,
      activityType: activityType.code,
      title: activity.title,
      description: activity.description,
      courseCode: activity.course_code,
      timeSpentMinutes: activity.time_spent_minutes,
      activityDate: activity.activity_date,
      meta: typeof activity.meta === 'string' ? JSON.parse(activity.meta) : activity.meta,
      status: activity.status,
    };
  },

  async deleteActivity(id, instructorId, isAdmin = false) {
    const existingActivity = await ActivityModel.findById(id);
    if (!existingActivity) {
      throw new Error('Activity not found');
    }

    if (!isAdmin && existingActivity.instructor_id !== instructorId) {
      throw new Error('Unauthorized: You can only delete your own activities');
    }

    const activity = await ActivityModel.delete(id);
    if (!activity) {
      throw new Error('Activity not found');
    }
    return { message: 'Activity deleted successfully' };
  },

  async countActivities(instructorId, filters = {}) {
    return await ActivityModel.countByInstructor(instructorId, filters);
  },
};

