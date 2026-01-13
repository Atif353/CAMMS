import prisma from "../config/prisma.js";

export const ReportModel = {
  async create(reportData) {
    const normalizedReportType = reportData.reportType && reportData.reportType.trim() !== "" 
      ? reportData.reportType.trim() 
      : "CUSTOM";
    
    const report = await prisma.report.create({
      data: {
        generatedBy: reportData.generatedBy,
        instructorId: reportData.instructorId || null,
        reportType: normalizedReportType,
        startDate: new Date(reportData.startDate),
        endDate: new Date(reportData.endDate),
        filters: reportData.filters || {},
      },
    });

    return {
      id: report.id,
      generated_by: report.generatedBy,
      instructor_id: report.instructorId,
      report_type: report.reportType,
      start_date: report.startDate,
      end_date: report.endDate,
      filters: report.filters,
      created_at: report.createdAt,
      file_path: report.filePath,
    };
  },

  async findById(id) {
    const reportId = parseInt(id, 10);
    if (isNaN(reportId)) {
      return null;
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        generatedByUser: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!report) return null;

    return {
      id: report.id,
      generated_by: report.generatedBy,
      instructor_id: report.instructorId,
      report_type: report.reportType,
      start_date: report.startDate,
      end_date: report.endDate,
      filters: report.filters,
      created_at: report.createdAt,
      file_path: report.filePath,
      generated_by_name: report.generatedByUser?.name,
    };
  },

  async findAll(filters = {}) {
    const where = {};

    if (filters.generatedBy) {
      where.generatedBy = filters.generatedBy;
    }

    if (filters.instructorId) {
      where.instructorId = filters.instructorId;
    }

    if (filters.reportType) {
      where.reportType = filters.reportType;
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
        generatedByUser: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: filters.limit,
      skip: filters.offset,
    });

    return reports.map((report) => ({
      id: report.id,
      generated_by: report.generatedBy,
      instructor_id: report.instructorId,
      report_type: report.reportType,
      start_date: report.startDate,
      end_date: report.endDate,
      filters: report.filters,
      created_at: report.createdAt,
      file_path: report.filePath,
      generated_by_name: report.generatedByUser?.name,
    }));
  },

  async count(filters = {}) {
    const where = {};

    if (filters.generatedBy) {
      where.generatedBy = filters.generatedBy;
    }

    if (filters.instructorId) {
      where.instructorId = filters.instructorId;
    }

    if (filters.reportType) {
      where.reportType = filters.reportType;
    }

    return await prisma.report.count({ where });
  },

  async updateFilePath(id, filePath) {
    const reportId = parseInt(id, 10);
    if (isNaN(reportId)) {
      throw new Error("Invalid report ID");
    }

    return await prisma.report.update({
      where: { id: reportId },
      data: { filePath },
    });
  },

  async delete(id) {
    const reportId = parseInt(id, 10);
    if (isNaN(reportId)) {
      throw new Error("Invalid report ID");
    }

    return await prisma.report.delete({
      where: { id: reportId },
    });
  },

  async findRecentDuplicate({
    generatedBy,
    reportType,
    startDate,
    endDate,
    instructorId,
  }) {
    const thirtySecondsAgo = new Date(Date.now() - 30000);

    const startDateNormalized = new Date(startDate);
    startDateNormalized.setHours(0, 0, 0, 0);
    const endDateNormalized = new Date(endDate);
    endDateNormalized.setHours(0, 0, 0, 0);

    const where = {
      generatedBy,
      createdAt: { gte: thirtySecondsAgo },
      startDate: startDateNormalized,
      endDate: endDateNormalized,
    };

    const normalizedReportType = reportType && reportType.trim() !== "" ? reportType.trim() : "CUSTOM";
    where.reportType = normalizedReportType;

    if (instructorId) {
      where.instructorId = instructorId;
    } else {
      where.instructorId = null;
    }

    const existing = await prisma.report.findFirst({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!existing) return null;

    return {
      id: existing.id,
      generated_by: existing.generatedBy,
      instructor_id: existing.instructorId,
      report_type: existing.reportType,
      start_date: existing.startDate,
      end_date: existing.endDate,
      filters: existing.filters,
      created_at: existing.createdAt,
      file_path: existing.filePath,
    };
  },
};
