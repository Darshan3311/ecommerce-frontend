import { create } from 'zustand';
import CartService from '../services/cart.service';
import useAuthStore from './useAuthStore';

const useCartStore = create((set, get) => ({
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
  isLoading: false,

  // Calculate totals
  calculateTotals: () => {
    const items = get().items;
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    set({ subtotal, tax, total });
  },

  // Set cart
  setCart: (cart) => {
    // Normalize items so each item has: product (object with _id), price, quantity
    const rawItems = cart?.items || [];
    const normalizedItems = rawItems.map(item => {
      // Server shape: item.product is populated object
      if (item.product && item.product._id) {
        return {
          _id: item._id || `${item.product._id}-${item.quantity}`,
          product: item.product,
          price: item.price ?? item.product.price,
          quantity: item.quantity
        };
      }

      // Local shape: item.productId and item.product
      if (item.productId && item.product) {
        return {
          _id: item._id || `${item.productId}-${item.quantity}`,
          product: item.product,
          price: item.price ?? item.product.price,
          quantity: item.quantity
        };
      }

      // Fallback: try to interpret minimal shape
      return {
        _id: item._id || item.productId || item.product?._id || Math.random().toString(36).slice(2),
        product: item.product || {},
        price: item.price ?? item.product?.price ?? 0,
        quantity: item.quantity ?? 1
      };
    });

    const subtotal = cart?.subtotal ?? normalizedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = cart?.tax ?? subtotal * 0.08;
    const total = cart?.total ?? subtotal + tax;

    set({
      items: normalizedItems,
      subtotal,
      tax,
      total
    });
  },

  // Fetch cart from server
  fetchCart: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      const localCart = CartService.getLocalCart();
      console.log('Loading local cart:', localCart);
      get().setCart(localCart);
      return;
    }

    set({ isLoading: true });
    try {
      const cart = await CartService.getCart();
      console.log('Fetched cart from server:', cart);
      get().setCart(cart);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch cart:', error);
      console.error('Error details:', error.response?.data);
    }
  },

  // Add to cart
  addToCart: async (product, quantity = 1) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      const cart = CartService.addToLocalCart(product, quantity);
      console.log('Added to local cart:', cart);
      get().setCart(cart);
      return;
    }

    set({ isLoading: true });
    try {
      // Optimistic UI update: add product locally first
      const prevItems = get().items || [];
      const existingIndex = prevItems.findIndex(it => it.product._id === product._id);
      let optimisticItems = [...prevItems];
      if (existingIndex > -1) {
        optimisticItems[existingIndex] = {
          ...optimisticItems[existingIndex],
          quantity: optimisticItems[existingIndex].quantity + quantity
        };
      } else {
        optimisticItems.push({
          _id: `${product._id}-${Date.now()}`,
          product,
          price: product.price || 0,
          quantity
        });
      }

      const subtotal = optimisticItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
      const tax = subtotal * 0.08;
      const total = subtotal + tax;
      set({ items: optimisticItems, subtotal, tax, total });

      // Call API to add; then refresh authoritative cart from server
      await CartService.addToCart(product._id, quantity);
      const serverCart = await CartService.getCart();
      if (serverCart && serverCart.items) {
        console.log('Added to cart response (refreshed):', serverCart);
        get().setCart(serverCart);
      } else {
        console.warn('Server did not return authoritative cart after add; keeping optimistic UI');
      }
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Add to cart error in store:', error);
      // On error, rollback by refetching authoritative cart
      try {
        await get().fetchCart();
      } catch (e) {
        console.error('Rollback fetch failed:', e);
      }
      throw error;
    }
  },

  // Update cart item
  updateCartItem: async (productId, quantity) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      // Handle local cart update
      const cart = CartService.getLocalCart();
      const itemIndex = cart.items.findIndex(item => item.productId === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        CartService.saveLocalCart(cart);
        get().setCart(cart);
      }
      return;
    }

    // Optimistic update: update UI immediately, then call API
    const prevCart = get().items;
    try {
      // apply optimistic change
      const newItems = prevCart.map(item => {
        if (item.product._id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      // recalc totals locally
      const subtotal = newItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
      const tax = subtotal * 0.08;
      const total = subtotal + tax;
      set({ items: newItems, subtotal, tax, total });

      // call server
      await CartService.updateCartItem(productId, quantity);
      // Refresh authoritative cart
      const cart = await CartService.getCart();
      console.log('updateCartItem response (refreshed):', cart);
      get().setCart(cart);
    } catch (error) {
      // rollback
      get().setCart({ items: prevCart });
      console.error('Update cart item failed, rolled back', error);
      throw error;
    }
  },

  // Remove from cart
  removeFromCart: async (productId) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      const cart = CartService.removeFromLocalCart(productId);
      get().setCart(cart);
      return;
    }

    // Optimistic removal: remove from UI immediately
    const prevCart = get().items;
    try {
      const newItems = prevCart.filter(item => item.product._id !== productId);
      const subtotal = newItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
      const tax = subtotal * 0.08;
      const total = subtotal + tax;
      set({ items: newItems, subtotal, tax, total });

      // call server
      await CartService.removeFromCart(productId);
      // Refresh authoritative cart
      const cart = await CartService.getCart();
      console.log('removeFromCart response (refreshed):', cart);
      get().setCart(cart);
    } catch (error) {
      // rollback
      get().setCart({ items: prevCart });
      console.error('Remove from cart failed, rolled back', error);
      throw error;
    }
  },

  // Clear cart
  clearCart: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (!isAuthenticated) {
      CartService.clearLocalCart();
      set({ items: [], subtotal: 0, tax: 0, total: 0 });
      return;
    }

    set({ isLoading: true });
    try {
      await CartService.clearCart();
      set({ items: [], subtotal: 0, tax: 0, total: 0, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Sync cart after login
  syncCart: async () => {
    const localCart = CartService.getLocalCart();
    if (localCart.items.length > 0) {
      try {
        const cart = await CartService.syncCart(localCart.items);
        get().setCart(cart);
        CartService.clearLocalCart();
      } catch (error) {
        console.error('Failed to sync cart:', error);
      }
    } else {
      await get().fetchCart();
    }
  },

  // Get item count
  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  }
}));

export default useCartStore;
