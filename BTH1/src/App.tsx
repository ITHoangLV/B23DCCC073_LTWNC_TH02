import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchInitialAssignments, toggleComplete, deleteAssignment } from './features/assignments/assignmentsSlice';
import { FilterTabs } from './components/FilterTabs';
import { AssignmentForm } from './components/AssignmentForm';
import { useDeadlineCalculator } from './hooks/useDeadlineCalculator';
import { isOverdue } from './types';
import type { Status, Assignment } from './types';
import './index.css';

function App() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector(state => state.assignments);
  const [filter, setFilter] = useState<Status>('All');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchInitialAssignments());
  }, [status, dispatch]);

  const filteredItems = items.filter(item => {
    if (filter === 'Completed') return item.completed;
    if (filter === 'Incomplete') return !item.completed;
    if (filter === 'Overdue') return isOverdue(item);
    return true;
  });

  const totalCount = items.length;
  const completedCount = items.filter(i => i.completed).length;
  const overdueCount = items.filter(i => isOverdue(i)).length;
  const incompleteCount = items.filter(i => !i.completed).length;

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__eyebrow">
          📚 Quản lý học tập
        </div>
        <h1 className="app-header__title">Student Deadline Tracker</h1>
        <p className="app-header__subtitle">Theo dõi tiến độ bài tập — không bao giờ trễ deadline nữa</p>
      </header>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-card__value">{totalCount}</div>
          <div className="stat-card__label">Tổng bài</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value" style={{ color: '#6ee7b7' }}>{completedCount}</div>
          <div className="stat-card__label">Đã xong</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value" style={{ color: '#fcd34d' }}>{incompleteCount}</div>
          <div className="stat-card__label">Chưa xong</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value" style={{ color: '#f87171' }}>{overdueCount}</div>
          <div className="stat-card__label">Quá hạn</div>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card">
        <div className="glass-card__title">Thêm bài tập mới</div>
        <AssignmentForm />
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-section__header">
          <span className="filter-section__title">🔍 Lọc theo trạng thái</span>
          <select
            id="filter-select-mobile"
            className="filter-select-mobile form-input"
            value={filter}
            onChange={e => setFilter(e.target.value as Status)}
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

      {/* Loading */}
      {status === 'loading' && (
        <div className="loading-state">
          <div className="loading-spinner" />
          Đang tải dữ liệu...
        </div>
      )}

      {/* List */}
      <ul className="assignment-list">
        {filteredItems.length === 0 && status !== 'loading' && (
          <div className="empty-state">
            <div className="empty-state__icon">✨</div>
            <div className="empty-state__text">Không có bài tập nào</div>
            <div className="empty-state__sub">Hãy thêm bài tập mới hoặc chọn bộ lọc khác</div>
          </div>
        )}
        {filteredItems.map(item => (
          <AssignmentItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function AssignmentItem({ item }: { item: Assignment }) {
  const dispatch = useAppDispatch();
  const timeText = useDeadlineCalculator(item);
  const overdue = isOverdue(item);

  let itemClass = 'assignment-item';
  if (overdue) itemClass += ' assignment-item--overdue';
  if (item.completed) itemClass += ' assignment-item--completed';

  return (
    <li className={itemClass}>
      {/* Checkbox */}
      <div
        id={`checkbox-${item.id}`}
        className={`item-checkbox ${item.completed ? 'item-checkbox--checked' : ''}`}
        onClick={() => dispatch(toggleComplete(item.id))}
        role="checkbox"
        aria-checked={item.completed}
        title={item.completed ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
      >
        {item.completed && <span className="item-checkbox__icon">✓</span>}
      </div>

      {/* Content */}
      <div className="item-content">
        <div className="item-meta">
          <span className="item-subject">{item.subject}</span>
          <span className={`priority-badge priority-badge--${item.priority}`}>
            {item.priority === 'High' ? '🔴 Cao' : item.priority === 'Medium' ? '🟡 Trung bình' : '🟢 Thấp'}
          </span>
        </div>
        <div className={`item-title ${item.completed ? 'item-title--completed' : ''}`}>
          {item.title}
        </div>
        <div className={`item-time ${overdue ? 'item-time--overdue' : item.completed ? '' : 'item-time--ok'}`}>
          {overdue ? '⚠️' : item.completed ? '✅' : '⏰'} {timeText}
        </div>
      </div>

      {/* Actions */}
      <div className="item-actions">
        <button
          id={`toggle-${item.id}`}
          className="btn btn-ghost"
          onClick={() => dispatch(toggleComplete(item.id))}
        >
          {item.completed ? '↩ Hoàn tác' : '✓ Xong'}
        </button>
        <button
          id={`delete-${item.id}`}
          className="btn btn-danger"
          onClick={() => dispatch(deleteAssignment(item.id))}
        >
          🗑
        </button>
      </div>
    </li>
  );
}

export default App;