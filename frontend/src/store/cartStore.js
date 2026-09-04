import { create } from 'zustand';
import api from '../services/api';

const useCartStore = create((set, get) => ({
  cart: { items: [] },
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/cart');
      set({ cart: response.data, loading: false, error: null });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addToCart: async (productId) => {
    set({ loading: true });
    try {
      const response = await api.post('/cart/items', { productId });
      set({ cart: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  removeFromCart: async (productId) => {
    set({ loading: true });
    try {
      const response = await api.delete(`/cart/items/${productId}`);
      set({ cart: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  clearCart: async () => {
    set({ loading: true });
    try {
      await api.delete('/cart');
      set({ cart: { items: [] }, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

export default useCartStore;
