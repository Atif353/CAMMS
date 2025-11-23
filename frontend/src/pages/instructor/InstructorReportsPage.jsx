import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { reportApi } from '../../api/reportApi';
import { useToast } from '../../components/Toast';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';
import { FiFileText, FiDownload, FiCalendar, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';

const InstructorReportsPage = () => {
  const [reportData, setReportData] = useState(null);
  const toast = useToast();
  const [previousReports, setPreviousReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingReports, setLoadingReports] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [formData, setFormData] = useState({
    reportType: '',
    startDate: '',
    endDate: '',
    format: 'pdf',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchPreviousReports();
  }, [currentPage]);

  const fetchPreviousReports = async () => {
    setLoadingReports(true);
    try {
      const response = await reportApi.getAll({ page: currentPage, limit: 10 });
      setPreviousReports(response.data.data || []);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching previous reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleGenerate = async () => {
    if (isGenerating || loading) return;
    
    setIsGenerating(true);
    setLoading(true);
    try {
      const response = await reportApi.generate({
        ...formData,
        format: formData.format || 'pdf',
      });

      if (response.isJson && response.data.success) {
        const jsonData = JSON.stringify(response.data.data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `report_${formData.reportType || 'CUSTOM'}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.warning(response.data.message || 'Report downloaded as JSON (Python service unavailable)');
      } else {
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `report_${formData.reportType || 'CUSTOM'}_${new Date().toISOString().split('T')[0]}.${formData.format === 'pdf' ? 'pdf' : 'xlsx'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success(`Report downloaded as ${formData.format.toUpperCase()}`);
      }
      
      fetchPreviousReports();
    } catch (error) {
      console.error('Generate error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  const handleExport = async (format, reportDataToExport = null) => {
    try {
      const dataToExport = reportDataToExport || {
        ...formData,
        reportId: reportData?.reportId || null,
      };
      
      const response = await reportApi.generateFile(dataToExport, format);

      if (response.isJson && response.data.success) {
        const jsonData = JSON.stringify(response.data.data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `report_${format}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.warning(response.data.message || 'Report downloaded as JSON (Python service unavailable)');
        return;
      }

      if (response.data instanceof Blob || response.data instanceof ArrayBuffer) {
        const blob = response.data instanceof Blob 
          ? response.data 
          : new Blob([response.data], {
              type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${dataToExport.reportType || 'REPORT'}_${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success(`Report exported as ${format.toUpperCase()}`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error.response?.data?.message || 'Failed to export report');
    }
  };

  const handleDownloadPrevious = async (report) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/reports/${report.id}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${report.reportType}_${format(new Date(report.createdAt), 'yyyy-MM-dd')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success('Report downloaded successfully');
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      toast.error('Failed to download report. File may not exist. Please regenerate the report.');
    }
  };

  const handleDelete = async (report) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This report will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
      color: document.documentElement.classList.contains('dark') ? '#fff' : '#545454',
    });

    if (result.isConfirmed) {
      try {
        await reportApi.delete(report.id);
        toast.success('Report has been deleted');
        fetchPreviousReports();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete report');
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiFileText className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Reports</h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Generate and export your activity reports</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <FiFileText />
              <span>Generate New Report</span>
            </h2>
          </div>

          <div className="p-8">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You can either select a <strong>Report Type</strong> (auto-calculates date range) 
                OR provide custom <strong>Start Date</strong> and <strong>End Date</strong>. 
                If both are provided, custom dates will be used.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                  <FiFileText />
                  <span>Report Type (Optional)</span>
                </label>
                <select
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value, startDate: '', endDate: '' })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Type (Optional)</option>
                  <option value="WEEKLY">Weekly Report</option>
                  <option value="MONTHLY">Monthly Report</option>
                  <option value="FIVE_MONTH">Five Month Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                  <FiCalendar />
                  <span>Start Date (Optional)</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value, reportType: '' })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                  <FiCalendar />
                  <span>End Date (Optional)</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value, reportType: '' })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center space-x-2">
                  <FiFileText />
                  <span>Export Format</span>
                </label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleGenerate}
                disabled={loading || isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FiFileText />
                    <span>Generate Report</span>
                  </>
                )}
              </button>
              {reportData && (
                <>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <FiDownload />
                    <span>Export PDF</span>
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <FiDownload />
                    <span>Export Excel</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {reportData && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 animate-slideUp">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <FiFileText className="text-blue-600" />
              <span>Report Summary</span>
            </h2>
            {reportData.instructorSummary?.map((instructor) => (
              <div
                key={instructor.instructorId}
                className="bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-xl p-6 border border-blue-100"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{instructor.name}</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Total Time</p>
                    <p className="text-xl font-bold text-blue-600">{instructor.overallTimeSpent} min</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Completed</p>
                    <p className="text-xl font-bold text-emerald-600">{instructor.completedActivities}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Pending</p>
                    <p className="text-xl font-bold text-red-600">{instructor.pendingActivities}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Activity Breakdown:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(instructor.totals || {}).map(([type, stats]) => (
                      <div key={type} className="bg-gray-50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                          {type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{stats.count} activities</p>
                        <p className="text-xs text-gray-500">{stats.timeSpent} min</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <FiFileText />
              <span>Previous Reports</span>
            </h2>
          </div>

          {loadingReports ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Report Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Date Range
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Generated At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                  {previousReports.map((report) => (
                    <tr key={report.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {report.reportType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                        <div className="flex items-center space-x-1">
                          <FiCalendar className="text-gray-400" />
                          <span>
                            {format(new Date(report.startDate), 'MMM dd')} - {format(new Date(report.endDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleDownloadPrevious(report)}
                            className="text-blue-600 hover:text-blue-900 font-semibold flex items-center space-x-1 transition-colors"
                          >
                            <FiDownload />
                            <span>Download</span>
                          </button>
                          <button
                            onClick={() => handleDelete(report)}
                            className="text-red-600 hover:text-red-900 font-semibold flex items-center space-x-1 transition-colors"
                          >
                            <FiTrash2 />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previousReports.length === 0 && !loadingReports && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFileText className="text-2xl text-blue-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">No previous reports found</p>
                  <p className="text-sm text-gray-500 mt-2">Generate a report to see it here</p>
                </div>
              )}
            </div>
          )}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </Layout>
  );
};

export default InstructorReportsPage;

