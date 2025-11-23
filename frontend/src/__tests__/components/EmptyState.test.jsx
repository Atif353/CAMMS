import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from '../../components/EmptyState';
import { FiActivity } from 'react-icons/fi';

describe('EmptyState Component', () => {
  it('should render empty state with default title', () => {
    render(<EmptyState />);
    
    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('should render with custom title', () => {
    render(<EmptyState title="No activities found" />);
    
    expect(screen.getByText('No activities found')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<EmptyState message="Custom message here" />);
    
    expect(screen.getByText('Custom message here')).toBeInTheDocument();
  });

  it('should render with custom icon', () => {
    render(<EmptyState icon={FiActivity} />);
    
    const icon = document.querySelector('.text-4xl');
    expect(icon).toBeInTheDocument();
  });

  it('should render action when provided', () => {
    const actionButton = <button>Create Activity</button>;
    render(
      <EmptyState
        title="No activities"
        action={actionButton}
      />
    );
    
    expect(screen.getByText('Create Activity')).toBeInTheDocument();
  });
});

