import { create } from 'zustand';
import { supabase } from '../supabase/client';
import type { Listing } from '@/lib/shared/types';

interface FavoriteState {
  favorites: Listing[];
  favoriteIds: string[];
  isLoading: boolean;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (listing: Listing) => Promise<void>;
  isFavorite: (listingId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],
  favoriteIds: [],
  isLoading: false,

  fetchFavorites: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      set({ favorites: [], favoriteIds: [] });
      return;
    }

    set({ isLoading: true });

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('listing_id, listings(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const favorites = (data || [])
        .map((item: any) => item.listings)
        .filter((listing: Listing | null) => listing !== null) as Listing[];

      set({
        favorites,
        favoriteIds: favorites.map((l) => l.id),
        isLoading: false,
      });
    } catch (error) {
      console.error('[DEBUG] Fetch favorites error:', error);
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (listing: Listing) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const userId = session.user.id;
    const isFav = get().favoriteIds.includes(listing.id);

    if (isFav) {
      // Remove from favorites
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('listing_id', listing.id);

      if (error) {
        console.error('[DEBUG] Remove favorite error:', error);
        return;
      }

      set({
        favorites: get().favorites.filter((l) => l.id !== listing.id),
        favoriteIds: get().favoriteIds.filter((id) => id !== listing.id),
      });
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, listing_id: listing.id }]);

      if (error) {
        console.error('[DEBUG] Add favorite error:', error);
        return;
      }

      set({
        favorites: [listing, ...get().favorites],
        favoriteIds: [...get().favoriteIds, listing.id],
      });
    }
  },

  isFavorite: (listingId: string) => {
    return get().favoriteIds.includes(listingId);
  },
}));