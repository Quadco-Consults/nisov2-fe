import { create } from "zustand";

interface DateRange {
  from: Date;
  to: Date;
}

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  selectedChargeCode: string | null;
  setSelectedChargeCode: (code: string | null) => void;

  selectedAgingBucket: string | null;
  setSelectedAgingBucket: (bucket: string | null) => void;

  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  selectedChargeCode: null,
  setSelectedChargeCode: (code) => set({ selectedChargeCode: code }),

  selectedAgingBucket: null,
  setSelectedAgingBucket: (bucket) => set({ selectedAgingBucket: bucket }),

  dateRange: {
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  },
  setDateRange: (range) => set({ dateRange: range }),
}));
