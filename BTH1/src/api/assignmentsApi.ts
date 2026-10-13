import type { Assignment } from '../types';

// API giả lập delay 1s – tách riêng để jest.mock được
export function fetchAssignments(): Promise<Assignment[]> {
  return new Promise<Assignment[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          subject: 'Lập trình Web Nâng cao',
          title: 'Bài thực hành 1',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          priority: 'High',
          completed: false,
        },
        {
          id: '2',
          subject: 'Kiến trúc phần mềm',
          title: 'Bài tập giữa kỳ',
          dueDate: new Date(Date.now() - 86400000).toISOString(),
          priority: 'Medium',
          completed: false,
        },
      ]);
    }, 1000);
  });
}
