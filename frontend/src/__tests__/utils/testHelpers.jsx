import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { render } from '@testing-library/react';

export const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test Instructor',
  email: 'test@example.com',
  role: 'INSTRUCTOR',
  profile_image: null,
};

export const mockAdmin = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Test Admin',
  email: 'admin@example.com',
  role: 'ADMIN',
  profile_image: null,
};

export const mockActivity = {
  id: '123e4567-e89b-12d3-a456-426614174002',
  activityType: 'MDB_REPLY',
  activityTypeLabel: 'MDB Reply',
  title: 'Test MDB Reply',
  description: 'Test description',
  courseCode: 'CS101',
  timeSpentMinutes: 30,
  activityDate: '2025-01-15',
  status: 'COMPLETED',
  createdAt: '2025-01-15T10:00:00Z',
};

export const mockActivities = [
  { ...mockActivity, id: '1', activityType: 'TICKET_RESPONSE', title: 'Ticket Response 1' },
  { ...mockActivity, id: '2', activityType: 'GDB_MARKING', title: 'GDB Marking 1' },
  { ...mockActivity, id: '3', activityType: 'ASSIGNMENT_MARKING', title: 'Assignment Marking 1' },
  { ...mockActivity, id: '4', activityType: 'EMAIL_RESPONSE', title: 'Email Response 1' },
  { ...mockActivity, id: '5', activityType: 'WEEKLY_SESSION', title: 'Weekly Session 1' },
  { ...mockActivity, id: '6', activityType: 'ASSIGNMENT_UPLOAD', title: 'Assignment Upload 1' },
  { ...mockActivity, id: '7', activityType: 'MDB_REPLY', title: 'MDB Reply 1' },
  { ...mockActivity, id: '8', activityType: 'TICKET_RESPONSE', title: 'Ticket Response 2' },
  { ...mockActivity, id: '9', activityType: 'GDB_MARKING', title: 'GDB Marking 2' },
  { ...mockActivity, id: '10', activityType: 'TICKET_RESPONSE', title: 'Ticket Response 3' },
];

export const mockReport = {
  id: 1,
  reportType: 'WEEKLY',
  startDate: '2025-01-01',
  endDate: '2025-01-07',
  createdAt: '2025-01-07T10:00:00Z',
  filePath: 'uploads/report_WEEKLY_2025-01-01.pdf',
};

export const mockNotification = {
  id: 1,
  title: 'Pending Activity Reminder',
  message: 'You have a pending activity',
  type: 'REMINDER',
  priority: 'HIGH',
  isRead: false,
  createdAt: '2025-01-15T10:00:00Z',
};

export const renderWithProviders = (ui, { user = mockUser, ...options } = {}) => {
  // Set user in localStorage for AuthProvider to pick up
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', 'test-token');
  }

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export const mockApiResponse = (data, status = 200) => ({
  data: { success: true, data },
  status,
  statusText: 'OK',
  headers: {},
  config: {},
});

export const mockApiError = (message, status = 400) => ({
  response: {
    data: { success: false, message },
    status,
    statusText: 'Bad Request',
    headers: {},
  },
  config: {},
});

