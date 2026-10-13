import { screen, waitFor, fireEvent } from '@testing-library/react';
import { AssignmentList } from '../AssignmentList';
import { renderWithProviders } from '../../../test-utils';
import type { Assignment } from '../../../types';

// ============================================================
// Mock API để điều khiển resolve/reject trong test
// ============================================================
jest.mock('../../../api/assignmentsApi');

import { fetchAssignments } from '../../../api/assignmentsApi';

const mockFetchAssignments = fetchAssignments as jest.MockedFunction<typeof fetchAssignments>;

// Mock react-window để jsdom có thể render toàn bộ item (không cần layout)
jest.mock('react-window', () => ({
  FixedSizeList: ({ children: Row, itemCount, itemData }: {
    children: React.ComponentType<{ index: number; style: React.CSSProperties; data: unknown }>;
    itemCount: number;
    itemData: unknown;
  }) => (
    <>
      {Array.from({ length: itemCount }, (_, i) => (
        <Row key={i} index={i} style={{}} data={itemData} />
      ))}
    </>
  ),
}));

const sampleAssignments: Assignment[] = [
  {
    id: '1',
    subject: 'Lập trình Web',
    title: 'Bài thực hành 1',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    priority: 'High',
    completed: false,
  },
  {
    id: '2',
    subject: 'Cơ sở dữ liệu',
    title: 'Bài tập giữa kỳ',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    priority: 'Medium',
    completed: false,
  },
];

describe('AssignmentList – Async States', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('TC11: Hiển thị loading spinner khi thunk đang ở trạng thái pending', async () => {
    // Promise không bao giờ resolve trong test này → trạng thái pending
    mockFetchAssignments.mockReturnValue(new Promise(() => {}));

    renderWithProviders(<AssignmentList />);

    // Spinner phải xuất hiện ngay lập tức
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/đang tải/i)).toBeInTheDocument();
  });

  it('TC12: Hiển thị danh sách bài tập khi thunk fetch thành công', async () => {
    mockFetchAssignments.mockResolvedValue(sampleAssignments);

    renderWithProviders(<AssignmentList />);

    await waitFor(() => {
      expect(screen.getByText('Bài thực hành 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Bài tập giữa kỳ')).toBeInTheDocument();
  });

  it('TC13: Hiển thị thông báo lỗi khi thunk bị rejected', async () => {
    mockFetchAssignments.mockRejectedValue(new Error('Network error'));

    renderWithProviders(<AssignmentList />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText(/không thể tải dữ liệu/i)).toBeInTheDocument();
  });

  it('TC14: Lọc danh sách theo filter tabs và mobile select', async () => {
    mockFetchAssignments.mockResolvedValue(sampleAssignments);

    renderWithProviders(<AssignmentList />);

    await waitFor(() => {
      expect(screen.getByText('Bài thực hành 1')).toBeInTheDocument();
    });

    // Chuyển sang tab Đã xong
    const completedTab = screen.getByRole('tab', { name: /Đã xong/i });
    fireEvent.click(completedTab);
    expect(screen.getByText(/Không có bài tập nào/i)).toBeInTheDocument();

    // Chuyển sang tab Chưa xong
    const incompleteTab = screen.getByRole('tab', { name: /Chưa xong/i });
    fireEvent.click(incompleteTab);
    expect(screen.getByText('Bài thực hành 1')).toBeInTheDocument();

    // Chuyển qua mobile select dropdown
    const select = screen.getByLabelText('Chọn bộ lọc');
    fireEvent.change(select, { target: { value: 'Overdue' } });
  });

  it('TC15: Tìm kiếm theo từ khoá và nút xoá tìm kiếm', async () => {
    mockFetchAssignments.mockResolvedValue(sampleAssignments);

    renderWithProviders(<AssignmentList />);

    await waitFor(() => {
      expect(screen.getByText('Bài thực hành 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText('Tìm kiếm bài tập');
    fireEvent.change(searchInput, { target: { value: 'giữa kỳ' } });

    // Khi gõ, nút xoá tìm kiếm xuất hiện
    await waitFor(() => {
      const clearBtn = screen.getByLabelText('Xoá tìm kiếm');
      expect(clearBtn).toBeInTheDocument();
      fireEvent.click(clearBtn);
    });
  });

  it('TC16: Nút stress test tạo 10.000 bài và nút xoá dữ liệu', async () => {
    mockFetchAssignments.mockResolvedValue([]);

    renderWithProviders(<AssignmentList />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const stressBtn = screen.getByTitle(/Sinh 10.000 bài tập mẫu/i);
    fireEvent.click(stressBtn);

    expect(screen.getByText(/Hiện có/i)).toBeInTheDocument();

    const clearBtn = screen.getByTitle(/Xoá toàn bộ dữ liệu/i);
    fireEvent.click(clearBtn);
  });
});

