import {create} from "zustand"

export const useSidebar = create((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}))