import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import LoadingSkeleton from '../../components/LoadingSkeleton';

describe('LoadingSkeleton Component', () => {
  it('should render table skeleton by default', () => {
    const { container } = render(<LoadingSkeleton />);
    
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render with custom row count', () => {
    const { container } = render(<LoadingSkeleton rows={10} />);
    
    const rows = container.querySelectorAll('tr');
    expect(rows.length).toBe(10);
  });

  it('should render card skeleton', () => {
    const { container } = render(<LoadingSkeleton type="card" />);
    
    const card = container.querySelector('.rounded-2xl');
    expect(card).toBeInTheDocument();
  });
});

