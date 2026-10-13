import { configureStore } from '@reduxjs/toolkit';
// redux-logger: import tất cả để tương thích cả ESM và CJS
import * as reduxLoggerPkg from 'redux-logger';
import assignmentsReducer from '../features/assignments/assignmentsSlice';

// Hỗ trợ cả CJS (module.exports = createLogger) và ESM (export { createLogger })
const createLogger =
  (reduxLoggerPkg as unknown as { createLogger: typeof reduxLoggerPkg.createLogger }).createLogger ??
  (reduxLoggerPkg as unknown as { default: { createLogger: typeof reduxLoggerPkg.createLogger } }).default?.createLogger;

export const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
  },
  // Chỉ thêm logger ở môi trường development để không làm chậm production.
  // getDefault().concat() giữ nguyên redux-thunk mặc định.
  middleware: (getDefault) => {
    if (import.meta.env.DEV && createLogger) {
      const logger = createLogger({ collapsed: true });
      return getDefault().concat(logger);
    }
    return getDefault();
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;