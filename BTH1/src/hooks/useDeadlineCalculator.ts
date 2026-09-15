import { useState, useEffect } from 'react';
import { isOverdue } from '../types';
import type { Assignment } from '../types';

export function useDeadlineCalculator(assignment: Assignment) {
  const [timeText, setTimeText] = useState('');

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const due = new Date(assignment.dueDate).getTime();
      const diffDays = Math.ceil(Math.abs(due - now) / (1000 * 60 * 60 * 24));

      if (assignment.completed) return setTimeText('Đã nộp');
      
      if (isOverdue(assignment)) { // Dùng Type Guard ở đây
        setTimeText(`Quá hạn ${diffDays} ngày`);
      } else {
        setTimeText(`Còn ${diffDays} ngày`);
      }
    };
    calculate();
  }, [assignment]);

  return timeText;
}