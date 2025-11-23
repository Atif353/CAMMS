import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogActivityPage from '../../pages/instructor/LogActivityPage';
import { renderWithProviders, mockUser } from '../../utils/testHelpers';

// Mock API
const mockCreateActivity = vi.fn();
vi.mock('../../api/activityApi', () => ({
  activityApi: {
    create: mockCreateActivity,
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock SweetAlert2
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(() => Promise.resolve({ isConfirmed: true })),
  },
}));

describe('LogActivityPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render activity logging form', () => {
    renderWithProviders(<LogActivityPage />, { user: mockUser });

    expect(screen.getByLabelText(/activity type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time spent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  it('should show all activity types in dropdown', () => {
    renderWithProviders(<LogActivityPage />, { user: mockUser });

    const activityTypeSelect = screen.getByLabelText(/activity type/i);
    fireEvent.click(activityTypeSelect);

    expect(screen.getByText(/mdb reply/i)).toBeInTheDocument();
    expect(screen.getByText(/ticket response/i)).toBeInTheDocument();
    expect(screen.getByText(/assignment upload/i)).toBeInTheDocument();
    expect(screen.getByText(/assignment marking/i)).toBeInTheDocument();
    expect(screen.getByText(/gdb marking/i)).toBeInTheDocument();
    expect(screen.getByText(/weekly session/i)).toBeInTheDocument();
    expect(screen.getByText(/email response/i)).toBeInTheDocument();
  });

  it('should update form fields', () => {
    renderWithProviders(<LogActivityPage />, { user: mockUser });

    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Activity' } });

    expect(titleInput.value).toBe('Test Activity');
  });

  it('should apply template when activity type changes', () => {
    renderWithProviders(<LogActivityPage />, { user: mockUser });

    const activityTypeSelect = screen.getByLabelText(/activity type/i);
    fireEvent.change(activityTypeSelect, { target: { value: 'MDB_REPLY' } });

    const useTemplateButton = screen.getByText(/use template/i);
    fireEvent.click(useTemplateButton);

    const titleInput = screen.getByLabelText(/title/i);
    expect(titleInput.value).toContain('MDB');
  });

  it('should submit form with activity data', async () => {
    mockCreateActivity.mockResolvedValue({ success: true });

    renderWithProviders(<LogActivityPage />, { user: mockUser });

    const titleInput = screen.getByLabelText(/title/i);
    const timeSpentInput = screen.getByLabelText(/time spent/i);
    const submitButton = screen.getByRole('button', { name: /log activity/i });

    fireEvent.change(titleInput, { target: { value: 'Test Activity' } });
    fireEvent.change(timeSpentInput, { target: { value: '30' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateActivity).toHaveBeenCalled();
    });
  });

  it('should show meta fields for ticket response', () => {
    renderWithProviders(<LogActivityPage />, { user: mockUser });

    const activityTypeSelect = screen.getByLabelText(/activity type/i);
    fireEvent.change(activityTypeSelect, { target: { value: 'TICKET_RESPONSE' } });

    // Meta fields should appear
    expect(screen.getByLabelText(/ticket id/i)).toBeInTheDocument();
  });

  it('should show meta fields for GDB marking', () => {
    renderWithProviders(<LogActivityPage />, { user: mockUser });

    const activityTypeSelect = screen.getByLabelText(/activity type/i);
    fireEvent.change(activityTypeSelect, { target: { value: 'GDB_MARKING' } });

    expect(screen.getByLabelText(/number of posts reviewed/i)).toBeInTheDocument();
  });
});

