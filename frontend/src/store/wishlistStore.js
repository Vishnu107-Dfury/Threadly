import { create } from 'zustand';

const WISHLIST_KEY = 'threadly_wishlist';

export const useWishlistStore = create((set, get) => ({
  items: (() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })(),

  toggleWishlist: (product) => {
    const { items } = get();
    const id = product._id || product.style_code;
    const exists = items.some((i) => (i._id || i.style_code) === id);

    let updated;
    if (exists) {
      updated = items.filter((i) => (i._id || i.style_code) !== id);
    } else {
      updated = [...items, product];
    }

    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    set({ items: updated });
    return !exists;
  },

  isWishlisted: (productId) => {
    const { items } = get();
    return items.some((i) => (i._id || i.style_code) === productId);
  },

  clearWishlist: () => {
    try {
      localStorage.removeItem(WISHLIST_KEY);
    } catch {}
    set({ items: [] });
  }
}));
