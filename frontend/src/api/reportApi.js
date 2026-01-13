import httpClient from './httpClient';

const handleReportResponse = async (response) => {
  const contentType = response.headers['content-type'] || '';
  
  if (contentType.includes('application/json')) {
    const text = await response.data.text();
    const jsonData = JSON.parse(text);
    return { ...response, data: jsonData, isJson: true };
  }
  
  return { ...response, isJson: false };
};

export const reportApi = {
  generate: async (data) => {
    try {
      const response = await httpClient.post('/reports/generate', data, {
        responseType: 'blob',
      });
      return handleReportResponse(response);
    } catch (error) {
      if (error.response?.data && error.response.data instanceof Blob) {
        const contentType = error.response.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
          const text = await error.response.data.text();
          try {
            const jsonData = JSON.parse(text);
            return { ...error.response, data: jsonData, isJson: true };
          } catch {
            throw error;
          }
        }
      }
      throw error;
    }
  },
  generateFile: async (data, format = 'pdf') => {
    try {
      const response = await httpClient.post(`/reports/generate-file?format=${format}`, data, {
        responseType: 'blob',
      });
      return handleReportResponse(response);
    } catch (error) {
      if (error.response?.data && error.response.data instanceof Blob) {
        const contentType = error.response.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
          const text = await error.response.data.text();
          try {
            const jsonData = JSON.parse(text);
            return { ...error.response, data: jsonData, isJson: true };
          } catch {
            throw error;
          }
        }
      }
      throw error;
    }
  },
  getAll: (params) => httpClient.get('/reports', { params }),
  getById: (id) => httpClient.get(`/reports/${id}`),
  delete: (id) => httpClient.delete(`/reports/${id}`),
  download: async (id) => {
    try {
      const response = await httpClient.get(`/reports/${id}/download`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      if (error.response?.data && error.response.data instanceof Blob) {
        const contentType = error.response.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
          const text = await error.response.data.text();
          try {
            const jsonData = JSON.parse(text);
            return { ...error.response, data: jsonData, isJson: true };
          } catch {
            throw error;
          }
        }
      }
      throw error;
    }
  },
};

