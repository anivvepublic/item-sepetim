import type { Listing } from '@/lib/shared/types';
import type { Listing } from '@/lib/shared/types';
import { create } from 'zustand';
import { supabase } from '../supabase/client';
import type { Listing } from '@/lib/shared/types';

interface ListingState {
  listings: Listing[];
  isLoading: boolean;
  error: string | null;
  fetchListings: (filters?: {
    game?: string;
    category?: string;
    search?: string;
    status?: string;
  }) => Promise<void>;
  fetchListingById: (id: string) => Promise<Listing | null>;
}

export const useListingStore = create<ListingState>((set) => ({
  listings: [],
  isLoading: false,
  error: null,

  fetchListings: async (filters = {}) => {
    console.log('[DEBUG] Fetching listings with filters:', filters);
    set({ isLoading: true, error: null });

    try {
      let query = supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.game) {
        query = query.eq('game', filters.game);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      } else {
        // Default: only active listings
        query = query.eq('status', 'active');
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[DEBUG] Fetch listings error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('[DEBUG] Listings fetched successfully:', data);
      set({
        listings: data || [],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('[DEBUG] Fetch listings error:', error);
      const errorMessage = error?.message || 'İlanlar yüklenirken bir hata oluştu';
      set({
        listings: [],
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  fetchListingById: async (id: string) => {
    console.log('[DEBUG] Fetching listing by id:', id);

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('[DEBUG] Fetch listing error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('[DEBUG] Listing fetched successfully:', data);
      return data;
    } catch (error: any) {
      console.error('[DEBUG] Fetch listing error:', error);
      return null;
    }
  },
}));