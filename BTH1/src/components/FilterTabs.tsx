import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Status } from '../types';

interface FilterContextType {
  activeTab: Status;
  setActiveTab: (status: Status) => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterTabs({ activeTab, setActiveTab, children }: FilterContextType & { children: ReactNode }) {
  return (
    <FilterContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="filter-tabs" role="tablist" aria-label="Bộ lọc bài tập">
        {children}
      </div>
    </FilterContext.Provider>
  );
}

FilterTabs.Tab = function Tab({ value, label }: { value: Status; label: string }) {
  const ctx = useContext(FilterContext);
  if (!ctx) return null;
  const isActive = ctx.activeTab === value;

  return (
    <button
      id={`filter-tab-${value}`}
      role="tab"
      aria-selected={isActive}
      className={`filter-tab ${isActive ? 'filter-tab--active' : ''}`}
      onClick={() => ctx.setActiveTab(value)}
    >
      {label}
    </button>
  );
};