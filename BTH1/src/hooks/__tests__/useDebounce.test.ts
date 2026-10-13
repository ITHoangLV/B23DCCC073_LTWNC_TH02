import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

// ============================================================
// Test Case 14: useDebounce Hook
// ============================================================
describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('TC14: Giá trị không đổi ngay lập tức, chỉ cập nhật sau đúng 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } }
    );

    // Lúc đầu: debounced = 'hello'
    expect(result.current).toBe('hello');

    // Thay đổi value
    rerender({ value: 'hello world', delay: 300 });

    // Ngay lập tức: vẫn là giá trị cũ
    expect(result.current).toBe('hello');

    // Tua 299ms – vẫn chưa cập nhật
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe('hello');

    // Tua thêm 1ms – đủ 300ms, lúc này mới cập nhật
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('hello world');
  });

  it('TC14b: Timer reset khi value thay đổi liên tiếp (debounce chỉ chạy 1 lần cuối)', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'ab' });
    act(() => { jest.advanceTimersByTime(100); });

    rerender({ value: 'abc' });
    act(() => { jest.advanceTimersByTime(100); });

    rerender({ value: 'abcd' });
    // Chưa đủ 300ms từ lần gõ cuối
    expect(result.current).toBe('a');

    // Tua đủ 300ms từ lần gõ cuối 'abcd'
    act(() => { jest.advanceTimersByTime(300); });
    expect(result.current).toBe('abcd');
  });
});
