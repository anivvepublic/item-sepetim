import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { showToast } from '@/components/ui/Toast';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  game: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item: CartItem) => {
        const currentItems = get().items;
        const exists = currentItems.find((i: CartItem) => i.id === item.id);
        
        if (exists) {
          showToast('Bu ürün zaten sepetinizde bulunuyor', 'info');
          return;
        }

        set({ items: [...currentItems, item] });
        showToast(`${item.title} sepete eklendi`, 'success');
      },

      removeItem: (id: string) => {
        set({ items: get().items.filter((item: CartItem) => item.id !== id) });
        showToast('Ürün sepetten çıkarıldı', 'info');
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce((total: number, item: CartItem) => total + item.price, 0);
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'item-sepetim-cart', // localStorage anahtarı
    }
  )
);