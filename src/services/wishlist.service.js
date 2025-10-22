import api from '../utils/api';

const wishlistService = {
  // Get wishlist
  getWishlist: async () => {
    const res = await api.get('/wishlist');
    return res.data; // { status, data }
  },

  // Add to wishlist
  addToWishlist: async (productId) => {
    const res = await api.post('/wishlist', { productId });
    return res.data;
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    const res = await api.delete(`/wishlist/${productId}`);
    return res.data;
  },

  // Clear wishlist
  clearWishlist: async () => {
    const res = await api.delete('/wishlist');
    return res.data;
  },

  // Move to cart
  moveToCart: async (productId) => {
    const res = await api.post(`/wishlist/${productId}/move-to-cart`);
    return res.data;
  }
};

export default wishlistService;
