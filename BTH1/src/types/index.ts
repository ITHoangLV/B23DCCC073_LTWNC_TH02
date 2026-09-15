// Định nghĩa interface cơ bản
export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'All' | 'Completed' | 'Incomplete' | 'Overdue';

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string; // Định dạng ISO string
  priority: Priority;
  completed: boolean;
}

// Vận dụng Utility Type cho form thêm mới (bỏ id và completed vì sẽ tự tạo)
export type NewAssignment = Omit<Assignment, 'id' | 'completed'>;

// Custom Type Guard để kiểm tra bài tập đã quá hạn chưa
export function isOverdue(assignment: Assignment): boolean {
  return !assignment.completed && new Date(assignment.dueDate).getTime() < new Date().getTime();
}