import { memo } from 'react';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
import type { Assignment } from '../types';
import AssignmentCard from './AssignmentCard';

interface VirtualizedListProps {
  items: Assignment[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

interface ItemData {
  items: Assignment[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

// Row renderer cho FixedSizeList – bọc memo để tránh re-render vô ích khi scroll
const Row = memo(({ index, style, data }: ListChildComponentProps<ItemData>) => {
  const { items, onToggleComplete, onDelete } = data;
  const item = items[index];

  if (!item) return null;

  return (
    <AssignmentCard
      key={item.id}
      item={item}
      onToggleComplete={onToggleComplete}
      onDelete={onDelete}
      style={style}
    />
  );
});

Row.displayName = 'VirtualizedRow';

/**
 * VirtualizedList dùng react-window FixedSizeList.
 * Chỉ render ~10-15 item đang hiển thị, dù danh sách có 10.000 phần tử.
 */
export const VirtualizedList = memo(function VirtualizedList({
  items,
  onToggleComplete,
  onDelete,
}: VirtualizedListProps) {
  // itemData phải ổn định – các callback đã bọc useCallback ở component cha
  const itemData: ItemData = { items, onToggleComplete, onDelete };

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">✨</div>
        <div className="empty-state__text">Không có bài tập nào</div>
        <div className="empty-state__sub">Hãy thêm bài tập mới hoặc chọn bộ lọc khác</div>
      </div>
    );
  }

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={120}
      width="100%"
      itemData={itemData}
      overscanCount={5}
      className="virtualized-list"
    >
      {Row}
    </FixedSizeList>
  );
});
