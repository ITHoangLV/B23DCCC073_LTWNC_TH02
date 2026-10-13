import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Assignment, NewAssignment } from '../../types';
import { fetchAssignments } from '../../api/assignmentsApi';

// Thunk dùng API tách riêng để jest.mock được
export const fetchInitialAssignments = createAsyncThunk(
  'assignments/fetchInitial',
  async () => {
    const data = await fetchAssignments();
    return data;
  }
);

interface AssignmentsState {
  items: Assignment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AssignmentsState = { items: [], status: 'idle', error: null };

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: (state, action: PayloadAction<NewAssignment>) => {
      state.items.push({
        ...action.payload,
        id: Date.now().toString(),
        completed: false,
      });
    },
    toggleComplete: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.completed = !item.completed;
    },
    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    // Nạp 10.000 bài tập stress test – tên action thống nhất theo kế hoạch
    loadStressTestData: (state, action: PayloadAction<Assignment[]>) => {
      state.items = action.payload;
      state.status = 'succeeded';
    },
    // Xoá toàn bộ, đặt lại idle để có thể fetch lại ban đầu
    clearAll: (state) => {
      state.items = [];
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialAssignments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInitialAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchInitialAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Có lỗi xảy ra';
      });
  },
});

export const { addAssignment, toggleComplete, deleteAssignment, loadStressTestData, clearAll } =
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;