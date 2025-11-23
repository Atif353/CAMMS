import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { settingApi } from '../../api/settingApi';
import { useToast } from '../../components/Toast';
import { FiSettings, FiSave, FiAlertTriangle, FiPower, FiBell } from 'react-icons/fi';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    MAINTENANCE_MODE: 'false',
    REMINDER_DAYS_BEFORE_DEADLINE: '2',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingApi.getAll();
      setSettings({ ...settings, ...response.data.data });
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate REMINDER_DAYS_BEFORE_DEADLINE before saving
    const reminderDays = parseInt(settings.REMINDER_DAYS_BEFORE_DEADLINE, 10);
    if (isNaN(reminderDays) || reminderDays < 1 || reminderDays > 30) {
      toast.error('Reminder days must be a number between 1 and 30');
      // Reset to default if invalid
      setSettings({ ...settings, REMINDER_DAYS_BEFORE_DEADLINE: '2' });
      return;
    }

    setSaving(true);
    try {
      await settingApi.update(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update settings';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <FiSettings className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Configure system-wide settings and preferences</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 space-y-6">
          <div className={`rounded-lg p-6 border-2 transition-all duration-300 ${
            settings.MAINTENANCE_MODE === 'true' 
              ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700' 
              : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                settings.MAINTENANCE_MODE === 'true'
                  ? 'bg-amber-500 dark:bg-amber-600'
                  : 'bg-blue-600 dark:bg-blue-500'
              }`}>
                {settings.MAINTENANCE_MODE === 'true' ? (
                  <FiAlertTriangle className="text-white text-xl" />
                ) : (
                  <FiPower className="text-white text-xl" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Maintenance Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {settings.MAINTENANCE_MODE === 'true' 
                    ? 'System is currently in maintenance mode' 
                    : 'System is operational'}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                Enable Maintenance Mode
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="maintenance"
                    value="false"
                    checked={settings.MAINTENANCE_MODE === 'false'}
                    onChange={(e) => setSettings({ ...settings, MAINTENANCE_MODE: e.target.value })}
                    className="w-4 h-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Disabled</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="maintenance"
                    value="true"
                    checked={settings.MAINTENANCE_MODE === 'true'}
                    onChange={(e) => setSettings({ ...settings, MAINTENANCE_MODE: e.target.value })}
                    className="w-4 h-4 text-amber-600 dark:text-amber-400 focus:ring-amber-500 dark:focus:ring-amber-400 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Enabled</span>
                </label>
              </div>
              <div className={`mt-4 p-4 rounded-lg ${
                settings.MAINTENANCE_MODE === 'true'
                  ? 'bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700'
                  : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
              }`}>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {settings.MAINTENANCE_MODE === 'true' ? (
                    <>
                      <strong className="text-amber-800 dark:text-amber-300">Warning:</strong> When maintenance mode is enabled, 
                      users and instructors will not be able to log in. Only administrators can access the system.
                    </>
                  ) : (
                    <>
                      System is operational. All users and instructors can log in normally.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Notification Alert Days Setting */}
          <div className="rounded-lg p-6 border-2 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <FiBell className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Notification Alert Days</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Set how many days before an activity deadline instructors receive alerts
                </p>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                Days Before Activity Deadline
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.REMINDER_DAYS_BEFORE_DEADLINE || '2'}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers between 1 and 30
                    const numValue = parseInt(value, 10);
                    if (value === '') {
                      // Allow empty temporarily while typing
                      setSettings({ ...settings, REMINDER_DAYS_BEFORE_DEADLINE: '' });
                    } else if (!isNaN(numValue) && numValue >= 1 && numValue <= 30) {
                      setSettings({ ...settings, REMINDER_DAYS_BEFORE_DEADLINE: value });
                    }
                  }}
                  onBlur={(e) => {
                    // Ensure a valid value on blur
                    const value = e.target.value;
                    const numValue = parseInt(value, 10);
                    if (value === '' || isNaN(numValue) || numValue < 1) {
                      setSettings({ ...settings, REMINDER_DAYS_BEFORE_DEADLINE: '2' });
                    } else if (numValue > 30) {
                      setSettings({ ...settings, REMINDER_DAYS_BEFORE_DEADLINE: '30' });
                    }
                  }}
                  className="w-24 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold text-center"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {settings.REMINDER_DAYS_BEFORE_DEADLINE === '1' ? 'day' : 'days'} before deadline
                </span>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  <strong className="text-purple-800 dark:text-purple-300">Info:</strong> Instructors will receive notification alerts for pending activities 
                  {settings.REMINDER_DAYS_BEFORE_DEADLINE ? ` ${settings.REMINDER_DAYS_BEFORE_DEADLINE} ${settings.REMINDER_DAYS_BEFORE_DEADLINE === '1' ? 'day' : 'days'}` : ' 2 days'} before the activity deadline. 
                  You can set this between 1 and 30 days.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <FiSave />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
