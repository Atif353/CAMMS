import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../../components/Pagination';

describe('Pagination Component', () => {
  it('should render pagination with page numbers', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should call onPageChange when page is clicked', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const page2 = screen.getByText('2');
    fireEvent.click(page2);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should disable previous button on first page', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const prevButtons = screen.getAllByText(/previous/i);
    const prevButton = prevButtons.find(btn => btn.tagName === 'BUTTON');
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    const nextButtons = screen.getAllByText(/next/i);
    const nextButton = nextButtons.find(btn => btn.tagName === 'BUTTON');
    expect(nextButton).toBeDisabled();
  });

  it('should highlight current page', () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={onPageChange}
      />
    );

    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('bg-blue-50');
  });
});

