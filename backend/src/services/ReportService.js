import { ReportModel } from "../models/ReportModel.js";
import { ActivityModel } from "../models/ActivityModel.js";
import {
  getWeekRange,
  getMonthRange,
  getFiveMonthRange,
  formatDate,
} from "../utils/dateUtils.js";
import { generateReportWithPython } from "../utils/pythonService.js";
import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "../../../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const ReportService = {
  resolveDateRange(reportType, startDate, endDate) {
    if (startDate && endDate) {
      return { startDate, endDate };
    }

    if (reportType) {
      switch (reportType) {
        case "WEEKLY":
          return getWeekRange();
        case "MONTHLY":
          return getMonthRange();
        case "FIVE_MONTH":
          return getFiveMonthRange();
        default:
          throw new Error("Invalid report type");
      }
    }

    return getWeekRange();
  },

  async buildReportSummary({
    reportType,
    instructorId,
    startDate,
    endDate,
    filters,
  }) {
    const dateRange = this.resolveDateRange(reportType, startDate, endDate);
    const start = formatDate(dateRange.startDate);
    const end = formatDate(dateRange.endDate);

    const activities = await ActivityModel.findByDateRange(
      start,
      end,
      instructorId || null
    );

    const instructorSummaryMap = {};

    activities.forEach((activity) => {
      const key = instructorId
        ? "single"
        : `${activity.instructor_id}_${activity.instructor_name}`;

      if (!instructorSummaryMap[key]) {
        instructorSummaryMap[key] = {
          instructorId: activity.instructor_id,
          name: activity.instructor_name,
          email: activity.instructor_email,
          totals: {},
          overallTimeSpent: 0,
          completedActivities: 0,
          pendingActivities: 0,
        };
      }

      const summary = instructorSummaryMap[key];
      const activityType = activity.activity_type_code;

      if (!summary.totals[activityType]) {
        summary.totals[activityType] = {
          count: 0,
          timeSpent: 0,
        };
      }

      const minutes = activity.time_spent_minutes || 0;
      summary.totals[activityType].count += 1;
      summary.totals[activityType].timeSpent += minutes;
      summary.overallTimeSpent += minutes;

      if (activity.status === "COMPLETED") {
        summary.completedActivities += 1;
      } else {
        summary.pendingActivities += 1;
      }
    });

    const instructorSummary = Object.values(instructorSummaryMap);

    return {
      reportType,
      startDate: start,
      endDate: end,
      instructorSummary,
      filters: filters || {},
      generatedAt: new Date().toISOString(),
    };
  },

  /**
   * Create a report DB record, optionally storing summarySnapshot in filters.
   * Uses transaction to prevent race conditions.
   */
  async createReportRecord(userId, params, summary) {
    const { reportType, instructorId, filters } = params;

    const mergedFilters = {
      ...(filters || {}),
      summarySnapshot: summary,
    };

    const reportRecord = await prisma.$transaction(async (tx) => {
      const thirtySecondsAgo = new Date(Date.now() - 30000);
      const startDateNormalized = new Date(summary.startDate);
      startDateNormalized.setHours(0, 0, 0, 0);
      const endDateNormalized = new Date(summary.endDate);
      endDateNormalized.setHours(0, 0, 0, 0);

      const where = {
        generatedBy: userId,
        createdAt: { gte: thirtySecondsAgo },
        startDate: startDateNormalized,
        endDate: endDateNormalized,
        reportType: reportType || null,
        instructorId: instructorId || null,
      };

      const existing = await tx.report.findFirst({
        where,
        orderBy: { createdAt: "desc" },
      });

      if (existing) {
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
      }

      const newReport = await tx.report.create({
        data: {
          generatedBy: userId,
          instructorId: instructorId || null,
          reportType: reportType || null,
          startDate: new Date(summary.startDate),
          endDate: new Date(summary.endDate),
          filters: mergedFilters,
        },
      });

      return {
        id: newReport.id,
        generated_by: newReport.generatedBy,
        instructor_id: newReport.instructorId,
        report_type: newReport.reportType,
        start_date: newReport.startDate,
        end_date: newReport.endDate,
        filters: newReport.filters,
        created_at: newReport.createdAt,
        file_path: newReport.filePath,
      };
    });

    return reportRecord;
  },

  async generateReport(userId, reportData) {
    const { reportType, instructorId, startDate, endDate, filters } =
      reportData;

    const summary = await this.buildReportSummary({
      reportType,
      instructorId,
      startDate,
      endDate,
      filters,
    });

    const reportRecord = await this.createReportRecord(
      userId,
      reportData,
      summary
    );

    return {
      ...summary,
      reportId: reportRecord.id,
    };
  },

  async generateReportFile(
    userId,
    reportData,
    outputFormat = "pdf",
    saveToDisk = true
  ) {
    const { reportType, instructorId, startDate, endDate, filters, reportId } =
      reportData;

    const summary = await this.buildReportSummary({
      reportType,
      instructorId,
      startDate,
      endDate,
      filters,
    });

    let reportRecord;
    if (reportId) {
      reportRecord = { id: reportId };
    } else {
      const existing = await ReportModel.findRecentDuplicate({
        generatedBy: userId,
        reportType: reportType || null,
        startDate: summary.startDate,
        endDate: summary.endDate,
        instructorId: instructorId || null,
      });

      if (existing) {
        reportRecord = existing;
      } else {
        reportRecord = await this.createReportRecord(
          userId,
          reportData,
          summary
        );
      }
    }

    const summaryWithId = {
      ...summary,
      reportId: reportRecord.id,
    };

    try {
      const fileBuffer = await generateReportWithPython(
        summaryWithId,
        reportType,
        outputFormat
      );

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const extension = outputFormat.toLowerCase() === "excel" ? "xlsx" : "pdf";
      const reportTypeLabel = reportType || "CUSTOM";
      const filename = `report_${reportTypeLabel}_${timestamp}.${extension}`;
      const filePath = path.join(uploadsDir, filename);

      if (saveToDisk) {
        fs.writeFileSync(filePath, fileBuffer);
        await ReportModel.updateFilePath(
          reportRecord.id,
          `uploads/${filename}`
        );
      }

      return {
        buffer: fileBuffer,
        filename,
        filePath: saveToDisk ? `uploads/${filename}` : null,
        mimeType:
          extension === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
    } catch (error) {
      console.error("Python service error:", error.message);
      console.error("Note: PDF/Excel reports require Python 3 with pandas, matplotlib, and openpyxl installed.");
      console.error("Falling back to JSON format. The system will continue to work normally.");
      return {
        data: summaryWithId,
        error: "Python service unavailable. PDF/Excel generation requires Python 3 with dependencies installed. Returning JSON data instead.",
      };
    }
  },

  /**
   * List reports for admin or instructor.
   */
  async getReports(filters = {}) {
    const reports = await ReportModel.findAll(filters);
    return reports.map((report) => ({
      id: report.id,
      reportType: report.report_type,
      startDate: report.start_date,
      endDate: report.end_date,
      instructorId: report.instructor_id,
      generatedBy: report.generated_by_name,
      createdAt: report.created_at,
      filePath: report.file_path,
    }));
  },

  /**
   * Get a single report's summary + basic metadata.
   * Prefer using stored summarySnapshot in filters; fallback to recompute.
   */
  async getReportById(id) {
    const report = await ReportModel.findById(id);
    if (!report) {
      throw new Error("Report not found");
    }

    let summarySnapshot = null;
    if (report.filters && typeof report.filters === "object") {
      summarySnapshot = report.filters.summarySnapshot || null;
    } else if (typeof report.filters === "string") {
      try {
        const parsed = JSON.parse(report.filters);
        summarySnapshot = parsed.summarySnapshot || null;
      } catch (e) {
        // ignore JSON error, fallback to recompute
      }
    }

    let summary;
    if (summarySnapshot) {
      summary = summarySnapshot;
    } else {
      // Fallback: recompute from activities
      summary = await this.buildReportSummary({
        reportType: report.report_type,
        instructorId: report.instructor_id,
        startDate: report.start_date,
        endDate: report.end_date,
        filters:
          typeof report.filters === "string"
            ? JSON.parse(report.filters)
            : report.filters,
      });
    }

    return {
      ...summary,
      reportId: report.id,
      generatedBy: report.generated_by_name,
      createdAt: report.created_at,
      filePath: report.file_path,
    };
  },

  async countReports(filters = {}) {
    return await ReportModel.count(filters);
  },

  async deleteReport(id, userId, userRole) {
    const report = await ReportModel.findById(id);
    if (!report) {
      throw new Error("Report not found");
    }

    if (report.generated_by !== userId && userRole !== "ADMIN") {
      throw new Error("Unauthorized: You can only delete your own reports");
    }

    if (report.file_path) {
      const filePath = path.join(__dirname, "../../../", report.file_path);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.error("Error deleting file:", error);
        }
      }
    }

    await ReportModel.delete(id);
    return { success: true };
  },
};
