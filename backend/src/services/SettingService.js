import { SettingModel } from '../models/SettingModel.js';

export const SettingService = {
  async getSettings() {
    const settings = await SettingModel.findAll();
    const settingsObj = {};
    settings.forEach((setting) => {
      settingsObj[setting.key] = setting.value;
    });
    return settingsObj;
  },

  async getSetting(key) {
    const setting = await SettingModel.findByKey(key);
    if (!setting) {
      return null;
    }
    return {
      key: setting.key,
      value: setting.value,
    };
  },

  async updateSetting(key, value) {
    if (key === 'REMINDER_DAYS_BEFORE_DEADLINE') {
      const days = parseInt(value, 10);
      if (isNaN(days) || days < 1 || days > 30) {
        const error = new Error('Reminder days must be a number between 1 and 30');
        error.statusCode = 400;
        throw error;
      }
      value = days.toString();
    }

    const setting = await SettingModel.findByKey(key);
    if (setting) {
      await SettingModel.update(key, value);
    } else {
      await SettingModel.create(key, value);
    }
    return {
      key,
      value,
    };
  },

  async updateSettings(settingsData) {
    const results = {};
    for (const [key, value] of Object.entries(settingsData)) {
      results[key] = await this.updateSetting(key, value);
    }
    return results;
  },
};

