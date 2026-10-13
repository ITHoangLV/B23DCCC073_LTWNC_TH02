import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import AssignmentCard from '../../components/AssignmentCard';
import type { Assignment } from '../../types';
import { usePinStore } from '../../store/usePinStore';

// Sample item
const sampleItem: Assignment = {
  id: 'card-1',
  subject: 'Lập trình Web Nâng cao',
  title: 'Bài thực hành 2',
  dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
  priority: 'High',
  completed: false,
};

describe('AssignmentCard – Render', () => {
  it('TC7: Hiển thị đúng tên môn, tên bài, nhãn ưu tiên', () => {
    const onToggle = jest.fn();
    const onDelete = jest.fn();

    renderWithProviders(<AssignmentCard item={sampleItem} onToggleComplete={onToggle} onDelete={onDelete} />);

    expect(screen.getByText('Lập trình Web Nâng cao')).toBeInTheDocument();
    expect(screen.getByText('Bài thực hành 2')).toBeInTheDocument();
    expect(screen.getByText(/🔴 Cao/)).toBeInTheDocument();
  });
});

describe('AssignmentCard – Interactions', () => {
  beforeEach(() => {
    // Reset Zustand pin store trước mỗi test
    usePinStore.setState({ pinnedIds: [] });
  });

  it('TC8: Click nút Hoàn thành gọi onToggleComplete với đúng id', () => {
    const onToggle = jest.fn();
    const onDelete = jest.fn();

    renderWithProviders(<AssignmentCard item={sampleItem} onToggleComplete={onToggle} onDelete={onDelete} />);

    const toggleBtn = screen.getByRole('button', { name: /xong/i });
    fireEvent.click(toggleBtn);

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith('card-1');
  });

  it('TC9: Click nút Ghim cập nhật Zustand usePinStore', () => {
    const onToggle = jest.fn();
    const onDelete = jest.fn();

    renderWithProviders(<AssignmentCard item={sampleItem} onToggleComplete={onToggle} onDelete={onDelete} />);

    // Lúc đầu chưa ghim
    expect(usePinStore.getState().pinnedIds).not.toContain('card-1');

    const pinBtn = screen.getByRole('button', { name: /ghim/i });
    fireEvent.click(pinBtn);

    // Sau click phải ghim
    expect(usePinStore.getState().pinnedIds).toContain('card-1');
  });
});
