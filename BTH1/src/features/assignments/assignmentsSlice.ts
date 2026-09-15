import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Assignment, NewAssignment } from '../../types';

export const fetchInitialAssignments = createAsyncThunk(
  'assignments/fetchInitial',
  async () => {
    return new Promise<Assignment[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            subject: 'Lập trình Web Nâng cao',
            title: 'Bài thực hành 1',
            dueDate: new Date(Date.now() + 86400000).toISOString(), // Ngày mai
            priority: 'High',
            completed: false
          },
          {
            id: '2',
            subject: 'Kiến trúc phần mềm',
            title: 'Bài tập giữa kỳ',
            dueDate: new Date(Date.now() - 86400000).toISOString(), // Hôm qua
            priority: 'Medium',
            completed: false
          }
        ]);
      }, 1000);
    });
  }
);

interface AssignmentsState {
  items: Assignment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AssignmentsState = { items: [], status: 'idle' };

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: (state, action: PayloadAction<NewAssignment>) => {
      state.items.push({
        ...action.payload,
        id: Date.now().toString(),
        completed: false
      });
    },
    toggleComplete: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.completed = !item.completed;
    },
    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialAssignments.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchInitialAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      });
  }
});

export const { addAssignment, toggleComplete, deleteAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;