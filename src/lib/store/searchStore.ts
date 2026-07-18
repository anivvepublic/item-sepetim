import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchStore {
  query: string;
  recentSearches: string[];
  popularSearches: string[];
  setQuery: (query: string) => void;
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
  removeRecentSearch: (search: string) => void;
}

const POPULAR_SEARCHES = [
  'Valorant Hesap',
  'Mobile Legends',
  'PUBG Mobile',
  'CS2 Skin',
  'LoL Hesap',
  'Wild Rift',
  'Roblox',
  'Steam Hesap',
];

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      query: '',
      recentSearches: [],
      popularSearches: POPULAR_SEARCHES,

      setQuery: (query: string) => set({ query }),

      addRecentSearch: (search: string) => {
        const trimmed = search.trim();
        if (!trimmed) return;

        const current = get().recentSearches;
        // Aynı arama varsa kaldır, başa ekle
        const filtered = current.filter((s: string) => s.toLowerCase() !== trimmed.toLowerCase());
        const updated = [trimmed, ...filtered].slice(0, 8);
        set({ recentSearches: updated });
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      removeRecentSearch: (search: string) => {
        set({
          recentSearches: get().recentSearches.filter((s: string) => s !== search),
        });
      },
    }),
    {
      name: 'item-sepetim-search',
    }
  )
);