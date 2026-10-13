import React, { memo, useCallback } from 'react';
import type { Assignment } from '../types';
import { isOverdue, formatDeadlineText } from '../utils/deadlineUtils';
import { usePinStore } from '../store/usePinStore';

interface AssignmentCardProps {
  item: Assignment;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  /** style inject từ react-window khi dùng FixedSizeList */
  style?: React.CSSProperties;
}

/**
 * AssignmentCard bọc React.memo:
 * chỉ re-render khi item / callback thay đổi.
 * Tự gọi usePinStore để không cần truyền onTogglePin qua prop.
 */
const AssignmentCard = memo(function AssignmentCard({
  item,
  onToggleComplete,
  onDelete,
  style,
}: AssignmentCardProps) {
  // Subscribe chỉ đúng selector này – card khác ghim/bỏ không ảnh hưởng card này
  const pinned = usePinStore((s) => s.pinnedIds.includes(item.id));
  const togglePin = usePinStore((s) => s.togglePin);

  const handleToggle = useCallback(() => onToggleComplete(item.id), [item.id, onToggleComplete]);
  const handleDelete = useCallback(() => onDelete(item.id), [item.id, onDelete]);
  const handlePin = useCallback(() => togglePin(item.id), [item.id, togglePin]);

  const overdue = isOverdue(item);
  const timeText = formatDeadlineText(item);

  let itemClass = 'assignment-item';
  if (overdue) itemClass += ' assignment-item--overdue';
  if (item.completed) itemClass += ' assignment-item--completed';
  if (pinned) itemClass += ' assignment-item--pinned';

  return (
    <li className={itemClass} style={style}>
      {/* Pin badge */}
      {pinned && <span className="pin-badge">📌 Đã ghim</span>}

      {/* Checkbox */}
      <div
        id={`checkbox-${item.id}`}
        className={`item-checkbox ${item.completed ? 'item-checkbox--checked' : ''}`}
        onClick={handleToggle}
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
            {item.priority === 'High'
              ? '🔴 Cao'
              : item.priority === 'Medium'
              ? '🟡 Trung bình'
              : '🟢 Thấp'}
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
          id={`pin-${item.id}`}
          className={`btn btn-ghost ${pinned ? 'btn-pin--active' : ''}`}
          onClick={handlePin}
          title={pinned ? 'Bỏ ghim' : 'Ghim bài tập này'}
          aria-label={pinned ? 'Bỏ ghim' : 'Ghim'}
        >
          {pinned ? '📌' : '📍'}
        </button>
        <button
          id={`toggle-${item.id}`}
          className="btn btn-ghost"
          onClick={handleToggle}
        >
          {item.completed ? '↩ Hoàn tác' : '✓ Xong'}
        </button>
        <button
          id={`delete-${item.id}`}
          className="btn btn-danger"
          onClick={handleDelete}
        >
          🗑
        </button>
      </div>
    </li>
  );
});

export default AssignmentCard;
