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

// isOverdue đã chuyển sang utils/deadlineUtils.ts để nhận tham số `now`
// import từ: import { isOverdue } from '../utils/deadlineUtils'