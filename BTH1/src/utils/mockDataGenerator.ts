import type { Assignment } from '../types';

const SUBJECTS = [
  'Lập trình Web Nâng cao',
  'Kiến trúc phần mềm',
  'Cơ sở dữ liệu',
  'Mạng máy tính',
  'Trí tuệ nhân tạo',
  'Lập trình di động',
  'An toàn thông tin',
  'Hệ điều hành',
  'Phân tích thiết kế hệ thống',
  'Toán rời rạc',
];

const TITLES = [
  'Bài thực hành',
  'Bài tập lớn',
  'Tiểu luận',
  'Báo cáo thực tập',
  'Đồ án nhóm',
  'Kiểm tra giữa kỳ',
  'Bài tập về nhà',
  'Dự án cá nhân',
];

const PRIORITIES = ['High', 'Medium', 'Low'] as const;

export function generate10kAssignments(): Assignment[] {
  const now = Date.now();
  const ONE_DAY = 86400000;
  const assignments: Assignment[] = [];

  for (let i = 0; i < 10000; i++) {
    // Trải deadline từ -30 ngày đến +60 ngày so với hiện tại
    const daysOffset = Math.floor(Math.random() * 90) - 30;
    const dueDate = new Date(now + daysOffset * ONE_DAY).toISOString();
    const subject = SUBJECTS[i % SUBJECTS.length];
    const title = `${TITLES[i % TITLES.length]} ${i + 1}`;
    const priority = PRIORITIES[i % PRIORITIES.length];

    assignments.push({
      id: `stress-${i}`,
      subject,
      title,
      dueDate,
      priority,
      completed: i % 7 === 0, // ~14% đã hoàn thành
    });
  }

  return assignments;
}
