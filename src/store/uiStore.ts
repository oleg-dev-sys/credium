import { create } from 'zustand';
import type { UIState } from '@/types';

export const useUIStore = create<UIState>((set) => ({
  isSearching: false,
  isMobileMenuOpen: false,
  setSearching: (searching) => set({ isSearching: searching }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
}));
