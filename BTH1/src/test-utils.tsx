import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import assignmentsReducer from './features/assignments/assignmentsSlice';
import type { RootState } from './app/store';

const rootReducer = combineReducers({
  assignments: assignmentsReducer,
});

/**
 * Tạo store riêng biệt cho test – KHÔNG import app/store.ts để tránh import.meta.
 * Cũng không thêm redux-logger để giữ output test gọn.
 */
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as any,
  });
}

type AppStore = ReturnType<typeof setupStore>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

/**
 * Wrapper bọc <Provider> với store test (không có logger, không có import.meta).
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
