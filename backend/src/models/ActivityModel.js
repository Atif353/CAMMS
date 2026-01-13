import prisma from '../config/prisma.js';

export const ActivityModel = {
  async create(activityData) {
    const activity = await prisma.activity.create({
      data: {
        instructorId: activityData.instructorId,
        activityTypeId: activityData.activityTypeId,
        title: activityData.title,
        description: activityData.description,
        courseCode: activityData.courseCode,
        timeSpentMinutes: activityData.timeSpentMinutes,
        activityDate: new Date(activityData.activityDate),
        meta: activityData.meta || {},
        status: activityData.status || 'COMPLETED',
      },
      include: {
        activityType: {
          select: {
            code: true,
            label: true,
          },
        },
        instructor: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      id: activity.id,
      instructor_id: activity.instructorId,
      activity_type_id: activity.activityTypeId,
      activity_type_code: activity.activityType.code,
      activity_type_label: activity.activityType.label,
      title: activity.title,
      description: activity.description,
      course_code: activity.courseCode,
      time_spent_minutes: activity.timeSpentMinutes,
      activity_date: activity.activityDate,
      meta: activity.meta,
      status: activity.status,
      is_deleted: activity.isDeleted,
      created_at: activity.createdAt,
      instructor_name: activity.instructor.name,
    };
  },

  async findById(id) {
    const activity = await prisma.activity.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        activityType: {
          select: {
            code: true,
            label: true,
          },
        },
        instructor: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!activity) return null;

    return {
      id: activity.id,
      instructor_id: activity.instructorId,
      activity_type_id: activity.activityTypeId,
      activity_type_code: activity.activityType.code,
      activity_type_label: activity.activityType.label,
      title: activity.title,
      description: activity.description,
      course_code: activity.courseCode,
      time_spent_minutes: activity.timeSpentMinutes,
      activity_date: activity.activityDate,
      meta: activity.meta,
      status: activity.status,
      is_deleted: activity.isDeleted,
      created_at: activity.createdAt,
      instructor_name: activity.instructor.name,
    };
  },

  async findByInstructor(instructorId, filters = {}) {
    const where = {
      isDeleted: false,
    };

    if (instructorId) {
      where.instructorId = instructorId;
    }

    if (filters.startDate) {
      where.activityDate = {
        ...where.activityDate,
        gte: new Date(filters.startDate),
      };
    }

    if (filters.endDate) {
      where.activityDate = {
        ...where.activityDate,
        lte: new Date(filters.endDate),
      };
    }

    if (filters.activityType) {
      where.activityType = {
        code: filters.activityType,
      };
    }

    if (filters.activityTypeId) {
      where.activityTypeId = filters.activityTypeId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      // When instructorId is set, only search in title, description, and courseCode
      // When instructorId is not set (admin view), also search by instructor name/email
      if (instructorId) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { courseCode: { contains: filters.search, mode: 'insensitive' } },
        ];
      } else {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { courseCode: { contains: filters.search, mode: 'insensitive' } },
          { instructor: { name: { contains: filters.search, mode: 'insensitive' } } },
          { instructor: { email: { contains: filters.search, mode: 'insensitive' } } },
        ];
      }
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        activityType: {
          select: {
            code: true,
            label: true,
          },
        },
        instructor: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { activityDate: 'desc' },
        { createdAt: 'desc' },
      ],
      take: filters.limit,
      skip: filters.offset,
    });

    return activities.map(activity => ({
      id: activity.id,
      instructor_id: activity.instructorId,
      activity_type_id: activity.activityTypeId,
      activity_type_code: activity.activityType.code,
      activity_type_label: activity.activityType.label,
      title: activity.title,
      description: activity.description,
      course_code: activity.courseCode,
      time_spent_minutes: activity.timeSpentMinutes,
      activity_date: activity.activityDate,
      meta: activity.meta,
      status: activity.status,
      is_deleted: activity.isDeleted,
      created_at: activity.createdAt,
      instructor_name: activity.instructor.name,
      instructor_email: activity.instructor.email,
    }));
  },

  async findByDateRange(startDate, endDate, instructorId = null) {
    const where = {
      activityDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      isDeleted: false,
    };

    if (instructorId) {
      where.instructorId = instructorId;
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        activityType: {
          select: {
            code: true,
            label: true,
          },
        },
        instructor: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { activityDate: 'desc' },
        { instructor: { name: 'asc' } },
      ],
    });

    return activities.map(activity => ({
      id: activity.id,
      instructor_id: activity.instructorId,
      activity_type_id: activity.activityTypeId,
      activity_type_code: activity.activityType.code,
      activity_type_label: activity.activityType.label,
      title: activity.title,
      description: activity.description,
      course_code: activity.courseCode,
      time_spent_minutes: activity.timeSpentMinutes,
      activity_date: activity.activityDate,
      meta: activity.meta,
      status: activity.status,
      is_deleted: activity.isDeleted,
      created_at: activity.createdAt,
      instructor_name: activity.instructor.name,
      instructor_email: activity.instructor.email,
    }));
  },

  async getAggregatedStats(startDate, endDate, instructorId = null) {
    const where = {
      activityDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      isDeleted: false,
    };

    if (instructorId) {
      where.instructorId = instructorId;
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        activityType: {
          select: {
            code: true,
          },
        },
      },
    });

    const stats = {};
    activities.forEach((activity) => {
      const type = activity.activityType.code;
      if (!stats[type]) {
        stats[type] = {
          count: 0,
          totalTimeSpent: 0,
          completedCount: 0,
          pendingCount: 0,
        };
      }
      stats[type].count++;
      stats[type].totalTimeSpent += activity.timeSpentMinutes;
      if (activity.status === 'COMPLETED') {
        stats[type].completedCount++;
      } else {
        stats[type].pendingCount++;
      }
    });

    return Object.entries(stats).map(([activity_type, data]) => ({
      activity_type,
      count: parseInt(data.count),
      total_time_spent: parseInt(data.totalTimeSpent),
      completed_count: parseInt(data.completedCount),
      pending_count: parseInt(data.pendingCount),
    }));
  },

  async update(id, updateData) {
    const data = {};

    if (updateData.title !== undefined) data.title = updateData.title;
    if (updateData.description !== undefined) data.description = updateData.description;
    if (updateData.courseCode !== undefined) data.courseCode = updateData.courseCode;
    if (updateData.timeSpentMinutes !== undefined) data.timeSpentMinutes = updateData.timeSpentMinutes;
    if (updateData.activityDate !== undefined) data.activityDate = new Date(updateData.activityDate);
    if (updateData.activityTypeId !== undefined) data.activityTypeId = updateData.activityTypeId;
    if (updateData.status !== undefined) data.status = updateData.status;
    if (updateData.meta !== undefined) data.meta = updateData.meta;

    const updated = await prisma.activity.update({
      where: { id },
      data,
      include: {
        activityType: {
          select: {
            code: true,
            label: true,
          },
        },
        instructor: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      id: updated.id,
      instructor_id: updated.instructorId,
      activity_type_id: updated.activityTypeId,
      activity_type_code: updated.activityType.code,
      activity_type_label: updated.activityType.label,
      title: updated.title,
      description: updated.description,
      course_code: updated.courseCode,
      time_spent_minutes: updated.timeSpentMinutes,
      activity_date: updated.activityDate,
      meta: updated.meta,
      status: updated.status,
      is_deleted: updated.isDeleted,
      created_at: updated.createdAt,
      instructor_name: updated.instructor.name,
    };
  },

  async delete(id) {
    return await prisma.activity.update({
      where: { id },
      data: { isDeleted: true },
      select: {
        id: true,
      },
    });
  },

  async countByInstructor(instructorId, filters = {}) {
    const where = {
      isDeleted: false,
    };

    if (instructorId) {
      where.instructorId = instructorId;
    }

    if (filters.startDate) {
      where.activityDate = {
        ...where.activityDate,
        gte: new Date(filters.startDate),
      };
    }

    if (filters.endDate) {
      where.activityDate = {
        ...where.activityDate,
        lte: new Date(filters.endDate),
      };
    }

    if (filters.activityType) {
      where.activityType = {
        code: filters.activityType,
      };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      // When instructorId is set, only search in title, description, and courseCode
      // When instructorId is not set (admin view), also search by instructor name/email
      if (instructorId) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { courseCode: { contains: filters.search, mode: 'insensitive' } },
        ];
      } else {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { courseCode: { contains: filters.search, mode: 'insensitive' } },
          { instructor: { name: { contains: filters.search, mode: 'insensitive' } } },
          { instructor: { email: { contains: filters.search, mode: 'insensitive' } } },
        ];
      }
    }

    return await prisma.activity.count({ where });
  },
};
