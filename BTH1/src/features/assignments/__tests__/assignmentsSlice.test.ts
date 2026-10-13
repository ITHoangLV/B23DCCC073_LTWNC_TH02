import assignmentsReducer, {
  addAssignment,
  toggleComplete,
  deleteAssignment,
  loadStressTestData,
  clearAll,
} from '../assignmentsSlice';
import type { Assignment } from '../../../types';

// State mẫu
const sampleItem: Assignment = {
  id: '1',
  subject: 'Lập trình Web',
  title: 'Bài tập 1',
  dueDate: new Date(Date.now() + 86400000).toISOString(),
  priority: 'High',
  completed: false,
};

const initialState = { items: [], status: 'idle' as const, error: null };
const stateWithOne = { ...initialState, items: [sampleItem], status: 'succeeded' as const };

// ============================================================
// Test Case 5: assignmentsSlice reducers
// ============================================================
describe('assignmentsSlice – Reducers', () => {
  it('TC5a: addAssignment thêm bài tập mới với completed=false và id tự sinh', () => {
    const newItem = { subject: 'Môn A', title: 'Bài mới', dueDate: '2024-12-31', priority: 'Low' as const };
    const nextState = assignmentsReducer(initialState, addAssignment(newItem));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].completed).toBe(false);
    expect(nextState.items[0].id).toBeTruthy();
    expect(nextState.items[0].subject).toBe('Môn A');
  });

  it('TC5b: toggleComplete đảo completed từ false thành true', () => {
    const nextState = assignmentsReducer(stateWithOne, toggleComplete('1'));
    expect(nextState.items[0].completed).toBe(true);
  });

  it('TC5c: toggleComplete đảo completed từ true thành false', () => {
    const completedState = { ...stateWithOne, items: [{ ...sampleItem, completed: true }] };
    const nextState = assignmentsReducer(completedState, toggleComplete('1'));
    expect(nextState.items[0].completed).toBe(false);
  });

  it('TC5d: deleteAssignment xoá đúng bài tập theo id', () => {
    const nextState = assignmentsReducer(stateWithOne, deleteAssignment('1'));
    expect(nextState.items).toHaveLength(0);
  });

  it('TC5e: deleteAssignment với id không tồn tại không làm thay đổi danh sách', () => {
    const nextState = assignmentsReducer(stateWithOne, deleteAssignment('999'));
    expect(nextState.items).toHaveLength(1);
  });
  it('TC5f: toggleComplete với id không tồn tại không làm thay đổi state', () => {
    const nextState = assignmentsReducer(stateWithOne, toggleComplete('999'));
    expect(nextState.items[0].completed).toBe(false);
  });
});

// ============================================================
// Test Case 6: loadStressTestData và clearAll
// ============================================================
describe('assignmentsSlice – loadStressTestData & clearAll', () => {
  it('TC6a: loadStressTestData thay thế toàn bộ danh sách', () => {
    const stressItems: Assignment[] = [
      { ...sampleItem, id: 'stress-0' },
      { ...sampleItem, id: 'stress-1' },
    ];
    const nextState = assignmentsReducer(stateWithOne, loadStressTestData(stressItems));
    expect(nextState.items).toHaveLength(2);
    expect(nextState.items[0].id).toBe('stress-0');
    expect(nextState.status).toBe('succeeded');
  });

  it('TC6b: clearAll xoá toàn bộ và đặt status=idle', () => {
    const nextState = assignmentsReducer(stateWithOne, clearAll());
    expect(nextState.items).toHaveLength(0);
    expect(nextState.status).toBe('idle');
  });

  it('TC6c: extraReducers xử lý pending, fulfilled và rejected fallback', () => {
    const pendingState = assignmentsReducer(initialState, { type: 'assignments/fetchInitial/pending' });
    expect(pendingState.status).toBe('loading');
    expect(pendingState.error).toBeNull();

    const fulfilledState = assignmentsReducer(pendingState, {
      type: 'assignments/fetchInitial/fulfilled',
      payload: [sampleItem],
    });
    expect(fulfilledState.status).toBe('succeeded');
    expect(fulfilledState.items).toHaveLength(1);

    const rejectedFallbackState = assignmentsReducer(pendingState, {
      type: 'assignments/fetchInitial/rejected',
      error: {},
    });
    expect(rejectedFallbackState.status).toBe('failed');
    expect(rejectedFallbackState.error).toBe('Có lỗi xảy ra');
  });
});
