import { useEffect, useState } from 'react';

/**
 * Trả về giá trị debounce: chỉ cập nhật sau `delay` ms kể từ lần gõ cuối.
 * Dùng cho ô tìm kiếm để tránh lọc danh sách sau mỗi ký tự gõ.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
