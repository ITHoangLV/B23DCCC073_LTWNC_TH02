import { lazy, Suspense, useState } from 'react';
import { Header } from './components/Header';
import { AssignmentList } from './features/assignments/AssignmentList';
import { Spinner } from './components/Spinner';
import './index.css';

// React.lazy: StatsDashboard chỉ tải khi người dùng bấm tab Thống kê lần đầu
const StatsDashboard = lazy(() => import('./components/StatsDashboard'));

function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');

  return (
    <div className="app-wrapper">
      {/* Header: nơi duy nhất dùng useTheme – đổi theme không re-render các component khác */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main className="app-main">
        {activeTab === 'list' ? (
          <AssignmentList />
        ) : (
          // Suspense fallback hiển thị spinner khi lazy chunk đang tải
          <Suspense fallback={<Spinner />}>
            <StatsDashboard />
          </Suspense>
        )}
      </main>
    </div>
  );
}

export default App;