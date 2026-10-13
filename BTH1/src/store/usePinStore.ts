import { create } from 'zustand';

interface PinState {
  pinnedIds: string[];
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
}

export const usePinStore = create<PinState>((set, get) => ({
  pinnedIds: [],

  togglePin: (id: string) =>
    set((state) => ({
      pinnedIds: state.pinnedIds.includes(id)
        ? state.pinnedIds.filter((pid) => pid !== id)
        : [...state.pinnedIds, id],
    })),

  // isPinned trả về hàm ổn định nếu gọi store.getState().isPinned
  isPinned: (id: string) => get().pinnedIds.includes(id),
}));
