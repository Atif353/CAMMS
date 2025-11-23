import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { activityApi } from '../../api/activityApi';
import { useToast } from '../../components/Toast';
import { FiFileText, FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiSave, FiZap } from 'react-icons/fi';

const LogActivityPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
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

  const activityTemplates = {
    MDB_REPLY: {
      title: 'MDB Discussion Reply',
      description: 'Replied to student queries in MDB discussion forum',
    },
    TICKET_RESPONSE: {
      title: 'Ticket Resolution',
      description: 'Resolved student support ticket',
    },
    ASSIGNMENT_UPLOAD: {
      title: 'Assignment Upload',
      description: 'Uploaded assignment materials for students',
    },
    ASSIGNMENT_MARKING: {
      title: 'Assignment Grading',
      description: 'Graded and provided feedback on student assignments',
    },
    GDB_MARKING: {
      title: 'GDB Review',
      description: 'Reviewed and marked GDB submissions',
    },
    WEEKLY_SESSION: {
      title: 'Weekly Session',
      description: 'Conducted weekly session with students',
    },
    EMAIL_RESPONSE: {
      title: 'Email Response',
      description: 'Responded to student emails',
    },
  };

  const applyTemplate = () => {
    const template = activityTemplates[formData.activityType];
    if (template) {
      setFormData({
        ...formData,
        title: template.title,
        description: template.description,
      });
    }
  };

  const activityTypeFields = {
    MDB_REPLY: ['topic', 'num_posts_replied'],
    TICKET_RESPONSE: ['ticket_id', 'resolution_status'],
    ASSIGNMENT_UPLOAD: ['file_name', 'deadline'],
    ASSIGNMENT_MARKING: ['num_assignments', 'average_score'],
    GDB_MARKING: ['num_posts_reviewed', 'topic'],
    WEEKLY_SESSION: ['attendance_count', 'participation_level'],
    EMAIL_RESPONSE: ['emails_sent', 'response_time'],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      await activityApi.create({
        ...formData,
        timeSpentMinutes: parseInt(formData.timeSpentMinutes),
        meta,
      });

      toast.success('Activity logged successfully');
      setTimeout(() => {
        navigate('/instructor/activities');
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to log activity');
    } finally {
      setLoading(false);
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
        />
      </div>
    ));
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiFileText className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Log Activity</h1>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Record your daily activities and track your progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                  <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Activity Type
                  </label>
                  <button
                    type="button"
                    onClick={applyTemplate}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 transition-colors"
                  >
                    <FiZap className="text-sm" />
                    <span>Use Template</span>
                  </button>
                </div>
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
                  placeholder="Enter time in minutes"
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

            {/* Dynamic Meta Fields */}
            {renderMetaFields().length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
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
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <FiXCircle />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Logging...</span>
                  </>
                ) : (
                  <>
                    <FiSave />
                    <span>Log Activity</span>
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

export default LogActivityPage;

