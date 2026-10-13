import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssignmentForm } from '../../components/AssignmentForm';
import { renderWithProviders } from '../../test-utils';

// ============================================================
// Test Case 10: AssignmentForm
// ============================================================
describe('AssignmentForm', () => {
  it('TC10a: Không submit khi bỏ trống các trường bắt buộc', async () => {
    renderWithProviders(<AssignmentForm />);

    const submitBtn = screen.getByRole('button', { name: /thêm bài tập/i });

    // window.alert sẽ được gọi thay vì submit thật
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    await userEvent.click(submitBtn);

    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('đủ thông tin'));
    alertSpy.mockRestore();
  });

  it('TC10b: Khi điền đủ thông tin, form dispatch action addAssignment và reset fields', async () => {
    const { store } = renderWithProviders(<AssignmentForm />);

    // Điền form
    await userEvent.type(screen.getByLabelText(/môn học/i), 'Cơ sở dữ liệu');
    await userEvent.type(screen.getByLabelText(/tên bài tập/i), 'Bài tập lớn cuối kỳ');
    await userEvent.type(screen.getByLabelText(/ngày hết hạn/i), '2025-12-31');

    const submitBtn = screen.getByRole('button', { name: /thêm bài tập/i });
    await userEvent.click(submitBtn);

    // Đợi dispatch
    await waitFor(() => {
      const state = store.getState().assignments;
      expect(state.items).toHaveLength(1);
      expect(state.items[0].subject).toBe('Cơ sở dữ liệu');
      expect(state.items[0].title).toBe('Bài tập lớn cuối kỳ');
      expect(state.items[0].completed).toBe(false);
    });

    // Các field phải được reset
    expect(screen.getByLabelText(/môn học/i)).toHaveValue('');
    expect(screen.getByLabelText(/tên bài tập/i)).toHaveValue('');
  });
});
