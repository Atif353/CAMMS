import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../../components/Sidebar';
import { renderWithProviders, mockUser, mockAdmin } from '../utils/testHelpers';

// Mock dependencies
vi.mock('../../api/notificationApi', () => ({
  notificationApi: {
    getUnreadCount: vi.fn(() => Promise.resolve({ data: { data: 3 } })),
  },
}));

vi.mock('../../utils/profileImage', () => ({
  getProfileImage: vi.fn((user) => user?.profile_image || '/assets/default-avatar.png'),
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render sidebar for instructor', () => {
    renderWithProviders(<Sidebar />, { user: mockUser });

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/log activity/i)).toBeInTheDocument();
    expect(screen.getByText(/my activities/i)).toBeInTheDocument();
    expect(screen.getByText(/reports/i)).toBeInTheDocument();
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();
  });

  it('should render sidebar for admin', () => {
    renderWithProviders(<Sidebar />, { user: mockAdmin });

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/manage users/i)).toBeInTheDocument();
    expect(screen.getByText(/activities/i)).toBeInTheDocument();
    expect(screen.getByText(/reports/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  it('should display user name and email', () => {
    renderWithProviders(<Sidebar />, { user: mockUser });

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('should render collapse/expand button', () => {
    const { container } = renderWithProviders(<Sidebar />, { user: mockUser });
    
    // Check for chevron icons (collapse/expand buttons)
    const chevronButtons = container.querySelectorAll('svg');
    expect(chevronButtons.length).toBeGreaterThan(0);
  });

  it('should show unread notification count', async () => {
    renderWithProviders(<Sidebar />, { user: mockUser });

    // Wait for notification count to load
    await screen.findByText(/3/i);
  });

  it('should have logout button', () => {
    renderWithProviders(<Sidebar />, { user: mockUser });

    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
});

