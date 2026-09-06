import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const applyTheme = (theme) => {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light', // default clean light mode
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      toggleTheme: () => {
        const current = get().theme;
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        set({ theme: next });
      },
      initTheme: () => {
        applyTheme(get().theme);
      }
    }),
    {
      name: 'threadly-theme-storage',
    }
  )
);

export default useThemeStore;
