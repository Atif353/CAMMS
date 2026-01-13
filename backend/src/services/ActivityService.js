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

    const activityTypeRecord = await ActivityTypeModel.findByCode(activityType);
    if (!activityTypeRecord) {
      throw new Error('Invalid activity type');
    }

    let finalStatus = status;
    if (!title || !activityType || !description) {
      finalStatus = 'PENDING';
    }

    const activity = await ActivityModel.create({
      instructorId,
      activityTypeId: activityTypeRecord.id,
      title,
      description,
      courseCode,
      timeSpentMinutes: timeSpentMinutes || 0,
      activityDate,
      meta: meta || {},
      status: finalStatus || 'PENDING',
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
    const finalInstructorId = (instructorId !== null && instructorId !== undefined) ? instructorId : (filters.getAll ? null : instructorId);
    const activities = await ActivityModel.findByInstructor(finalInstructorId, filters);
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
    if (updateData.courseCode !== undefined) updatePayload.courseCode = updateData.courseCode;
    if (updateData.timeSpentMinutes !== undefined) updatePayload.timeSpentMinutes = updateData.timeSpentMinutes;
    if (updateData.activityDate !== undefined) updatePayload.activityDate = updateData.activityDate;
    if (updateData.meta !== undefined) updatePayload.meta = updateData.meta;
    if (updateData.status !== undefined) updatePayload.status = updateData.status;

    if (updateData.activityType !== undefined) {
      const activityTypeRecord = await ActivityTypeModel.findByCode(updateData.activityType);
      if (!activityTypeRecord) {
        throw new Error('Invalid activity type');
      }
      updatePayload.activity_type_id = activityTypeRecord.id;
    }

    const activity = await ActivityModel.update(id, updatePayload);
    const activityType = await ActivityTypeModel.findById(activity.activity_type_id);

    if (!activityType) {
      throw new Error('Activity type not found');
    }

    return {
      id: activity.id,
      activityType: activityType.code,
      activityTypeLabel: activityType.label,
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
    const finalInstructorId = (instructorId !== null && instructorId !== undefined) ? instructorId : (filters.getAll ? null : instructorId);
    return await ActivityModel.countByInstructor(finalInstructorId, filters);
  },
};

