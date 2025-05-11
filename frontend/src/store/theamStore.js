import { create } from "zustand";

const useThemeStore = create((set) => ({
  dark: false,
  toggleTheme: () => set((s) => ({ dark: !s.dark })),
}));

export default useThemeStore;
