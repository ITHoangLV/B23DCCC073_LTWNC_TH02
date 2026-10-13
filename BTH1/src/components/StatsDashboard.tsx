import { useAppSelector } from '../app/hooks';
import { isOverdue, calcStats } from '../utils/deadlineUtils';

/**
 * StatsDashboard – được lazy-load qua React.lazy + Suspense trong App.tsx.
 * Chỉ tải khi người dùng bấm tab "Thống kê" lần đầu.
 */
export default function StatsDashboard() {
  const items = useAppSelector((state) => state.assignments.items);
  const stats = calcStats(items);

  const subjects = Object.entries(stats.bySubject).sort((a, b) => b[1] - a[1]);

  return (
    <div className="stats-dashboard">
      <h2 className="stats-dashboard__title">📊 Thống kê chi tiết</h2>

      {/* Tổng quan */}
      <div className="stats-bar stats-bar--large">
        <div className="stat-card">
          <div className="stat-card__value">{stats.total}</div>
          <div className="stat-card__label">Tổng bài</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value" style={{ color: 'var(--color-success)' }}>
            {stats.completed}
          </div>
          <div className="stat-card__label">Đã xong</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value" style={{ color: 'var(--color-warning)' }}>
            {stats.incomplete}
          </div>
          <div className="stat-card__label">Chưa xong</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value" style={{ color: 'var(--color-danger)' }}>
            {stats.overdue}
          </div>
          <div className="stat-card__label">Quá hạn</div>
        </div>
      </div>

      {/* Progress bar */}
      {stats.total > 0 && (
        <div className="progress-section">
          <div className="progress-section__label">
            Tiến độ hoàn thành: <strong>{((stats.completed / stats.total) * 100).toFixed(1)}%</strong>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Theo môn học */}
      <div className="stats-by-subject">
        <h3 className="stats-by-subject__title">📚 Theo môn học</h3>
        {subjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📭</div>
            <div className="empty-state__text">Chưa có bài tập nào</div>
          </div>
        ) : (
          <ul className="subject-list">
            {subjects.map(([subject, count]) => {
              const subjectItems = items.filter((i) => i.subject === subject);
              const completedCount = subjectItems.filter((i) => i.completed).length;
              const overdueCount = subjectItems.filter((i) => isOverdue(i)).length;
              const percentage = Math.round((completedCount / count) * 100);

              return (
                <li key={subject} className="subject-item">
                  <div className="subject-item__header">
                    <span className="subject-item__name">{subject}</span>
                    <span className="subject-item__count">
                      {completedCount}/{count} bài • {overdueCount > 0 && <span style={{ color: 'var(--color-danger)' }}>{overdueCount} quá hạn</span>}
                    </span>
                  </div>
                  <div className="progress-bar-track progress-bar-track--sm">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
