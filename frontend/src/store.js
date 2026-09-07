import { create } from 'zustand';

const useStore = create((set) => ({
  user: null, // {id, name, email, role, token}
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),

  // Cart
  cart: [],
  addToCart: (item, quantity) => set((state) => {
    const existing = state.cart.find(i => i.item._id === item._id);
    if (existing) {
      return { cart: state.cart.map(i => i.item._id === item._id ? { ...i, quantity: i.quantity + quantity } : i) };
    }
    return { cart: [...state.cart, { item, quantity }] };
  }),
  clearCart: () => set({ cart: [] }),
}));

export default useStore;
