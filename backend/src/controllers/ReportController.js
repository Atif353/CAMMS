import { ReportService } from '../services/ReportService.js';
import fs from 'fs';
import path from 'path';
import { PROJECT_ROOT } from '../config/paths.js';

export const ReportController = {
  async generateReport(req, res, next) {
    try {
      const outputFormat = req.body.format || 'pdf';
      const reportType = req.body.reportType && req.body.reportType.trim() !== '' 
        ? req.body.reportType.trim() 
        : null;
      
      const reportData = {
        reportType,
        instructorId: req.user.role === 'ADMIN' ? req.body.instructorId || null : req.user.id,
        startDate: req.body.startDate || null,
        endDate: req.body.endDate || null,
        filters: req.body.filters || {},
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
        res.setHeader('Content-Length', result.buffer.length);
        res.setHeader('Cache-Control', 'no-cache');
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
        reportId: req.body.reportId || null,
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
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
      const offset = (pageNum - 1) * limitNum;

      const filters = {
        generatedBy: req.user.role === 'ADMIN' ? undefined : undefined,
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
      if (!req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Report ID is required',
        });
      }
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
      if (!req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Report ID is required',
        });
      }
      const report = await ReportService.getReportById(req.params.id);
      
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Report not found',
        });
      }

      if (req.user.role !== 'ADMIN') {
        if (report.instructor_id && report.instructor_id !== req.user.id) {
          return res.status(403).json({
            success: false,
            message: 'Unauthorized: You can only download reports for yourself',
          });
        }
      }
      
      if (!report.filePath) {
        return res.status(404).json({
          success: false,
          message: 'Report file not found. Please regenerate the report.',
        });
      }

      let filePath;
      if (report.filePath.startsWith('uploads/')) {
        filePath = path.join(PROJECT_ROOT, report.filePath);
      } else {
        filePath = path.join(PROJECT_ROOT, 'uploads', path.basename(report.filePath));
      }

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
      res.setHeader('Content-Length', fileBuffer.length);
      res.send(fileBuffer);
    } catch (error) {
      next(error);
    }
  },

  async deleteReport(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          success: false,
          message: 'Report ID is required',
        });
      }
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

