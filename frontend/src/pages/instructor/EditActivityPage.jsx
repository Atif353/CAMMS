import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { activityApi } from '../../api/activityApi';
import { useToast } from '../../components/Toast';
import { FiFileText, FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiSave, FiEdit } from 'react-icons/fi';

const EditActivityPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    activityType: 'MDB_REPLY',
    title: '',
    description: '',
    courseCode: '',
    timeSpentMinutes: '',
    activityDate: new Date().toISOString().split('T')[0],
    status: 'COMPLETED',
    meta: {},
  });

  const activityTypeFields = {
    MDB_REPLY: ['topic', 'num_posts_replied'],
    TICKET_RESPONSE: ['ticket_id', 'resolution_status'],
    ASSIGNMENT_UPLOAD: ['file_name', 'deadline'],
    ASSIGNMENT_MARKING: ['num_assignments', 'average_score'],
    GDB_MARKING: ['num_posts_reviewed', 'topic'],
    WEEKLY_SESSION: ['attendance_count', 'participation_level'],
    EMAIL_RESPONSE: ['emails_sent', 'response_time'],
  };

  useEffect(() => {
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await activityApi.getById(id);
      const activity = response?.data?.data;
      
      if (!activity) {
        throw new Error('Activity not found');
      }
      
      const activityDate = activity.activityDate && activity.activityDate.includes('T') 
        ? activity.activityDate.split('T')[0] 
        : activity.activityDate || new Date().toISOString().split('T')[0];
      
      setFormData({
        activityType: activity.activityType || 'MDB_REPLY',
        title: activity.title || '',
        description: activity.description || '',
        courseCode: activity.courseCode || '',
        timeSpentMinutes: activity.timeSpentMinutes || 0,
        activityDate: activityDate,
        status: activity.status || 'COMPLETED',
        meta: activity.meta || {},
      });

      setTimeout(() => {
        if (activity.meta && typeof activity.meta === 'object') {
          Object.entries(activity.meta).forEach(([key, value]) => {
            const input = document.getElementById(`meta_${key}`);
            if (input && value !== null && value !== undefined) {
              input.value = value;
            }
          });
        }
      }, 100);
    } catch (error) {
      toast.error('Failed to load activity');
      navigate('/instructor/activities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const meta = {};
      const fields = activityTypeFields[formData.activityType] || [];
      fields.forEach((field) => {
        const value = document.getElementById(`meta_${field}`)?.value;
        if (value) {
          meta[field] = field.includes('num') || field.includes('count') || field.includes('time') 
            ? parseInt(value) 
            : value;
        }
      });

      const timeSpent = parseInt(formData.timeSpentMinutes) || 0;
      if (timeSpent < 0) {
        toast.error('Time spent cannot be negative');
        return;
      }
      
      await activityApi.update(id, {
        ...formData,
        timeSpentMinutes: timeSpent,
        meta,
      });

      toast.success('Activity updated successfully');
      setTimeout(() => {
        navigate('/instructor/activities');
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update activity');
    } finally {
      setSaving(false);
    }
  };

  const renderMetaFields = () => {
    const fields = activityTypeFields[formData.activityType] || [];
    return fields.map((field) => (
      <div key={field}>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          {field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </label>
        <input
          id={`meta_${field}`}
          type={field.includes('num') || field.includes('count') || field.includes('time') ? 'number' : 'text'}
          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300"
          placeholder={`Enter ${field.replace(/_/g, ' ')}`}
          defaultValue={formData.meta[field] || ''}
        />
      </div>
    ));
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiEdit className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Activity</h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Update activity details</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Activity Type
                </label>
                <select
                  value={formData.activityType}
                  onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300"
                  required
                >
                  <option value="MDB_REPLY">MDB Reply</option>
                  <option value="TICKET_RESPONSE">Ticket Response</option>
                  <option value="ASSIGNMENT_UPLOAD">Assignment Upload</option>
                  <option value="ASSIGNMENT_MARKING">Assignment Marking</option>
                  <option value="GDB_MARKING">GDB Marking</option>
                  <option value="WEEKLY_SESSION">Weekly Session</option>
                  <option value="EMAIL_RESPONSE">Email Response</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300"
                  placeholder="Enter activity title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300"
                  rows="4"
                  placeholder="Enter activity description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Course Code</label>
                <input
                  type="text"
                  value={formData.courseCode}
                  onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300"
                  placeholder="e.g., CS619"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                  <FiClock />
                  <span>Time Spent (minutes)</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.timeSpentMinutes}
                  onChange={(e) => setFormData({ ...formData, timeSpentMinutes: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                  <FiCalendar />
                  <span>Activity Date</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.activityDate}
                  onChange={(e) => setFormData({ ...formData, activityDate: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                  <FiCheckCircle />
                  <span>Status</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white transition-all duration-300"
                >
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>

            {renderMetaFields().length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderMetaFields()}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/instructor/activities')}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <FiXCircle />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave />
                    <span>Update Activity</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditActivityPage;


