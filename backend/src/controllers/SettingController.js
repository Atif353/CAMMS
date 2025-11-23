import { SettingService } from '../services/SettingService.js';

export const SettingController = {
  async getSettings(req, res, next) {
    try {
      const settings = await SettingService.getSettings();
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateSettings(req, res, next) {
    try {
      const settings = await SettingService.updateSettings(req.body);
      res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  },
};

