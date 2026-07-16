import { create } from 'zustand';
import { supabase } from '../supabase/client';
import type { Listing } from '@shared/types';

export interface Transaction {
  id: string;
  listing_id: string;
  buyer_id: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  listings?: Listing | null;
}

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
  getCompletedCount: () => number;
  getTotalSpent: () => number;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,

  fetchTransactions: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      set({ transactions: [], isLoading: false });
      return;
    }

    set({ isLoading: true });

    try {
      // İşlemleri getir
      const { data, error } = await supabase
        .from('transactions')
        .select('*, listings(*)')
        .eq('buyer_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({
        transactions: data || [],
        isLoading: false,
      });
    } catch (error) {
      console.error('[DEBUG] Fetch transactions error:', error);
      set({ isLoading: false });
    }
  },

  getCompletedCount: () => {
    return get().transactions.filter(t => t.status === 'completed').length;
  },

  getTotalSpent: () => {
    return get().transactions
      .filter(t => t.status === 'completed' && t.listings)
      .reduce((total, t) => total + (t.listings?.price || 0), 0);
  },
}));