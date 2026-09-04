import { create } from 'zustand';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  dbUser: null,
  loading: true,
  
  initialize: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        set({ user, loading: true });
        try {
          // Sync with backend to get dbUser details
          const response = await api.post('/auth/sync');
          set({ dbUser: response.data, loading: false });
        } catch (error) {
          console.error('Failed to sync user with backend:', error);
          set({ loading: false });
        }
      } else {
        set({ user: null, dbUser: null, loading: false });
      }
    });
  },

  logout: async () => {
    await auth.signOut();
    set({ user: null, dbUser: null });
  }
}));

export default useAuthStore;
