import { useEffect, useState } from 'react';
import type { Assignment } from '../types';
import { formatDeadlineText } from '../utils/deadlineUtils';

export function useDeadlineCalculator(assignment: Assignment): string {
  const [timeText, setTimeText] = useState('');

  useEffect(() => {
    // Dùng formatDeadlineText từ utils – không viết lại logic
    setTimeText(formatDeadlineText(assignment));
  }, [assignment]);

  return timeText;
}