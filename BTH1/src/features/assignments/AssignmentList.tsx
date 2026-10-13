import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchInitialAssignments,
  toggleComplete,
  deleteAssignment,
  loadStressTestData,
  clearAll,
} from './assignmentsSlice';
import { FilterTabs } from '../../components/FilterTabs';
import { AssignmentForm } from '../../components/AssignmentForm';
import { VirtualizedList } from '../../components/VirtualizedList';
import { isOverdue } from '../../utils/deadlineUtils';
import { generate10kAssignments } from '../../utils/mockDataGenerator';
import { usePinStore } from '../../store/usePinStore';
import { useDebounce } from '../../hooks/useDebounce';
import type { Status } from '../../types';

export function AssignmentList() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.assignments);
  const pinnedIds = usePinStore((s) => s.pinnedIds);

  const [filter, setFilter] = useState<Status>('All');
  const [searchTerm, setSearchTerm] = useState('');
  // Debounce 300ms: danh sách chỉ lọc lại sau 300ms ngừng gõ
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchInitialAssignments());
  }, [status, dispatch]);

  // useCallback cho handlers: stable reference để AssignmentCard (memo) không re-render vô ích
  const handleToggleComplete = useCallback(
    (id: string) => dispatch(toggleComplete(id)),
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: string) => dispatch(deleteAssignment(id)),
    [dispatch]
  );

  const handleStressTest = useCallback(() => {
    const data = generate10kAssignments();
    dispatch(loadStressTestData(data));
  }, [dispatch]);

  const handleClearAll = useCallback(() => {
    dispatch(clearAll());
  }, [dispatch]);

  // useMemo: chỉ tính lại khi items / filter / debouncedSearch / pinnedIds thay đổi
  const filteredItems = useMemo(() => {
    let result = items;

    // Lọc theo trạng thái
    if (filter === 'Completed') result = result.filter((i) => i.completed);
    else if (filter === 'Incomplete') result = result.filter((i) => !i.completed);
    else if (filter === 'Overdue') result = result.filter((i) => isOverdue(i));

    // Lọc theo search (debounced)
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.subject.toLowerCase().includes(q)
      );
    }

    // Sắp xếp: bài ghim luôn ở đầu
    return [...result].sort((a, b) => {
      const aPin = pinnedIds.includes(a.id) ? 0 : 1;
      const bPin = pinnedIds.includes(b.id) ? 0 : 1;
      return aPin - bPin;
    });
  }, [items, filter, debouncedSearch, pinnedIds]);

  // Stats cho filter tabs
  const totalCount = items.length;
  const completedCount = useMemo(() => items.filter((i) => i.completed).length, [items]);
  const overdueCount = useMemo(() => items.filter((i) => isOverdue(i)).length, [items]);
  const incompleteCount = useMemo(() => items.filter((i) => !i.completed).length, [items]);

  return (
    <div>
      {/* Form thêm bài tập */}
      <div className="glass-card">
        <div className="glass-card__title">Thêm bài tập mới</div>
        <AssignmentForm />
      </div>

      {/* Stress Test Controls */}
      <div className="stress-test-bar">
        <button
          id="btn-stress-test"
          className="btn btn-stress"
          onClick={handleStressTest}
          title="Sinh 10.000 bài tập mẫu để kiểm tra hiệu năng"
        >
          ⚡ Tạo 10.000 bài tập mẫu
        </button>
        <button
          id="btn-clear-all"
          className="btn btn-danger"
          onClick={handleClearAll}
          title="Xoá toàn bộ dữ liệu"
        >
          🗑 Xoá dữ liệu test
        </button>
        {items.length > 0 && (
          <span className="stress-test-count">
            Hiện có <strong>{items.length.toLocaleString()}</strong> bài tập
          </span>
        )}
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-section__header">
          <span className="filter-section__title">🔍 Lọc theo trạng thái</span>
          <select
            id="filter-select-mobile"
            className="filter-select-mobile form-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value as Status)}
            aria-label="Chọn bộ lọc"
          >
            <option value="All">Tất cả ({totalCount})</option>
            <option value="Incomplete">Chưa hoàn thành ({incompleteCount})</option>
            <option value="Completed">Đã hoàn thành ({completedCount})</option>
            <option value="Overdue">Quá hạn ({overdueCount})</option>
          </select>
        </div>

        <FilterTabs activeTab={filter} setActiveTab={setFilter}>
          <FilterTabs.Tab value="All" label={`Tất cả (${totalCount})`} />
          <FilterTabs.Tab value="Incomplete" label={`Chưa xong (${incompleteCount})`} />
          <FilterTabs.Tab value="Completed" label={`Đã xong (${completedCount})`} />
          <FilterTabs.Tab value="Overdue" label={`Quá hạn (${overdueCount})`} />
        </FilterTabs>
      </div>

      {/* Ô tìm kiếm với useDebounce */}
      <div className="search-bar">
        <input
          id="search-input"
          type="search"
          className="form-input search-input"
          placeholder="🔍 Tìm theo tên bài tập hoặc môn học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Tìm kiếm bài tập"
        />
        {debouncedSearch !== searchTerm && (
          <span className="search-debouncing" aria-live="polite">⏳</span>
        )}
        {searchTerm && (
          <button
            className="btn btn-ghost search-clear"
            onClick={() => setSearchTerm('')}
            aria-label="Xoá tìm kiếm"
          >
            ✕
          </button>
        )}
      </div>

      {/* Loading state */}
      {status === 'loading' && (
        <div className="loading-state" role="status">
          <div className="loading-spinner" />
          Đang tải dữ liệu...
        </div>
      )}

      {/* Error state */}
      {status === 'failed' && (
        <div className="error-state" role="alert">
          ❌ Không thể tải dữ liệu: {error ?? 'Lỗi không xác định'}
        </div>
      )}

      {/* Danh sách – dùng Virtualization khi có nhiều bài */}
      {status !== 'loading' && (
        <>
          {filteredItems.length > 0 && debouncedSearch && (
            <div className="search-results-count" aria-live="polite">
              Tìm thấy <strong>{filteredItems.length}</strong> kết quả cho &quot;{debouncedSearch}&quot;
            </div>
          )}
          <ul className="assignment-list">
            <VirtualizedList
              items={filteredItems}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          </ul>
        </>
      )}
    </div>
  );
}
