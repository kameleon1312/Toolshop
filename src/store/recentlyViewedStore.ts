import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

const MAX_ITEMS = 12;

interface RecentlyViewedStore {
  items: Product[];
  add:   (product: Product) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      items: [],
      add: (product) =>
        set((state) => ({
          items: [product, ...state.items.filter((i) => i.id !== product.id)].slice(0, MAX_ITEMS),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'fancyshop-recently-viewed',
      version: 1,
      migrate: () => ({ items: [] }),
    }
  )
);
