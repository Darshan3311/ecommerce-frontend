import api from '../utils/api';

const wishlistService = {
  // Get wishlist
  getWishlist: async () => {
    // api interceptor already returns response.data (the JSON body)
    // so return it directly to preserve the { status, data } wrapper
    return await api.get('/wishlist');
  },

  // Add to wishlist
  addToWishlist: async (productId) => {
    return await api.post('/wishlist', { productId });
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    return await api.delete(`/wishlist/${productId}`);
  },

  // Clear wishlist
  clearWishlist: async () => {
    return await api.delete('/wishlist');
  },

  // Move to cart
  moveToCart: async (productId) => {
    return await api.post(`/wishlist/${productId}/move-to-cart`);
  }
};

export default wishlistService;
