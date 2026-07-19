import { create } from 'zustand';
import { shopierPaymentService, type CreateShopierOrderParams, type ShopierPaymentResult } from '@/lib/services/shopier';
import { useAuthStore } from './authStore';

export interface PaymentItem {
  id: string;
  listingId: string;
  title: string;
  price: number;
  image?: string;
  game?: string;
  sellerId: string;
}

export interface PaymentState {
  items: PaymentItem[];
  isLoading: boolean;
  lastResult: ShopierPaymentResult | null;
  error: string | null;

  setPaymentItems: (items: PaymentItem[]) => void;
  addPaymentItem: (item: PaymentItem) => void;
  removeByListingId: (listingId: string) => void;
  clearPaymentItems: () => void;
  startPayment: (returnUrl?: string, callbackUrl?: string) => Promise<ShopierPaymentResult>;
  reset: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  items: [],
  isLoading: false,
  lastResult: null,
  error: null,

  setPaymentItems: (items: PaymentItem[]) => {
    set({ items, error: null, lastResult: null });
  },

  addPaymentItem: (item: PaymentItem) => {
    const currentItems = get().items;
    const exists = currentItems.find((i) => i.listingId === item.listingId);
    if (exists) {
      set({ items: currentItems });
      return;
    }
    set({ items: [...currentItems, item], error: null, lastResult: null });
  },

  removeByListingId: (listingId: string) => {
    set({ items: get().items.filter((i) => i.listingId !== listingId) });
  },

  clearPaymentItems: () => {
    set({ items: [], error: null, lastResult: null });
  },

  startPayment: async (returnUrl?: string, callbackUrl?: string) => {
    const { items } = get();
    const user = useAuthStore.getState().user;

    if (items.length === 0) {
      const error = 'Odeme icin en az bir urun secilmeli';
      set({ error });
      return { success: false, error };
    }

    if (!user) {
      const error = 'Odemeye devam etmek icin giris yapmalisiniz';
      set({ error });
      return { success: false, error };
    }

    set({ isLoading: true, error: null, lastResult: null });

    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const names = (user.username || user.email).split(' ');
      const firstName = names[0] || 'Kullanici';
      const lastName = names.slice(1).join(' ') || 'ItemSepetim';

      const params: CreateShopierOrderParams = {
        orderId,
        buyer: {
          id: user.id,
          email: user.email,
          firstName,
          lastName,
        },
        items: items.map((item) => ({
          id: item.listingId,
          name: item.title,
          price: item.price,
          quantity: 1,
        })),
        currency: 'TRY',
        conversationId: orderId,
        returnUrl,
        callbackUrl,
      };

      const result = await shopierPaymentService.createOrder(params);

      set({ lastResult: result, isLoading: false });
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Odeme baslatilirken hata olustu';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  reset: () => {
    set({ items: [], isLoading: false, lastResult: null, error: null });
  },
}));

export default usePaymentStore;
