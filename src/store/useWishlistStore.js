import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import wishlistService from '../services/wishlist.service';
import { toast } from 'react-hot-toast';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: null,
      loading: false,
      processing: false,

      // Fetch wishlist
      fetchWishlist: async () => {
        try {
          set({ loading: true });
          // wishlistService.getWishlist() returns the parsed response body
          // which follows { status, data }
          const res = await wishlistService.getWishlist();
          // res.data contains the wishlist document
          const wishlist = res.data;
          set({ wishlist, loading: false });
          return wishlist;
        } catch (error) {
          console.error('Fetch wishlist error:', error);
          set({ loading: false, wishlist: null });
          // Don't show error toast for unauthenticated users
          if (error.response?.status !== 401) {
            toast.error('Failed to load wishlist');
          }
          throw error;
        }
      },

      // Add to wishlist
      addToWishlist: async (productId) => {
        try {
          const res = await wishlistService.addToWishlist(productId);
          const wishlist = res.data;
          set({ wishlist });
          toast.success('Added to wishlist');
          return wishlist;
        } catch (error) {
          console.error('Add to wishlist error:', error);
          console.error('Error response:', error.response?.data);
          console.error('Error status:', error.response?.status);
          const message = error.response?.data?.message || 'Failed to add to wishlist';
          toast.error(message);
          throw error;
        }
      },

      // Remove from wishlist
      removeFromWishlist: async (productId) => {
        try {
          const res = await wishlistService.removeFromWishlist(productId);
          const wishlist = res.data;
          set({ wishlist });
          toast.success('Removed from wishlist');
          return wishlist;
        } catch (error) {
          console.error('Remove from wishlist error:', error);
          toast.error('Failed to remove from wishlist');
          throw error;
        }
      },

      // Toggle wishlist (add or remove) - SIMPLIFIED VERSION
      toggleWishlist: async (productId) => {
        const { processing } = get();
        
        // Prevent multiple simultaneous toggles
        if (processing) {
          return;
        }

        set({ processing: true });

        try {
          // Always fetch fresh data first
          const freshWishlist = await get().fetchWishlist();
          
          // Check if product is in the fresh wishlist data
          const isInWishlist = freshWishlist?.items?.some(item => {
            const itemId = typeof item.product === 'string' ? item.product : item.product?._id;
            return itemId === productId;
          });

          // Toggle based on current state
          if (isInWishlist) {
            await get().removeFromWishlist(productId);
          } else {
            await get().addToWishlist(productId);
          }
        } catch (error) {
          // If fetch failed (401), user is not authenticated
          if (error.response?.status === 401) {
            toast.error('Please login to use wishlist');
            return;
          }
          
          // Handle other errors silently (already shown in add/remove)
          console.error('Toggle error:', error);
        } finally {
          set({ processing: false });
        }
      },

      // Check if product is in wishlist
      isInWishlist: (productId) => {
        const { wishlist } = get();
        if (!wishlist || !wishlist.items) return false;
        
        return wishlist.items.some(item => {
          const itemId = typeof item.product === 'string' ? item.product : item.product?._id;
          return itemId === productId;
        });
      },

      // Get wishlist item count
      getWishlistCount: () => {
        const { wishlist } = get();
        return wishlist?.items?.length || 0;
      },

      // Clear wishlist
      clearWishlist: async () => {
        try {
          await wishlistService.clearWishlist();
          set({ wishlist: { items: [] } });
          toast.success('Wishlist cleared');
        } catch (error) {
          console.error('Clear wishlist error:', error);
          toast.error('Failed to clear wishlist');
          throw error;
        }
      },

      // Move to cart
      moveToCart: async (productId) => {
        try {
          const res = await wishlistService.moveToCart(productId);
          // res contains { status, data: { wishlist, cart } }
          const wishlist = res.data.wishlist || res.data;
          set({ wishlist });
          toast.success('Moved to cart');
          return res.data;
        } catch (error) {
          console.error('Move to cart error:', error);
          const message = error.response?.data?.message || 'Failed to move to cart';
          toast.error(message);
          throw error;
        }
      },

      // Reset wishlist (on logout)
      resetWishlist: () => {
        set({ wishlist: null, loading: false, processing: false });
      }
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ 
        // Don't persist the wishlist data, only fetch from API
        // This prevents stale data issues
      })
    }
  )
);

export default useWishlistStore;
