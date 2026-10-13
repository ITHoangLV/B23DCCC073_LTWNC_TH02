import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeTab: 'list' | 'stats';
  onTabChange: (tab: 'list' | 'stats') => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="app-header__top">
        <div>
          <div className="app-header__eyebrow">📚 Quản lý học tập</div>
          <h1 className="app-header__title">Student Deadline Tracker</h1>
          <p className="app-header__subtitle">Theo dõi tiến độ bài tập — không bao giờ trễ deadline nữa</p>
        </div>

        <button
          id="btn-toggle-theme"
          className="btn btn-ghost btn-theme-toggle"
          onClick={toggleTheme}
          aria-label={`Chuyển sang chế độ ${theme === 'dark' ? 'sáng' : 'tối'}`}
          title={`Chế độ ${theme === 'dark' ? 'sáng' : 'tối'}`}
        >
          {theme === 'dark' ? '☀️ Sáng' : '🌙 Tối'}
        </button>
      </div>

      {/* Tab chuyển giữa Danh sách và Thống kê */}
      <nav className="header-tabs" role="tablist" aria-label="Điều hướng chính">
        <button
          role="tab"
          id="tab-list"
          className={`header-tab ${activeTab === 'list' ? 'header-tab--active' : ''}`}
          aria-selected={activeTab === 'list'}
          onClick={() => onTabChange('list')}
        >
          📋 Danh sách
        </button>
        <button
          role="tab"
          id="tab-stats"
          className={`header-tab ${activeTab === 'stats' ? 'header-tab--active' : ''}`}
          aria-selected={activeTab === 'stats'}
          onClick={() => onTabChange('stats')}
        >
          📊 Thống kê
        </button>
      </nav>
    </header>
  );
}
