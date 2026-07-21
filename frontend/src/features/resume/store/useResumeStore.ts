import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ViewMode = 'grid' | 'list';
type SortBy = 'newest' | 'oldest' | 'updated' | 'alphabetical' | 'completion' | 'favorites' | 'created';
type FilterBy = 'ALL' | 'DRAFT' | 'IN_PROGRESS' | 'READY' | 'ARCHIVED' | 'TRASH' | 'FAVORITES';

interface ResumeState {
  viewMode: ViewMode;
  searchQuery: string;
  sortBy: SortBy;
  filterBy: FilterBy;
  
  // Actions
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortBy) => void;
  setFilterBy: (filter: FilterBy) => void;
  resetFilters: () => void;
}

export const useResumeStore = create<ResumeState>()(
  devtools(
    (set) => ({
      viewMode: 'grid',
      searchQuery: '',
      sortBy: 'newest',
      filterBy: 'ALL',

      setViewMode: (mode) => set({ viewMode: mode }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setFilterBy: (filter) => set({ filterBy: filter }),
      resetFilters: () => set({ searchQuery: '', sortBy: 'newest', filterBy: 'ALL' }),
    }),
    { name: 'ResumeStore' }
  )
);
