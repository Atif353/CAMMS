import { ReportService } from '../services/ReportService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ReportController = {
  async generateReport(req, res, next) {
    try {
      const outputFormat = req.body.format || 'pdf';
      const reportData = {
        reportType: req.body.reportType || null,
        instructorId: req.user.role === 'ADMIN' ? req.body.instructorId || null : req.user.id,
        startDate: req.body.startDate || null,
        endDate: req.body.endDate || null,
        filters: req.body.filters || {},
      };

      // Generate report and file in one go - auto-download
      // This creates ONE record and returns the file
      const result = await ReportService.generateReportFile(
        req.user.id,
        reportData,
        outputFormat,
        true
      );

      if (result.buffer) {
        // Return file for download
        res.setHeader('Content-Type', result.mimeType);
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${result.filename}"`
        );
        res.setHeader('Content-Length', result.buffer.length);
        res.setHeader('Cache-Control', 'no-cache');
        res.send(result.buffer);
      } else if (result.data) {
        // Python unavailable - return JSON data instead
        res.status(200).json({
          success: true,
          message: result.error || 'Report generated in JSON format (Python service unavailable)',
          data: result.data,
          format: 'json',
        });
      } else {
        // If file generation fails completely
        res.status(500).json({
          success: false,
          message: result.error || 'Failed to generate report file',
        });
      }
    } catch (error) {
      next(error);
    }
  },

  async generateReportFile(req, res, next) {
    try {
      const outputFormat = req.query.format || 'pdf';
      const reportData = {
        reportType: req.body.reportType,
        instructorId: req.user.role === 'ADMIN' ? req.body.instructorId || null : req.user.id,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        filters: req.body.filters,
        reportId: req.body.reportId || null, // Reuse existing report if provided
      };

      const result = await ReportService.generateReportFile(
        req.user.id,
        reportData,
        outputFormat,
        true
      );

      if (result.buffer) {
        res.setHeader('Content-Type', result.mimeType);
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${result.filename}"`
        );
        res.send(result.buffer);
      } else if (result.data) {
        res.status(200).json({
          success: true,
          message: result.error || 'Report generated in JSON format (Python service unavailable)',
          data: result.data,
          format: 'json',
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.error || 'Failed to generate report',
        });
      }
    } catch (error) {
      next(error);
    }
  },

  async getReports(req, res, next) {
    try {
      const { reportType, instructorId, page = 1, limit = 10 } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;

      const filters = {
        generatedBy: req.user.role === 'ADMIN' ? undefined : req.user.id,
        reportType,
        instructorId: req.user.role === 'ADMIN' ? instructorId : req.user.id,
        limit: limitNum,
        offset,
      };

      const reports = await ReportService.getReports(filters);
      const total = await ReportService.countReports(filters);

      res.status(200).json({
        success: true,
        data: reports,
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

  async getReportById(req, res, next) {
    try {
      const report = await ReportService.getReportById(req.params.id);
      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  },

  async downloadReport(req, res, next) {
    try {
      const report = await ReportService.getReportById(req.params.id);
      
      if (!report.filePath) {
        return res.status(404).json({
          success: false,
          message: 'Report file not found. Please regenerate the report.',
        });
      }

      const filePath = path.join(__dirname, '../../..', report.filePath);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'Report file not found on disk',
        });
      }

      const fileBuffer = fs.readFileSync(filePath);
      const filename = path.basename(filePath);
      const ext = path.extname(filename);
      const mimeType = ext === '.pdf' 
        ? 'application/pdf' 
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(fileBuffer);
    } catch (error) {
      next(error);
    }
  },

  async deleteReport(req, res, next) {
    try {
      await ReportService.deleteReport(req.params.id, req.user.id, req.user.role);
      res.status(200).json({
        success: true,
        message: 'Report deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

