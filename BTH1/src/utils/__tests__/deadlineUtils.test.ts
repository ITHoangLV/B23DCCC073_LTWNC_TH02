import { isOverdue, calcDaysLeft, calcStats } from '../../utils/deadlineUtils';
import type { Assignment } from '../../types';

// Helper tạo assignment nhanh
function makeAssignment(overrides: Partial<Assignment> = {}): Assignment {
  return {
    id: 'test-1',
    subject: 'Lập trình Web',
    title: 'Bài tập 1',
    dueDate: new Date(Date.now() + 86400000).toISOString(), // Mặc định: ngày mai
    priority: 'Medium',
    completed: false,
    ...overrides,
  };
}

const NOW = 1700000000000; // Timestamp cố định để test ổn định
const PAST = NOW - 2 * 86400000; // 2 ngày trước
const FUTURE = NOW + 3 * 86400000; // 3 ngày sau

// ============================================================
// Test Case 1 & 2: isOverdue
// ============================================================
describe('isOverdue', () => {
  it('TC1: Trả về true khi dueDate < now và chưa hoàn thành', () => {
    const assignment = makeAssignment({ dueDate: new Date(PAST).toISOString(), completed: false });
    expect(isOverdue(assignment, NOW)).toBe(true);
  });

  it('TC2: Trả về false khi đã hoàn thành dù ngày hết hạn đã qua', () => {
    const assignment = makeAssignment({ dueDate: new Date(PAST).toISOString(), completed: true });
    expect(isOverdue(assignment, NOW)).toBe(false);
  });

  it('Ca biên: dueDate === now trả về false (không quá hạn)', () => {
    const assignment = makeAssignment({ dueDate: new Date(NOW).toISOString(), completed: false });
    // now = due => diff = 0 => không quá hạn
    expect(isOverdue(assignment, NOW)).toBe(false);
  });

  it('Trả về false khi dueDate trong tương lai và chưa hoàn thành', () => {
    const assignment = makeAssignment({ dueDate: new Date(FUTURE).toISOString(), completed: false });
    expect(isOverdue(assignment, NOW)).toBe(false);
  });
});

// ============================================================
// Test Case 3: calcDaysLeft
// ============================================================
describe('calcDaysLeft', () => {
  it('TC3a: Trả về số ngày dương khi deadline trong tương lai', () => {
    const days = calcDaysLeft(new Date(FUTURE).toISOString(), NOW);
    expect(days).toBe(3);
  });

  it('TC3b: Trả về 0 khi due = now (hôm nay)', () => {
    const days = calcDaysLeft(new Date(NOW).toISOString(), NOW);
    expect(days).toBe(0);
  });

  it('TC3c: Trả về số âm khi deadline đã qua (quá hạn)', () => {
    const days = calcDaysLeft(new Date(PAST).toISOString(), NOW);
    expect(days).toBe(-2);
  });
});

// ============================================================
// Test Case 4: calcStats
// ============================================================
describe('calcStats', () => {
  const items: Assignment[] = [
    makeAssignment({ id: '1', subject: 'Môn A', dueDate: new Date(PAST).toISOString(), completed: false }),
    makeAssignment({ id: '2', subject: 'Môn A', dueDate: new Date(FUTURE).toISOString(), completed: true }),
    makeAssignment({ id: '3', subject: 'Môn B', dueDate: new Date(FUTURE).toISOString(), completed: false }),
  ];

  it('TC4a: Tính đúng các số tổng hợp', () => {
    const stats = calcStats(items, NOW);
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.overdue).toBe(1);  // item 1 là quá hạn, chưa hoàn thành
    expect(stats.incomplete).toBe(2);
  });

  it('TC4b: Tính đúng thống kê theo môn học', () => {
    const stats = calcStats(items, NOW);
    expect(stats.bySubject['Môn A']).toBe(2);
    expect(stats.bySubject['Môn B']).toBe(1);
  });

  it('TC4c: Danh sách rỗng trả về toàn bộ 0', () => {
    const stats = calcStats([], NOW);
    expect(stats.total).toBe(0);
    expect(stats.completed).toBe(0);
    expect(stats.overdue).toBe(0);
    expect(stats.bySubject).toEqual({});
  });
});
