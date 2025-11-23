/**
 * Test helper utilities for mocking and test data
 */

export const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test Instructor',
  email: 'test@example.com',
  password_hash: '$2a$10$hashedpassword',
  role_name: 'INSTRUCTOR',
  role_id: 2,
  phone: '+1234567890',
  profile_image: null,
  is_active: true,
  created_at: new Date(),
};

export const mockAdmin = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Test Admin',
  email: 'admin@example.com',
  password_hash: '$2a$10$hashedpassword',
  role_name: 'ADMIN',
  role_id: 1,
  phone: '+1234567890',
  profile_image: null,
  is_active: true,
  created_at: new Date(),
};

export const mockActivity = {
  id: '123e4567-e89b-12d3-a456-426614174002',
  instructor_id: mockUser.id,
  activity_type_id: 1,
  activity_type_code: 'MDB_REPLY',
  activity_type_label: 'MDB Reply',
  title: 'Test MDB Reply',
  description: 'Test description',
  course_code: 'CS101',
  time_spent_minutes: 30,
  activity_date: new Date(),
  meta: {},
  status: 'COMPLETED',
  is_deleted: false,
  created_at: new Date(),
  instructor_name: mockUser.name,
  instructor_email: mockUser.email,
};

export const mockActivities = [
  { ...mockActivity, id: '1', activity_type_code: 'TICKET_RESPONSE' },
  { ...mockActivity, id: '2', activity_type_code: 'GDB_MARKING' },
  { ...mockActivity, id: '3', activity_type_code: 'ASSIGNMENT_MARKING' },
  { ...mockActivity, id: '4', activity_type_code: 'EMAIL_RESPONSE' },
  { ...mockActivity, id: '5', activity_type_code: 'WEEKLY_SESSION' },
  { ...mockActivity, id: '6', activity_type_code: 'ASSIGNMENT_UPLOAD' },
  { ...mockActivity, id: '7', activity_type_code: 'MDB_REPLY' },
  { ...mockActivity, id: '8', activity_type_code: 'TICKET_RESPONSE' },
  { ...mockActivity, id: '9', activity_type_code: 'GDB_MARKING' },
  { ...mockActivity, id: '10', activity_type_code: 'TICKET_RESPONSE' },
];

export const mockReport = {
  id: 1,
  generated_by: mockAdmin.id,
  instructor_id: null,
  report_type: 'WEEKLY',
  start_date: new Date('2025-01-01'),
  end_date: new Date('2025-01-07'),
  filters: {},
  file_path: 'uploads/report_WEEKLY_2025-01-01.pdf',
  created_at: new Date(),
};

export const mockNotification = {
  id: 1,
  user_id: mockUser.id,
  title: 'Pending Activity Reminder',
  message: 'You have a pending activity',
  type: 'REMINDER',
  priority: 'HIGH',
  is_read: false,
  read_at: null,
  meta: {},
  created_at: new Date(),
};

export const createMockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  user: mockUser,
  ...overrides,
});

export const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const createMockNext = () => jest.fn();

