import type { Assignment } from '../types';

export interface Stats {
  total: number;
  completed: number;
  overdue: number;
  incomplete: number;
  bySubject: Record<string, number>;
}

/**
 * Kiểm tra bài tập có quá hạn không.
 * Nhận tham số now để dễ test (không gọi new Date() bên trong).
 */
export function isOverdue(assignment: Assignment, now: number = Date.now()): boolean {
  return !assignment.completed && new Date(assignment.dueDate).getTime() < now;
}

/**
 * Tính số ngày còn lại (âm = quá hạn).
 * now là timestamp ms, mặc định là Date.now() – có thể override khi test.
 */
export function calcDaysLeft(dueDate: string, now: number = Date.now()): number {
  const diff = new Date(dueDate).getTime() - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Tính thống kê danh sách bài tập.
 */
export function calcStats(items: Assignment[], now: number = Date.now()): Stats {
  const bySubject: Record<string, number> = {};

  for (const item of items) {
    bySubject[item.subject] = (bySubject[item.subject] ?? 0) + 1;
  }

  return {
    total: items.length,
    completed: items.filter(i => i.completed).length,
    overdue: items.filter(i => isOverdue(i, now)).length,
    incomplete: items.filter(i => !i.completed).length,
    bySubject,
  };
}

/**
 * Chuỗi hiển thị thời gian (dùng trong card).
 */
export function formatDeadlineText(assignment: Assignment, now: number = Date.now()): string {
  if (assignment.completed) return 'Đã nộp';
  const days = calcDaysLeft(assignment.dueDate, now);
  if (days < 0) return `Quá hạn ${Math.abs(days)} ngày`;
  if (days === 0) return 'Hết hạn hôm nay!';
  return `Còn ${days} ngày`;
}
